import { builder, prisma } from '../builder.js';
import { pubSub } from '../pubsub.js';
import { MessageDto } from '../types.js';
import { Message } from '../../.prisma';
import { filter, map, pipe, Repeater } from '@graphql-yoga/subscription';

builder.queryFields((t) => ({
  messages: t.prismaField({
    type: ['Message'],
    resolve: async (query, _root, _args, _ctx, _info) =>
      prisma.message.findMany({
        ...query,
      }),
  }),
}));

builder.mutationFields((t) => ({
  userTyping: t.withAuth({ authenticated: true }).field({
    type: 'Boolean',
    args: {
      receiverId: t.arg.string({ required: true }),
    },
    resolve: async (root, args, ctx, _info) => {
      pubSub.publish('userTyping', { receiverId: args.receiverId, senderId: ctx.currentUserId });
      return true;
    },
  }),

  createMessage: t.withAuth({ authenticated: true }).field({
    type: MessageDto,
    args: {
      message: t.arg.string({ required: true }),
      receiverId: t.arg.string({ required: true }),
    },
    resolve: async (root, args, ctx, _info) => {
      const newMessage = await prisma.message.create({
        data: { ...args, senderId: ctx.currentUserId },
      });
      pubSub.publish('newMessages', { newMessages: [newMessage] });
      return newMessage;
    },
  }),

  updateMessage: t.withAuth({ authenticated: true }).field({
    type: MessageDto,
    args: {
      message: t.arg.string({ required: true }),
      id: t.arg.string({ required: true }),
    },
    resolve: async (root, args, _ctx, _info) => {
      return await prisma.message.update({
        where: { id: args.id },
        data: { message: args.message },
      });
    },
  }),

  deleteMessage: t.withAuth({ authenticated: true }).field({
    type: MessageDto,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (root, args, _ctx, _info) => {
      return await prisma.message.delete({
        where: { id: args.id },
      });
    },
  }),
}));

builder.subscriptionFields((t) => ({
  newMessage: t.withAuth({ authenticated: true }).field({
    type: [MessageDto],
    resolve: async (value: { newMessages: Message[] }) => value.newMessages,
    subscribe: async (root, args, ctx) => {
      const latestUserMessages = await prisma.message.findMany({
        where: {
          receiverId: ctx.currentUserId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      });
      return pipe(
        Repeater.merge([undefined, pubSub.subscribe('newMessages')]),
        map((a) => a ?? { newMessages: latestUserMessages }),
        filter((value: { newMessages: Message[] }) =>
          value.newMessages.every((newMessage) => newMessage.receiverId === ctx.currentUserId)
        )
      );
    },
  }),

  userTyping: t.withAuth({ authenticated: true }).field({
    type: 'Boolean',
    resolve: async (_value: { receiverId: string; senderId: string }) => true,
    subscribe: async (root, args, ctx) =>
      pipe(
        pubSub.subscribe('userTyping'),
        filter((value: { receiverId: string; senderId: string }) => value.receiverId === ctx.currentUserId)
      ),
  }),
}));
