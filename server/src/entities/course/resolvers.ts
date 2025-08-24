import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import {
  Course,
  CourseArgs,
  NewCourseInput,
  UpdateCourseInput,
} from './schema';

import CourseService from './service';
import { NotFoundError } from '@/utils/errors';
import { HandleErrors } from '@/decorators/handleErrors';
import { Prisma } from '@prisma/client';
import { Service } from 'typedi';

const ENTITY = Prisma.ModelName.Course;

@Service()
@HandleErrors()
@Resolver(Course)
export default class CourseResolver {
  constructor(private readonly service: CourseService) {}

  @Query((returns) => Course, { nullable: true })
  async course(@Arg('id') id: string) {
    const course = await this.service.findById(id);
    if (course) return course;

    throw new NotFoundError(ENTITY, id);
  }

  @Query((returns) => [Course])
  async courses(@Args() { skip, take }: CourseArgs) {
    return this.service.findAll({ skip, take });
  }

  @Mutation((returns) => Course)
  async addCourse(@Arg('addCourseData') addCourseData: NewCourseInput) {
    return this.service.add(addCourseData);
  }

  @Mutation((returns) => Course, { nullable: true })
  async updateCourse(
    @Arg('id') id: string,
    @Arg('updateCourseData')
    updateCourseData: UpdateCourseInput,
  ) {
    const course = await this.service.findById(id);
    if (course) return this.service.update(id, updateCourseData);

    throw new NotFoundError(ENTITY, id);
  }

  @Mutation((returns) => Boolean)
  async removeCourse(@Arg('id') id: string) {
    const course = await this.service.findById(id);
    if (course) {
      await this.service.remove(id);
      return true;
    }

    throw new NotFoundError(ENTITY, id);
  }
}
