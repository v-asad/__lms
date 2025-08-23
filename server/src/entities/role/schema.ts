import { Max, Min } from 'class-validator';
import { ArgsType, Field, ID, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Role {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;
}

@InputType()
export class NewRoleInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;
}

@InputType()
export class UpdateRoleInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;
}

@ArgsType()
export class RoleArgs {
  @Field((type) => Int)
  @Min(0)
  skip: number = 0;

  @Field((type) => Int)
  @Min(1)
  @Max(50)
  take: number = 25;
}
