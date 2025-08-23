import { Max, Min } from 'class-validator';
import { ArgsType, Field, ID, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Course {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;
}

@InputType()
export class NewCourseInput {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;
}

@InputType()
export class UpdateCourseInput {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;
}

@ArgsType()
export class CourseArgs {
  @Field((type) => Int)
  @Min(0)
  skip: number = 0;

  @Field((type) => Int)
  @Min(1)
  @Max(50)
  take: number = 25;
}
