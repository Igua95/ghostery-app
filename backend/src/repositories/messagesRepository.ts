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

  async findById(id: number) {
    return prisma.message.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            username: true
          }
        },
        thread: true
      }
    });
  }

  async delete(id: number) {
    return prisma.message.delete({
      where: { id }
    });
  }

  async findUserThreads(userId: number) {
    return prisma.thread.findMany({
      where: {
        members: {
          some: {
            userId
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    });
  }

  async createThread(name: string | null, isGroup: boolean, createdBy: number, memberIds: number[]) {
    return prisma.thread.create({
      data: {
        name,
        isGroup,
        createdBy,
        members: {
          create: memberIds.map(userId => ({ userId }))
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    });
  }
}
