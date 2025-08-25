import { getUserFromToken } from '@/utils/auth';
import { PrismaClient } from '@prisma/client';
import { IncomingMessage } from 'http';

const prisma = new PrismaClient();

export default async function authContext({ req }: { req: IncomingMessage }) {
  const token = req.headers.authorization;
  const payload = getUserFromToken(token); // returns { id, roleId, ... } or null

  if (!payload) return { user: null, permissions: [] };

  const user = await prisma.user.findFirst({
    where: { id: payload.userId },
    select: { role: { select: { permissions: true } }, permissions: true },
  });

  if (!user) return { user: null, permissions: [] };

  const permissions = [
    ...user.role.permissions.map((p) => p.name),
    ...user.permissions.map((p) => p.name),
  ];

  return { user: { userId: payload.userId }, permissions };
}
