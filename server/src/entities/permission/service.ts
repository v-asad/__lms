import {
  PermissionArgs,
  NewPermissionInput,
  UpdatePermissionInput,
} from './schema';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class PermissionService {
  async findAll({ skip, take }: PermissionArgs) {
    return await prisma.permission.findMany({ skip, take });
  }
  async findById(id: string) {
    return await prisma.permission.findFirst({ where: { id } });
  }
  async add(data: NewPermissionInput) {
    return await prisma.permission.create({
      data,
    });
  }
  async update(id: string, data: UpdatePermissionInput) {
    return await prisma.permission.update({
      data,
      where: { id },
    });
  }
  async remove(id: string) {
    await prisma.permission.delete({ where: { id } });
  }
}
