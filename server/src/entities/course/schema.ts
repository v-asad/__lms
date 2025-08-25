import { Max, Min } from 'class-validator';
import { ArgsType, Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { User } from '../user/schema';

@ObjectType()
export class Course {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  createdBy: string;

  @Field(() => User)
  user: User;
}

@InputType()
export class NewCourseInput {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
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
  @Field(() => Int)
  @Min(0)
  skip: number = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take: number = 25;
}
