import { PrismaClient } from '@prisma/client';
import seedPermissions from './permissions';
import seedAdminUserAndRole from './admin';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  await seedPermissions();
  await seedAdminUserAndRole();

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
