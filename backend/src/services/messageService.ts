import { MessagesRepository } from '../repositories/messagesRepository.js';
import { UserService } from './userService.js';
import prisma from '../lib/prisma.js';

export class MessageService {
  private messagesRepository: MessagesRepository;
  private userService: UserService;

  constructor() {
    this.messagesRepository = new MessagesRepository();
    this.userService = new UserService();
  }

  async createMessageFromWebSocket(senderUsername: string, receiverUsername: string, content: string) {
    const sender = await this.userService.getUserByUsername(senderUsername);
    const receiver = await this.userService.getUserByUsername(receiverUsername);

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    const thread = await this.findOrCreateThread(sender.id, receiver.id);

    const message = await this.messagesRepository.create(thread.id, sender.id, content);
    
    return {
      ...message,
      thread
    };
  }

  async getUserThreadsWithLastMessage(userId: number) {
    const threads = await prisma.thread.findMany({
      where: {
        members: {
          some: {
            userId: userId
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
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform threads to include other participant info and last message
    return threads.map(thread => {
      const otherMember = thread.members.find(member => member.userId !== userId);
      const lastMessage = thread.messages[0];
      
      return {
        id: thread.id.toString(),
        name: otherMember?.user.username || 'Unknown User',
        lastMessage: lastMessage?.content || '',
        timestamp: lastMessage?.createdAt ? this.formatTimestamp(lastMessage.createdAt) : 'No messages'
      };
    });
  }

  async getThreadMessages(threadId: number, userId: number) {
    // Verify user is a member of this thread
    const threadMember = await prisma.threadMember.findUnique({
      where: {
        threadId_userId: {
          threadId,
          userId
        }
      }
    });

    if (!threadMember) {
      throw new Error('User is not a member of this thread');
    }

    const messages = await this.messagesRepository.findByThreadId(threadId);
    
    return messages.map(message => ({
      id: message.id.toString(),
      from: message.sender.username,
      content: message.content,
      timestamp: message.createdAt.toISOString()
    }));
  }

  private async findOrCreateThread(userId1: number, userId2: number) {
    // Find existing thread between these two users
    const existingThread = await prisma.thread.findFirst({
      where: {
        AND: [
          {
            members: {
              some: {
                userId: userId1
              }
            }
          },
          {
            members: {
              some: {
                userId: userId2
              }
            }
          },
          {
            isGroup: false
          }
        ]
      },
      include: {
        members: true
      }
    });

    if (existingThread && existingThread.members.length === 2) {
      return existingThread;
    }

    // Create new thread
    const newThread = await prisma.thread.create({
      data: {
        isGroup: false,
        createdBy: userId1,
        members: {
          create: [
            { userId: userId1 },
            { userId: userId2 }
          ]
        }
      },
      include: {
        members: true
      }
    });

    return newThread;
  }

  private formatTimestamp(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }
}
