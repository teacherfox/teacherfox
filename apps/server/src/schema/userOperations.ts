import { builder, prisma, readOnlyPrisma } from '../builder.js';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { SignUpDto } from '../types.js';
import { AUTH_SECRET } from '../config/config.js';
import { GraphQLError } from 'graphql';
import { z } from 'zod';

const { sign } = jsonwebtoken;
const { compare, hash } = bcryptjs;

const usernameSchema = z.string().min(3).max(30);
const emailSchema = z.string().email();
const passwordSchema = z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/, { message: "Password must be at least 8 and at most 30 characters long and contain at least one uppercase letter, one lowercase letter and one number" });

builder.queryFields((t) => ({
  me: t.withAuth({ authenticated: true }).prismaField({
    type: 'User',
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
  password: passwordSchema
})

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

const updateUserSchema = z.object({
  name: usernameSchema
})

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
      const password = await hash(args.password, 10);
      const user = await prisma.user.create({
        data: { ...args, password },
      });
      const token = sign({ userId: user.id }, AUTH_SECRET);
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
      const valid = await compare(args.password, user.password);
      if (!valid) {
        throw new GraphQLError('Invalid credentials');
      }
      const token = sign({ userId: user.id }, AUTH_SECRET);
      return { token, user };
    },
  }),
  updateUser: t.withAuth({ authenticated: true }).prismaField({
    type: 'User',
    args: {
      name: t.arg.string(),
    },
    validate: (args) => updateUserSchema.parse(args) && true,
    resolve: async (query, root, args, ctx, _info) =>
      await prisma.user.update({
        ...query,
        where: { id: ctx.currentUserId },
        data: args as z.infer<typeof updateUserSchema>,
      }),
  }),
  forgetPassword: t.field({
    type: 'Boolean',
    args: {
      email: t.arg.string({ required: true }),
    },
    resolve: async (root, args, _ctx, _info) => {
      const user = await readOnlyPrisma.user.findUnique({
        where: { email: args.email },
      });
      if (!user) {
        throw new GraphQLError('No user with such email');
      }
      return true;
    }
  }),
}));
