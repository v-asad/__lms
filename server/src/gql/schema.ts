import { buildSchema } from 'type-graphql';
import CourseResolver from '@/entities/course/resolvers';
import PermissionResolver from '@/entities/permission/resolvers';
import RoleResolver from '@/entities/role/resolvers';

const generateSchema = () =>
  buildSchema({
    resolvers: [PermissionResolver, RoleResolver, CourseResolver],
  });

export default generateSchema;
