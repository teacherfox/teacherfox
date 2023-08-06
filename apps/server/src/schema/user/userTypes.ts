import { builder } from '../../builder.js';
import { User } from '../../../.prisma/index.js';

export const UserDto = builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    forgetPassword: t.relation('forgetPassword', { nullable: true }),
    messagesSent: t.relation('messagesSent'),
    messagesReceived: t.relation('messagesReceived'),
    roles: t.field({
      type: [RoleDto],
      select: (_args, _ctx, nestedSelection) => ({
        roles: {
          select: {
            role: nestedSelection(true),
          },
        },
      }),
      resolve: (user) => user.roles?.map(({ role }) => role) ?? [],
    }),
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

export enum UserRoleEnum {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export const UserRoleEnumDto = builder.enumType(UserRoleEnum, {
  name: 'UserRoleEnum',
});

export const RoleDto = builder.prismaObject('Role', {
  select: { id: true },
  fields: (t) => ({
    name: t.exposeString('name'),
  }),
});
