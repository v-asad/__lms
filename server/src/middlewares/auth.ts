import { IncomingMessage } from 'http';
import { getUserFromToken } from '@/utils/auth';

export default async function authContext({ req }: { req: IncomingMessage }) {
  const token = req.headers.authorization;
  const user = getUserFromToken(token);
  return { user };
}
