import prisma from '../lib/prisma.js';

export class UsersRepository {
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    });
  }

  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username }
    });
  }

  async create(username: string, password: string) {
    return prisma.user.create({
      data: {
        username,
        password
      },
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    });
  }

  async update(id: number, data: { username?: string; password?: string }) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    });
  }

  async delete(id: number) {
    return prisma.user.delete({
      where: { id }
    });
  }
}
