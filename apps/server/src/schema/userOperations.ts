import { builder, prisma, readOnlyPrisma } from '../builder.js';
import { ForgetPasswordDto, SignUpDto, UserDto } from './types.js';
import { GraphQLError } from 'graphql';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { sendForgetPasswordEmail } from '../email.js';
import { createJwt, createPassword, passwordsMatch } from "../contexts/user.js";
import { getUrl } from "../google.js";

const usernameSchema = z.string().min(3).max(30);
const emailSchema = z.string().email();
const passwordSchema = z
  .string()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/, {
    message:
      'Password must be at least 8 and at most 30 characters long and contain at least one uppercase letter, one lowercase letter and one number',
  });

builder.queryFields((t) => ({
  me: t.withAuth({ authenticated: true }).prismaField({
    type: UserDto,
    resolve: async (query, root, args, ctx, _info) =>
      await readOnlyPrisma.user.findUniqueOrThrow({
        ...query,
        where: { id: ctx.currentUserId },
      }),
  }),
}));

const signUpSchema = z.object({
  name: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const updateUserSchema = z.object({
  name: usernameSchema,
  oldPassword: passwordSchema.optional(),
  newPassword: passwordSchema.optional(),
});

builder.mutationFields((t) => ({
  signup: t.field({
    type: SignUpDto,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
    },
    validate: (args) => signUpSchema.parse(args) && true,
    resolve: async (root, args, _ctx, _info) => {
      const existingUser = await readOnlyPrisma.user.findUnique({
        where: { email: args.email },
      });
      if (existingUser) {
        throw new GraphQLError('User already exists');
      }
      const password = await createPassword(args.password);
      const user = await prisma.user.create({
        data: { ...args, password },
      });
      const token = createJwt(user.id);
      return { token, user };
    },
  }),
  login: t.field({
    type: SignUpDto,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    validate: (args) => loginSchema.parse(args) && true,
    resolve: async (root, args, _ctx, _info) => {
      const user = await readOnlyPrisma.user.findUnique({
        where: { email: args.email },
      });
      if (!user) {
        throw new GraphQLError('Invalid credentials');
      }
      const valid = await passwordsMatch(args.password, user.password);
      if (!valid) {
        throw new GraphQLError('Invalid credentials');
      }
      const token = createJwt(user.id);
      return { token, user };
    },
  }),
  updateUser: t.withAuth({ authenticated: true }).prismaField({
    type: UserDto,
    args: {
      name: t.arg.string(),
      newPassword: t.arg.string({required: false, validate: { schema: passwordSchema }}),
      oldPassword: t.arg.string({required: false, validate: { schema: passwordSchema }}),
    },
    validate: (args) => !!updateUserSchema.parse(args) && !!args.oldPassword === !!args.newPassword,
    resolve: async (query, root, args, ctx, _info) => {
      if (args.oldPassword && args.newPassword) {
        const user = await readOnlyPrisma.user.findUnique({
          where: { id: ctx.currentUserId },
        });
        if (!user) {
          throw new GraphQLError('User not found');
        }
        const valid = await passwordsMatch(args.oldPassword, user.password);
        if (!valid) {
          throw new GraphQLError('Invalid old password');
        }
        const password = await createPassword(args.newPassword);
        delete args.oldPassword;
        delete args.newPassword;
        return prisma.user.update({
          ...query,
          where: { id: ctx.currentUserId },
          data: { ...args as z.infer<typeof updateUserSchema>, password },
        });
      }
      return prisma.user.update({
        ...query,
        where: { id: ctx.currentUserId },
        data: args as z.infer<typeof updateUserSchema>,
      });
    },
  }),
  forgetPassword: t.prismaField({
    type: ForgetPasswordDto,
    args: {
      email: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args, _ctx, _info) => {
      const user = await readOnlyPrisma.user.findUnique({
        where: { email: args.email },
      });
      if (!user) {
        throw new GraphQLError('No user with such email');
      }
      const token = randomUUID();
      const forgetPassword = await prisma.forgetPassword.upsert({
        where: { id: user.id },
        create: { id: user.id, token },
        update: { token },
      });
      await sendForgetPasswordEmail({
        email: user.email,
        name: user.name,
        action_url: `https://teacherfox.com.cy/reset-password?token=${token}`,
        operating_system: 'to be filled',
        browser_name: 'to be filled',
      });
      return forgetPassword;
    },
  }),
  resetPassword: t.prismaField({
    type: UserDto,
    args: {
      token: t.arg.string({ required: true }),
      password: t.arg.string({
        validate: {
          schema: passwordSchema,
        },
      }),
    },
    resolve: async (query, root, args, _ctx, _info) => {
      const forgetPassword = await readOnlyPrisma.forgetPassword.findUnique({
        where: { token: args.token, createdAt: { gt: new Date(Date.now() - 1000 * 60 * 60 * 24) } },
        include: { user: query },
      });
      if (!forgetPassword) {
        throw new GraphQLError('Invalid token');
      }
      if (args.password) {
        const password = await createPassword(args.password);
        await prisma.$transaction([
          prisma.user.update({
            where: { id: forgetPassword.id },
            data: { password },
          }),
          prisma.forgetPassword.delete({
            where: { id: forgetPassword.id },
          }),
        ]);
      }
      return forgetPassword.user;
    },
  }),
}));
