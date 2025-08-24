import { Arg, Args, Info, Mutation, Query, Resolver } from 'type-graphql';
import { NewRoleInput, Role, RoleArgs, UpdateRoleInput } from './schema';

import { NotFoundError } from '@/utils/errors';
import { HandleErrors } from '@/decorators/handleErrors';

import RoleService from './service';
import { Prisma } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';

import { PrismaSelection, ProvideFields } from '@/utils/select';
import { Service } from 'typedi';

const ENTITY = Prisma.ModelName.Role;

@Service()
@HandleErrors()
@Resolver(Role)
export default class RoleResolver {
  constructor(private readonly service: RoleService) {}

  @Query((returns) => Role, { nullable: true })
  async role(@Info() info: GraphQLResolveInfo, @Arg('id') id: string) {
    const role = await this.service.findById(id);
    if (role) return role;

    throw new NotFoundError(ENTITY, id);
  }

  @Query((returns) => [Role])
  async roles(
    @ProvideFields<Role>() fields: PrismaSelection<Role>,
    @Args() { skip, take }: RoleArgs,
  ) {
    return this.service.findAll(fields, { skip, take });
  }

  @Mutation((returns) => Role)
  async addPermission(@Arg('addRoleData') addRoleData: NewRoleInput) {
    return this.service.add(addRoleData);
  }

  @Mutation((returns) => Role, { nullable: true })
  async updateRole(
    @Arg('id') id: string,
    @Arg('updateRoleData')
    updateRoleData: UpdateRoleInput,
  ) {
    const role = await this.service.findById(id);
    if (role) return this.service.update(id, updateRoleData);

    throw new NotFoundError(ENTITY, id);
  }

  @Mutation((returns) => Boolean)
  async removeRole(@Arg('id') id: string) {
    const role = await this.service.findById(id);
    if (role) {
      await this.service.remove(id);
      return true;
    }

    throw new NotFoundError(ENTITY, id);
  }
}
