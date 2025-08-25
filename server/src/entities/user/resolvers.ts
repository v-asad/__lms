import { hashPassword, comparePassword, createToken } from '@/utils/auth';
import {
  LoginArgs,
  LoginResponse,
  NewUserInput,
  UpdateUserInput,
  User,
  UserArgs,
} from './schema';
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { HandleErrors } from '@/decorators/handleErrors';
import { PrismaSelection, ProvideFields } from '@/utils/select';
import { DuplicateError, NotFoundError } from '@/utils/errors';
import { Prisma, PrismaClient } from '@prisma/client';

const ENTITY = Prisma.ModelName.User;

const prisma = new PrismaClient();

@HandleErrors()
@Resolver(User)
export default class UserResolver {
  @Query(() => User, { nullable: true })
  async user(
    @Arg('id') id: string,
    @ProvideFields<User>() select: PrismaSelection<User>,
  ) {
    const user = await prisma.user.findFirst({ where: { id }, select });
    if (user) return user;

    throw new NotFoundError(ENTITY, 'id', id);
  }

  @Query(() => [User])
  async users(
    @Args() { skip, take }: UserArgs,
    @ProvideFields<User>() select: PrismaSelection<User>,
  ) {
    return prisma.user.findMany({ skip, take, select });
  }

  @Mutation(() => User)
  async signup(
    @Arg('addUserData') addUserData: NewUserInput,
    @ProvideFields<User>() select: PrismaSelection<User>,
  ) {
    const existing = await prisma.user.findFirst({
      where: { email: addUserData.email },
    });
    if (existing) throw new DuplicateError(ENTITY, 'email', addUserData.email);

    const hashedPassword = await hashPassword(addUserData.password);

    const user = await prisma.user.create({
      data: {
        ...addUserData,
        password: hashedPassword,
      },
      select,
    });

    return user;
  }

  @Mutation(() => LoginResponse)
  async login(@Arg('loginData') loginData: LoginArgs) {
    const user = await prisma.user.findFirst({
      where: { email: loginData.email },
    });
    if (!user) throw new NotFoundError(ENTITY, 'email', loginData.email);

    const valid = await comparePassword(loginData.password, user.password);
    if (!valid) throw new Error('Invalid password');

    const token = createToken(user.id);
    return { token };
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg('id') id: string,
    @Arg('updateUserData')
    updateUserData: UpdateUserInput,
    @ProvideFields<User>() select: PrismaSelection<User>,
  ) {
    const user = await prisma.user.findFirst({ where: { id } });
    if (user)
      return prisma.user.update({
        where: { id },
        data: updateUserData,
        select,
      });

    throw new NotFoundError(ENTITY, 'id', id);
  }

  @Mutation(() => Boolean)
  async removeUser(@Arg('id') id: string) {
    const user = await prisma.user.findFirst({ where: { id } });
    if (user) {
      await prisma.user.delete({ where: { id } });
      return true;
    }

    throw new NotFoundError(ENTITY, 'id', id);
  }
}
