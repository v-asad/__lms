import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@/entities/user/types';
import config from '@/config/config';

export interface JwtPayload {
  userId: string;
}

export interface AuthContext {
  user: JwtPayload | null;
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashed: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};

export const createToken = (user: User): string => {
  return jwt.sign({ userId: user.id }, config.secret, { expiresIn: '7d' });
};

export const getUserFromToken = (token?: string): JwtPayload | null => {
  try {
    if (token) return jwt.verify(token, config.secret) as JwtPayload;
  } catch {}

  return null;
};
