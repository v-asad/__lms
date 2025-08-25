import { PrismaClient } from '@prisma/client';

import { hashPassword } from '../../src/utils/auth';

const prisma = new PrismaClient();

const ADMIN_ROLE = 'admin';
const ADMIN_EMAIL = 'admin@lms.co';
const ADMIN_PASSWORD = 'admin';

export default async function seedAdminUserAndRole() {
  const permissions = await prisma.permission.findMany();

  const role = await prisma.role.create({
    data: {
      name: ADMIN_ROLE,
      permissions: { connect: permissions.map((p) => ({ id: p.id })) },
    },
  });

  await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: ADMIN_EMAIL,
      password: await hashPassword(ADMIN_PASSWORD),
      role: { connect: { id: role.id } },
    },
  });
}
