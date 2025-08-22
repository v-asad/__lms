import { ApolloServer } from '@apollo/server';

import { AuthContext } from '@/utils/auth';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

const gqlServer = new ApolloServer<AuthContext>({
  typeDefs,
  resolvers,
});

export default gqlServer;
