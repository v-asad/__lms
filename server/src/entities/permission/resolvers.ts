import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import {
  Permission,
  PermissionArgs,
  NewPermissionInput,
  UpdatePermissionInput,
} from './schema';

import { NotFoundError } from '@/utils/errors';
import { HandleErrors } from '@/decorators/handleErrors';

import PermissionService from './service';
import { Prisma } from '@prisma/client';
import { Service } from 'typedi';

const ENTITY = Prisma.ModelName.Permission;

@Service()
@HandleErrors()
@Resolver(Permission)
export default class PermissionResolver {
  constructor(private readonly service: PermissionService) {}

  @Query((returns) => Permission, { nullable: true })
  async permission(@Arg('id') id: string) {
    const permission = await this.service.findById(id);
    if (permission) return permission;

    throw new NotFoundError(ENTITY, id);
  }

  @Query((returns) => [Permission])
  async permissions(@Args() { skip, take }: PermissionArgs) {
    return this.service.findAll({ skip, take });
  }

  @Mutation((returns) => Permission)
  async addPermission(
    @Arg('addPermissionData') addPermissionData: NewPermissionInput,
  ) {
    return this.service.add(addPermissionData);
  }

  @Mutation((returns) => Permission, { nullable: true })
  async updatePermission(
    @Arg('id') id: string,
    @Arg('updatePermissionData')
    updatePermissionData: UpdatePermissionInput,
  ) {
    const permission = await this.service.findById(id);
    if (permission) return this.service.update(id, updatePermissionData);

    throw new NotFoundError(ENTITY, id);
  }

  @Mutation((returns) => Boolean)
  async removePermission(@Arg('id') id: string) {
    const permission = await this.service.findById(id);
    if (permission) {
      await this.service.remove(id);
      return true;
    }

    throw new NotFoundError(ENTITY, id);
  }
}
