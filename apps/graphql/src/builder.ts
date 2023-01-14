import SchemaBuilder from '@pothos/core';
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

export const prisma = new PrismaClient({});

interface AuthenticatedContext extends GraphQLContext {
  currentUserId: NonNullable<GraphQLContext['currentUserId']>;
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
  plugins: [ScopeAuthPlugin, PrismaPlugin, RelayPlugin, SimpleObjectsPlugin],
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
});

builder.addScalarType('Date', DateTimeResolver, {});
