import { PrismaSelection } from '@/utils/select';
import { NewRoleInput, UpdateRoleInput, RoleArgs } from './schema';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export default class RoleService {
  async findAll(select: PrismaSelection<Role>, { skip, take }: RoleArgs) {
    return await prisma.role.findMany({
      skip,
      take,
      select,
    });
  }
  async findById(id: string) {
    return await prisma.role.findFirst({
      where: { id },
      include: { permissions: true },
    });
  }
  async add(data: NewRoleInput) {
    return await prisma.role.create({
      data,
      include: { permissions: true },
    });
  }
  async update(id: string, data: UpdateRoleInput) {
    return await prisma.role.update({
      data,
      where: { id },
      include: { permissions: true },
    });
  }
  async remove(id: string) {
    await prisma.role.delete({ where: { id } });
  }
}
