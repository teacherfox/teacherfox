import { builder } from '../../builder.js';
import { User } from '../../../.prisma/index.js';

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

export const TokenUserDto = builder
  .objectRef<{
    token: string;
    user: User;
  }>('TokenDto')
  .implement({
    fields: (t) => ({
      token: t.string({ nullable: false, resolve: (result) => result.token }),
      user: t.field({
        type: UserDto,
        nullable: false,
        resolve: (result) => result.user,
      }),
    }),
  });

export const GenerateGoogleAuthUrlResponseDto = builder.simpleObject('GenerateGoogleAuthUrlResponse', {
  fields: (t) => ({
    url: t.string({ nullable: false }),
  }),
});
