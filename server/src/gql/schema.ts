import { buildSchema } from 'type-graphql';
import CourseResolver from '@/entities/course/resolvers';
import PermissionResolver from '@/entities/permission/resolvers';
import RoleResolver from '@/entities/role/resolvers';

// IOC container
import { Container } from 'typedi';

const generateSchema = () =>
  buildSchema({
    resolvers: [PermissionResolver, RoleResolver, CourseResolver],
    // Registry 3rd party IOC container
    container: Container,
  });

export default generateSchema;
