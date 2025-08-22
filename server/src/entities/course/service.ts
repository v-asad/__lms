import { Course, CourseArgs, NewCourseInput } from './schema';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class CourseService {
  async findAll({ skip, take }: CourseArgs): Promise<Course[]> {
    return await prisma.course.findMany({ skip, take });
  }
  async findById(id: string): Promise<Course | null> {
    return await prisma.course.findFirst({ where: { id } });
  }
  async add(data: NewCourseInput): Promise<Course> {
    return await prisma.course.create({
      data,
    });
  }
  async update(id: string, data: Partial<NewCourseInput>): Promise<Course> {
    return await prisma.course.update({
      data,
      where: { id },
    });
  }
  async remove(id: string): Promise<void> {
    await prisma.course.delete({ where: { id } });
  }
}
