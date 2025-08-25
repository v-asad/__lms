import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { NewRoleInput, Role, RoleArgs, UpdateRoleInput } from './schema';

import { DuplicateError, NotFoundError } from '@/utils/errors';
import { HandleErrors } from '@/decorators/handleErrors';

import { Prisma, PrismaClient } from '@prisma/client';

import { PrismaSelection, ProvideFields } from '@/utils/select';
import { Protected } from '@/decorators/protected';

const ENTITY = Prisma.ModelName.Role;

const prisma = new PrismaClient();

@HandleErrors()
@Resolver(Role)
export default class RoleResolver {
  @Protected('role:read')
  @Query(() => Role, { nullable: true })
  async role(
    @Arg('id') id: string,
    @ProvideFields<Role>() select: PrismaSelection<Role>,
  ) {
    const role = await prisma.role.findFirst({ where: { id }, select });
    if (role) return role;

    throw new NotFoundError(ENTITY, 'id', id);
  }

  @Protected('role:read')
  @Query(() => [Role])
  async roles(
    @Args() { skip, take }: RoleArgs,
    @ProvideFields<Role>() select: PrismaSelection<Role>,
  ) {
    return prisma.role.findMany({ skip, take, select });
  }

  @Protected('role:create')
  @Mutation(() => Role)
  async addRole(
    @Arg('addRoleData') addRoleData: NewRoleInput,
    @ProvideFields<Role>() select: PrismaSelection<Role>,
  ) {
    const existing = await prisma.role.findFirst({
      where: { name: addRoleData.name },
    });
    if (existing) throw new DuplicateError(ENTITY, 'name', addRoleData.name);

    return prisma.role.create({ data: addRoleData, select });
  }

  @Protected('role:update', 'permission:connect')
  @Mutation(() => Boolean)
  async addPermissionsToRole(
    @Arg('id') id: string,
    @Arg('permissionsToAdd', () => [String]) permissionsToAdd: string[],
  ) {
    const role = await prisma.role.findFirst({ where: { id } });
    if (!role) throw new NotFoundError(ENTITY, 'id', id);

    await prisma.role.update({
      where: { id },
      data: {
        permissions: { connect: permissionsToAdd.map((id) => ({ id })) },
      },
    });

    return true;
  }

  @Protected('role:update', 'permission:disconnect')
  @Mutation(() => Boolean)
  async removePermissionsToRole(
    @Arg('id') id: string,
    @Arg('permissionsToRemove', () => [String]) permissionsToRemove: string[],
  ) {
    const role = await prisma.role.findFirst({ where: { id } });
    if (!role) throw new NotFoundError(ENTITY, 'id', id);

    await prisma.role.update({
      where: { id },
      data: {
        permissions: { disconnect: permissionsToRemove.map((id) => ({ id })) },
      },
    });

    return true;
  }

  @Protected('role:update')
  @Mutation(() => Role, { nullable: true })
  async updateRole(
    @Arg('id') id: string,
    @Arg('updateRoleData')
    updateRoleData: UpdateRoleInput,
    @ProvideFields<Role>() select: PrismaSelection<Role>,
  ) {
    const role = await prisma.role.findFirst({ where: { id } });
    if (role)
      return prisma.role.update({
        where: { id },
        data: updateRoleData,
        select,
      });

    throw new NotFoundError(ENTITY, 'id', id);
  }

  @Protected('role:delete')
  @Mutation(() => Boolean)
  async removeRole(@Arg('id') id: string) {
    const role = await prisma.role.findFirst({ where: { id } });
    if (role) {
      await prisma.role.delete({ where: { id } });
      return true;
    }

    throw new NotFoundError(ENTITY, 'id', id);
  }
}
