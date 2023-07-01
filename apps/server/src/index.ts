import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import { createContext } from './context.js';
import schema from './schema/index.js';
import { logger } from 'logger';
import { MODE, PORT } from "./config/config.js";
import { useDisableIntrospection } from '@graphql-yoga/plugin-disable-introspection'

const index = () => {
  const yoga = createYoga({
      schema,
      context: createContext,
      graphiql: MODE !== 'production',
      plugins: MODE !== 'production' ? [] : [useDisableIntrospection()]
  });
  const server = createServer(yoga);
  const port = PORT;
  server.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}/graphql`);
  });
};

index();
