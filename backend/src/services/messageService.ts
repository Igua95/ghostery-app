import { MessagesRepository } from '../repositories/messagesRepository.js';

export class MessageService {
  private messagesRepository: MessagesRepository;

  constructor() {
    this.messagesRepository = new MessagesRepository();
  }

  async getMessagesByThreadId(threadId: number) {
    return this.messagesRepository.findByThreadId(threadId);
  }

  async createMessage(threadId: number, senderId: number, content: string) {
    if (!content.trim()) {
        // TODO prevent this on frontend
      throw new Error('Message content cannot be empty');
    }
    return this.messagesRepository.create(threadId, senderId, content);
  }

  async getMessageById(id: number) {
    const message = await this.messagesRepository.findById(id);
    if (!message) {
      throw new Error('Message not found');
    }
    return message;
  }

  async deleteMessage(id: number, userId: number) {
    const message = await this.messagesRepository.findById(id);
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== userId) {
      throw new Error('You can only delete your own messages');
    }

    return this.messagesRepository.delete(id);
  }

  async getUserThreads(userId: number) {
    return this.messagesRepository.findUserThreads(userId);
  }

  async createThread(name: string | null, isGroup: boolean, createdBy: number, memberIds: number[]) {
    if (!memberIds.includes(createdBy)) {
      memberIds.push(createdBy);
    }

    if (!isGroup && memberIds.length !== 2) {
      throw new Error('Direct messages must have exactly 2 members');
    }

    if (isGroup && memberIds.length < 2) {
      throw new Error('Group threads must have at least 2 members');
    }

    return this.messagesRepository.createThread(name, isGroup, createdBy, memberIds);
  }
}
