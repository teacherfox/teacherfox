import { builder, prisma } from '../builder.js';
import { CommentDto } from '../types.js';

builder.mutationField('createComment', (t) =>
  t.withAuth({ authenticated: true }).field({
    type: CommentDto,
    args: {
      body: t.arg.string({ required: true }),
      postId: t.arg.string({ required: true }),
    },
    resolve: async (root, args, _ctx, _info) =>
      await prisma.comment.create({
        data: args,
      }),
  })
);
