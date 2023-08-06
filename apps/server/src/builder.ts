import SchemaBuilder from '@pothos/core';
import ValidationPlugin from '@pothos/plugin-validation';
import { PrismaClient } from '../.prisma/index.js';
import PrismaPlugin from '@pothos/plugin-prisma';
// This is the default location for the generator, but this can be
// customized as described above.
// Using a type only import will help avoid issues with undeclared
// exports in esm mode
import type PrismaTypes from '@pothos/plugin-prisma/generated.js';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import { DateTimeResolver } from 'graphql-scalars';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import RelayPlugin from '@pothos/plugin-relay';
import { GraphQLContext } from './context.js';
import { GraphQLError } from 'graphql';

export const prisma = new PrismaClient({});
export const readOnlyPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.READ_ONLY_DATABASE_URL ?? process.env.DATABASE_URL,
    },
  },
});

interface AuthenticatedContext extends GraphQLContext {
  currentUserId: NonNullable<GraphQLContext['currentUserId']>;
  isAdmin: NonNullable<GraphQLContext['isAdmin']>;
  isTeacher: NonNullable<GraphQLContext['isTeacher']>;
  isStudent: NonNullable<GraphQLContext['isStudent']>;
}

export const builder = new SchemaBuilder<{
  Context: GraphQLContext;
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
  PrismaTypes: PrismaTypes;
  AuthScopes: {
    authenticated: boolean;
  };
  AuthContexts: {
    authenticated: AuthenticatedContext;
  };
}>({
  plugins: [ScopeAuthPlugin, PrismaPlugin, RelayPlugin, SimpleObjectsPlugin, ValidationPlugin],
  prisma: {
    client: prisma,
    // defaults to false, uses /// comments from prisma schema as descriptions
    // for object types, relations and exposed fields.
    // descriptions can be omitted by setting description to false
    // exposeDescriptions: boolean | { models: boolean, fields: boolean },
    // use where clause from prismaRelatedConnection for totalCount (will true by default in next major version)
    filterConnectionTotalCount: true,
  },
  authScopes: async (context) => ({
    authenticated: !!context.currentUserId,
  }),
  scopeAuthOptions: {
    // Recommended when using subscriptions
    // when this is not set, auth checks are run when event is resolved rather than when the subscription is created
    authorizeOnSubscribe: true,
  },
  relayOptions: {
    // These will become the defaults in the next major version
    clientMutationId: 'omit',
    cursorType: 'ID',
  },
  validationOptions: {
    // optionally customize how errors are formatted
    validationError: (zodError, _args, _context, _info) => {
      // the default behavior is to just throw the zod error directly
      return new GraphQLError(zodError.issues.map((issue) => issue.message).join('\n'));
    },
  },
});

builder.addScalarType('Date', DateTimeResolver, {});
