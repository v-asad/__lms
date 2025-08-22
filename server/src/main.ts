import { startStandaloneServer } from '@apollo/server/standalone';
import gqlServer from './gql/schema';
import config from './config/config';

//  1. creates an Express app
//  2. installs ApolloServer instance as middleware
//  3. prepares app to handle incoming requests
startStandaloneServer(gqlServer, {
  listen: { port: config.port },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
