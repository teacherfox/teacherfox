import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  watch: true,
  emitLegacyCommonJSImports: false,
  generates: {
    './src/schema/generated/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
  config: {
    scalars: {
      Date: 'Date',
      UUID: 'string',
    },
  },
};
export default config;
