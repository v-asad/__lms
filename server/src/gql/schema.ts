import { buildSchema } from 'type-graphql';
import CourseResolver from '@/entities/course/resolvers';

const generateSchema = () =>
  buildSchema({
    resolvers: [CourseResolver],
  });

export default generateSchema;
