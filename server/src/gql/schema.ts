import { buildSchema } from 'type-graphql';
import CourseResolver from '@/entities/course/resolvers';
import PermissionResolver from '@/entities/permission/resolvers';

const generateSchema = () =>
  buildSchema({
    resolvers: [PermissionResolver, CourseResolver],
  });

export default generateSchema;
