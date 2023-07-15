import { builder } from '../builder.js';
import './userOperations.js';
import './messageOperations.js';
import '../types.js';

builder.queryType({
  fields: (_t) => ({}),
});

builder.mutationType({
  fields: (_t) => ({}),
});

builder.subscriptionType({
  fields: (_t) => ({}),
});

builder.queryFields((t) => ({
  info: t.string({ resolve: () => `This is the API of a Hackernews Clone` }),
}));

export default builder.toSchema();
