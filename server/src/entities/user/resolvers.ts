import { IResolvers } from '@graphql-tools/utils';
import { users } from './data';
import { User } from './types';
import {
  hashPassword,
  comparePassword,
  createToken,
  AuthContext,
} from '@/utils/auth';

let userIdCounter = 1;

const userResolvers: IResolvers<any, AuthContext> = {
  Query: {
    me: (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return users.find((u) => u.id === user.userId) || null;
    },
    users: (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return users;
    },
  },

  Mutation: {
    signup: async (
      _,
      { username, email, password },
    ): Promise<{ token: string; user: User }> => {
      const existing = users.find((u) => u.email === email);
      if (existing) throw new Error('Email already exists');

      const hashed = await hashPassword(password);
      const newUser: User = {
        id: String(userIdCounter++),
        username,
        email,
        password: hashed,
      };
      users.push(newUser);

      const token = createToken(newUser);
      return { token, user: newUser };
    },

    login: async (
      _,
      { email, password },
    ): Promise<{ token: string; user: User }> => {
      const user = users.find((u) => u.email === email);
      if (!user) throw new Error('User not found');

      const valid = await comparePassword(password, user.password);
      if (!valid) throw new Error('Invalid password');

      const token = createToken(user);
      return { token, user };
    },

    updateUser: async (
      _,
      { username, email, password },
      { user },
    ): Promise<User> => {
      if (!user) throw new Error('Not authenticated');

      const currentUser = users.find((u) => u.id === user.userId);
      if (!currentUser) throw new Error('User not found');

      if (username) currentUser.username = username;
      if (email) currentUser.email = email;
      if (password) currentUser.password = await hashPassword(password);

      return currentUser;
    },

    deleteUser: (_, { id }, { user }): boolean => {
      if (!user) throw new Error('Not authenticated');

      const index = users.findIndex((u) => u.id === id);
      if (index === -1) throw new Error('User not found');

      users.splice(index, 1);
      return true;
    },
  },
};

export default userResolvers;
