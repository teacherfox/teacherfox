import { builder } from '../../builder.js';
import { GenerateGoogleAuthUrlResponseDto, TokenUserDto } from './userTypes.js';
import { generateAuthUrl, googleLogin } from '../../google.js';
import { isTFError } from '../../types.js';
import { GraphQLError } from 'graphql';
import { queryFromInfo } from '@pothos/plugin-prisma';

builder.queryFields((t) => ({
  generateGoogleAuthUrl: t.field({
    args: {
      state: t.arg.string({ required: true }),
    },
    type: GenerateGoogleAuthUrlResponseDto,
    resolve: async (_root, args, _ctx, _info) => ({
      url: generateAuthUrl(args.state),
    }),
  }),
}));

builder.mutationFields((t) => ({
  googleLoginSignup: t.field({
    args: {
      code: t.arg.string({ required: true }),
    },
    type: TokenUserDto,
    resolve: async (_root, args, ctx, info) => {
      const query = queryFromInfo({
        context: ctx,
        info,
        path: ['user'],
      });
      const googleUserToken = await googleLogin(args.code, query);
      if (isTFError(googleUserToken)) {
        throw new GraphQLError(googleUserToken.message);
      }
      return googleUserToken;
    },
  }),
}));
