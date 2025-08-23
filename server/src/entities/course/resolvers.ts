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

@HandleErrors()
@Resolver(Course)
export default class CourseResolver {
  private courseService: CourseService;

  constructor() {
    this.courseService = new CourseService();
  }

  @Query((returns) => Course, { nullable: true })
  async course(@Arg('id') id: string) {
    const course = await this.courseService.findById(id);
    if (course) return course;

    throw new NotFoundError('Course', id);
  }

  @Query((returns) => [Course])
  async courses(@Args() { skip, take }: CourseArgs) {
    return this.courseService.findAll({ skip, take });
  }

  @Mutation((returns) => Course)
  async addCourse(@Arg('addCourseData') addCourseData: NewCourseInput) {
    return this.courseService.add(addCourseData);
  }

  @Mutation((returns) => Course, { nullable: true })
  async updateCourse(
    @Arg('id') id: string,
    @Arg('updateCourseData')
    updateCourseData: UpdateCourseInput,
  ) {
    const course = await this.courseService.findById(id);
    if (course) return this.courseService.update(id, updateCourseData);

    throw new NotFoundError('Course', id);
  }

  @Mutation((returns) => Boolean)
  async removeCourse(@Arg('id') id: string) {
    const course = await this.courseService.findById(id);
    if (course) {
      await this.courseService.remove(id);
      return true;
    }

    throw new NotFoundError('Course', id);
  }
}
