import { buildSchema } from 'type-graphql';
import CourseResolver from '@/entities/course/resolvers';
import PermissionResolver from '@/entities/permission/resolvers';
import RoleResolver from '@/entities/role/resolvers';
import UserResolver from '@/entities/user/resolvers';

const generateSchema = () =>
  buildSchema({
    resolvers: [PermissionResolver, RoleResolver, UserResolver, CourseResolver],
  });

export default generateSchema;
