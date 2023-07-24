import { builder } from '../builder.js';

export const UserDto = builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    forgetPassword: t.relation('forgetPassword'),
    messagesSent: t.relation('messagesSent'),
    messagesReceived: t.relation('messagesReceived'),
  }),
});

export const ForgetPasswordDto = builder.prismaObject('ForgetPassword', {
  fields: (t) => ({
    id: t.exposeID('id'),
    token: t.exposeString('token'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    updatedAt: t.expose('updatedAt', { type: 'Date' }),
    user: t.relation('user'),
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
