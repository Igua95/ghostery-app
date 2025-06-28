import prisma from '../lib/prisma.js';

export class UsersRepository {
  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username }
    });
  }
}
