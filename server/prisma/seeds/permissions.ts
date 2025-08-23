import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const permissionsSeedData: string[] = [
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
