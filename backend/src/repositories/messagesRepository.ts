import prisma from '../lib/prisma.js';

export class MessagesRepository {
  async findByThreadId(threadId: number) {
    return prisma.message.findMany({
      where: { threadId },
      include: {
        sender: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  async create(threadId: number, senderId: number, content: string) {
    return prisma.message.create({
      data: {
        threadId,
        senderId,
        content
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
  }
}
