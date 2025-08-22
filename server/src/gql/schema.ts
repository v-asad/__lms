import { ApolloServer } from '@apollo/server';

import { AuthContext } from '@/utils/auth';

import typeDefs from '@/entities/typeDefs';
import resolvers from '@/entities/resolvers';

const gqlServer = new ApolloServer<AuthContext>({
  typeDefs,
  resolvers,
});

export default gqlServer;
