import { builder } from './builder.js';

export const UserDto = builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
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
