import { builder } from './builder.js';

export const PostDto = builder.prismaObject('Post', {
  fields: (t) => ({
    id: t.exposeID('id'),
    url: t.exposeString('url'),
    description: t.exposeString('description'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    comments: t.relation('comments'),
    postedBy: t.relation('postedBy'),
    votes: t.relation('votes'),
  }),
});

export const CommentDto = builder.prismaObject('Comment', {
  fields: (t) => ({
    id: t.exposeID('id'),
    body: t.exposeString('body'),
    post: t.relation('post'),
  }),
});

export const UserDto = builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    posts: t.relation('posts'),
    votes: t.relation('votes'),
  }),
});

export const VoteDto = builder.prismaObject('Vote', {
  fields: (t) => ({
    id: t.exposeID('id'),
    user: t.relation('user'),
    post: t.relation('post'),
  }),
});

export const SignUpDto = builder.simpleObject('SignUpDto', {
  fields: (t) => ({
    user: t.field({ type: UserDto, nullable: false }),
    token: t.string({ nullable: false }),
  }),
});

export const MessageDto = builder.prismaObject('Message', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    message: t.exposeString('message'),
  }),
});
