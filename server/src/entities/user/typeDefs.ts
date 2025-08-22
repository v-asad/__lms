const userTypeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    users: [User!]!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateUser(username: String, email: String, password: String): User!
    deleteUser(id: ID!): Boolean!
  }
`;

export default userTypeDefs;
