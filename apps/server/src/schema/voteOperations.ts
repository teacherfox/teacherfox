import { builder, prisma, readOnlyPrisma } from "../builder.js";
import { VoteDto } from '../types.js';
import { pubSub } from '../pubsub.js';
import { Vote } from '../../.prisma';
import { GraphQLError } from 'graphql';

builder.queryFields((t) => ({
  votes: t.prismaField({
    type: ['Vote'],
    args: {
      postId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args, _ctx, _info) =>
      readOnlyPrisma.vote.findMany({
        ...query,
        where: { postId: args.postId },
      }),
  }),
}));

builder.mutationFields((t) => ({
  createVote: t.withAuth({ authenticated: true }).field({
    type: VoteDto,
    args: {
      postId: t.arg.string({ required: true }),
    },
    resolve: async (root, args, ctx, _info) => {
      const existingVote = await readOnlyPrisma.vote.findUnique({
        where: {
          postId_userId: { postId: args.postId, userId: ctx.currentUserId },
        },
      });
      if (existingVote) {
        throw new GraphQLError(`Already voted for post: ${args.postId}`);
      }
      const newVote = await prisma.vote.create({
        data: { ...args, userId: ctx.currentUserId },
      });
      pubSub.publish('newVote', { newVote });
      return newVote;
    },
  }),
}));

builder.subscriptionFields((t) => ({
  newVote: t.field({
    type: VoteDto,
    resolve: async (value: { newVote: Vote }) => value.newVote,
    subscribe: async (root, _args, _ctx) => pubSub.subscribe('newVote'),
  }),
}));
