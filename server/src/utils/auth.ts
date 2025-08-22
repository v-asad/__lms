import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@/entities/user/types';

const SECRET = 'SUPER_SECRET_KEY'; // move to process.env in real projects

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
  return jwt.sign({ userId: user.id }, SECRET, { expiresIn: '7d' });
};

export const getUserFromToken = (token?: string): JwtPayload | null => {
  try {
    if (token) return jwt.verify(token, SECRET) as JwtPayload;
  } catch {}

  return null;
};
