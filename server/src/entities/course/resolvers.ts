import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Course, CourseArgs, NewCourseInput } from './schema';

import CourseService from './service';

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

    throw new Error(`Course with ID: ${id} not found`);
  }

  @Query((returns) => [Course])
  async courses(@Args() { skip, take }: CourseArgs) {
    return this.courseService.findAll({ skip, take });
  }

  @Mutation((returns) => Course)
  async addCourse(@Arg('addCourseData') addCourseData: NewCourseInput) {
    return this.courseService.add(addCourseData);
  }

  @Mutation((returns) => Boolean)
  async removeCourse(@Arg('id') id: string) {
    try {
      await this.courseService.remove(id);
      return true;
    } catch {
      return false;
    }
  }
}
