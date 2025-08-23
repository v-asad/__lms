import { NewRoleInput, UpdateRoleInput, RoleArgs } from './schema';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class RoleService {
  async findAll({ skip, take }: RoleArgs) {
    return await prisma.role.findMany({ skip, take });
  }
  async findById(id: string) {
    return await prisma.role.findFirst({ where: { id } });
  }
  async add(data: NewRoleInput) {
    return await prisma.role.create({
      data,
    });
  }
  async update(id: string, data: UpdateRoleInput) {
    return await prisma.role.update({
      data,
      where: { id },
    });
  }
  async remove(id: string) {
    await prisma.role.delete({ where: { id } });
  }
}
