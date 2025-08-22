import { startStandaloneServer } from '@apollo/server/standalone';
import gqlServer from './gql/schema';
import config from './config/config';
import authContext from './middlewares/auth';

const options = {
  listen: { port: config.port },
  context: authContext,
};

startStandaloneServer(gqlServer, options).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
