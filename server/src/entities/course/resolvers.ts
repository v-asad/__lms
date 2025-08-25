import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import {
  Course,
  CourseArgs,
  NewCourseInput,
  UpdateCourseInput,
} from './schema';

import { DuplicateError, NotFoundError } from '@/utils/errors';
import { HandleErrors } from '@/decorators/handleErrors';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaSelection, ProvideFields } from '@/utils/select';

const ENTITY = Prisma.ModelName.Course;

const prisma = new PrismaClient();

@HandleErrors()
@Resolver(Course)
export default class CourseResolver {
  @Query(() => Course, { nullable: true })
  async course(
    @Arg('id') id: string,
    @ProvideFields<Course>() select: PrismaSelection<Course>,
  ) {
    const course = await prisma.course.findFirst({
      where: { id },
      select,
    });
    if (course) return course;

    throw new NotFoundError(ENTITY, 'id', id);
  }

  @Query(() => [Course])
  async courses(
    @Args() { skip, take }: CourseArgs,
    @ProvideFields<Course>() select: PrismaSelection<Course>,
  ) {
    return prisma.course.findMany({ skip, take, select });
  }

  @Mutation(() => Course)
  async addCourse(
    @Arg('addCourseData') addCourseData: NewCourseInput,
    @ProvideFields<Course>() select: PrismaSelection<Course>,
  ) {
    const existing = await prisma.course.findFirst({
      where: { title: addCourseData.title },
    });
    if (existing)
      throw new DuplicateError(ENTITY, 'title', addCourseData.title);

    return prisma.course.create({ data: addCourseData, select });
  }

  @Mutation(() => Course, { nullable: true })
  async updateCourse(
    @Arg('id') id: string,
    @Arg('updateCourseData')
    updateCourseData: UpdateCourseInput,
    @ProvideFields<Course>() select: PrismaSelection<Course>,
  ) {
    const course = await prisma.course.findFirst({
      where: { id },
    });
    if (course)
      return prisma.course.update({
        where: { id },
        data: updateCourseData,
        select,
      });

    throw new NotFoundError(ENTITY, 'id', id);
  }

  @Mutation(() => Boolean)
  async removeCourse(@Arg('id') id: string) {
    const course = await prisma.course.findFirst({
      where: { id },
    });
    if (course) {
      await prisma.course.delete({ where: { id } });
      return true;
    }

    throw new NotFoundError(ENTITY, 'id', id);
  }
}
