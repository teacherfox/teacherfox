import { builder, prisma } from '../builder.js';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { SignUpDto } from '../types.js';
import { APP_SECRET } from '../config/config.js';

const { sign } = jsonwebtoken;
const { compare, hash } = bcryptjs;

builder.queryFields((t) => ({
  me: t.withAuth({ authenticated: true }).prismaField({
    type: 'User',
    resolve: async (query, root, args, ctx, _info) =>
      await prisma.user.findUniqueOrThrow({
        ...query,
        where: { id: ctx.currentUserId },
      }),
  }),
}));

builder.mutationFields((t) => ({
  signup: t.field({
    type: SignUpDto,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (root, args, _ctx, _info) => {
      const password = await hash(args.password, 10);
      const user = await prisma.user.create({
        data: { ...args, password },
      });
      const token = sign({ userId: user.id }, APP_SECRET);
      return { token, user };
    },
  }),
  login: t.field({
    type: SignUpDto,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (root, args, _ctx, _info) => {
      const user = await prisma.user.findUniqueOrThrow({
        where: { email: args.email },
      });
      const valid = await compare(args.password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }
      const token = sign({ userId: user.id }, APP_SECRET);
      return { token, user };
    },
  }),
}));
