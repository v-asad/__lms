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

@HandleErrors()
@Resolver(Permission)
export default class PermissionResolver {
  private permissionService: PermissionService;

  constructor() {
    this.permissionService = new PermissionService();
  }

  @Query((returns) => Permission, { nullable: true })
  async permission(@Arg('id') id: string) {
    const permission = await this.permissionService.findById(id);
    if (permission) return permission;

    throw new NotFoundError('Permission', id);
  }

  @Query((returns) => [Permission])
  async permissions(@Args() { skip, take }: PermissionArgs) {
    return this.permissionService.findAll({ skip, take });
  }

  @Mutation((returns) => Permission)
  async addPermission(
    @Arg('addPermissionData') addPermissionData: NewPermissionInput,
  ) {
    return this.permissionService.add(addPermissionData);
  }

  @Mutation((returns) => Permission, { nullable: true })
  async updatePermission(
    @Arg('id') id: string,
    @Arg('updatePermissionData')
    updatePermissionData: UpdatePermissionInput,
  ) {
    const permission = await this.permissionService.findById(id);
    if (permission)
      return this.permissionService.update(id, updatePermissionData);

    throw new NotFoundError('Permission', id);
  }

  @Mutation((returns) => Boolean)
  async removePermission(@Arg('id') id: string): Promise<boolean> {
    const permission = await this.permissionService.findById(id);
    if (permission) {
      await this.permissionService.remove(id);
      return true;
    }

    throw new NotFoundError('Permission', id);
  }
}
