import 'reflect-metadata';
import config from './config/config';

import { startStandaloneServer } from '@apollo/server/standalone';
import authContext from './middlewares/auth';
import { ApolloServer } from '@apollo/server';
import { AuthContext } from './utils/auth';
import generateSchema from './gql/schema';
import { formatError } from './utils/errors';

generateSchema().then((schema) => {
  startStandaloneServer(
    new ApolloServer<AuthContext>({
      schema,
      includeStacktraceInErrorResponses: false,
      formatError: formatError,
    }),
    {
      listen: { port: config.port },
      context: authContext,
    },
  ).then(({ url }) => console.log(`🚀  Server ready at: ${url}`));
});
