import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const permissionsSeedData: string[] = [
  // PERMISSIONS
  'permission:create',
  'permission:read',
  'permission:update',
  'permission:delete',
  'permission:connect',
  'permission:disconnect',

  // ROLES
  'role:create',
  'role:read',
  'role:update',
  'role:delete',
  'role:connect',
  'role:disconnect',

  // USERS
  'user:create',
  'user:read',
  'user:update',
  'user:delete',

  // COURSES
  'course:create',
  'course:read',
  'course:update',
  'course:delete',
];

export default async function seedPermissions() {
  await prisma.permission.createMany({
    data: permissionsSeedData.map((name) => ({ name })),
  });
}
