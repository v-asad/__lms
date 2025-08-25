import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import {
  Permission,
  PermissionArgs,
  NewPermissionInput,
  UpdatePermissionInput,
} from './schema';

import { DuplicateError, NotFoundError } from '@/utils/errors';
import { HandleErrors } from '@/decorators/handleErrors';

import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaSelection, ProvideFields } from '@/utils/select';

const ENTITY = Prisma.ModelName.Permission;

const prisma = new PrismaClient();

@HandleErrors()
@Resolver(Permission)
export default class PermissionResolver {
  @Query(() => Permission, { nullable: true })
  async permission(
    @Arg('id') id: string,
    @ProvideFields<Permission>() select: PrismaSelection<Permission>,
  ) {
    const permission = await prisma.permission.findFirst({
      where: { id },
      select,
    });
    if (permission) return permission;

    throw new NotFoundError(ENTITY, 'id', id);
  }

  @Query(() => [Permission])
  async permissions(
    @Args() { skip, take }: PermissionArgs,
    @ProvideFields<Permission>() select: PrismaSelection<Permission>,
  ) {
    return prisma.permission.findMany({ skip, take, select });
  }

  @Mutation(() => Permission)
  async addPermission(
    @Arg('addPermissionData') addPermissionData: NewPermissionInput,
    @ProvideFields<Permission>() select: PrismaSelection<Permission>,
  ) {
    const existing = await prisma.permission.findFirst({
      where: { name: addPermissionData.name },
    });
    if (existing)
      throw new DuplicateError(ENTITY, 'name', addPermissionData.name);

    return prisma.permission.create({ data: addPermissionData, select });
  }

  @Mutation(() => Permission, { nullable: true })
  async updatePermission(
    @Arg('id') id: string,
    @Arg('updatePermissionData')
    updatePermissionData: UpdatePermissionInput,
    @ProvideFields<Permission>() select: PrismaSelection<Permission>,
  ) {
    const permission = await prisma.permission.findFirst({
      where: { id },
    });
    if (permission)
      return prisma.permission.update({
        where: { id },
        data: updatePermissionData,
        select,
      });

    throw new NotFoundError(ENTITY, 'id', id);
  }

  @Mutation(() => Boolean)
  async removePermission(@Arg('id') id: string) {
    const permission = await prisma.permission.findFirst({
      where: { id },
    });
    if (permission) {
      await prisma.permission.delete({ where: { id } });
      return true;
    }

    throw new NotFoundError(ENTITY, 'id', id);
  }
}
