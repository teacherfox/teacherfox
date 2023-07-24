import { createYoga } from 'graphql-yoga';
import { createContext } from './context.js';
import schema from './schema/index.js';
import { logger } from 'logger';
import { Environment, MODE, PORT } from './config/config.js';
import { useDisableIntrospection } from '@graphql-yoga/plugin-disable-introspection';
import express from 'express';
import { googleLogin } from "./google.js";
import { isTFError } from "./types.js";

const index = () => {
  const app = express();

  const yoga = createYoga({
    schema,
    context: createContext,
    graphiql: MODE !== Environment.production,
    plugins: MODE !== Environment.production ? [] : [useDisableIntrospection()],
  });
  app.use(yoga.graphqlEndpoint, yoga);

  app.get('/api/auth/callback/google', async (req, res) => {
    const code = req.query.code as string;
    const result = await googleLogin(code);
    if (isTFError(result)) {
      res.status(401).send(result);
      return;
    }
    res.send(result);
  });
  const port = PORT;
  app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}/graphql`);
  });
};

index();
