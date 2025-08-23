import {
  Course,
  CourseArgs,
  NewCourseInput,
  UpdateCourseInput,
} from './schema';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class CourseService {
  async findAll({ skip, take }: CourseArgs) {
    return await prisma.course.findMany({ skip, take });
  }
  async findById(id: string) {
    return await prisma.course.findFirst({ where: { id } });
  }
  async add(data: NewCourseInput) {
    return await prisma.course.create({
      data,
    });
  }
  async update(id: string, data: UpdateCourseInput) {
    return await prisma.course.update({
      data,
      where: { id },
    });
  }
  async remove(id: string) {
    await prisma.course.delete({ where: { id } });
  }
}
