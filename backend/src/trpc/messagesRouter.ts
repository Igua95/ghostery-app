import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { UserService } from '../services/userService.js';
import { MessageService } from '../services/messageService.js';

export const t = initTRPC.create();
const userService = new UserService();
const messageService = new MessageService();

export const messagesRouter = t.router({
  getUserThreads: t.procedure
    .input(z.object({
      userId: z.number(),
    }))
    .query(async ({ input }) => {
      return messageService.getUserThreadsWithLastMessage(input.userId);
    }),
  getThreadMessages: t.procedure
    .input(z.object({
      threadId: z.number(),
      userId: z.number(),
    }))
    .query(async ({ input }) => {
      return messageService.getThreadMessages(input.threadId, input.userId);
    }),
  checkUserExists: t.procedure
    .input(z.object({
      username: z.string(),
      currentUserId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      const user = await userService.getUserByUsername(input.username);
      const exists = !!user;
      const isSelf = input.currentUserId && user && user.id === input.currentUserId;
      
      return { 
        exists, 
        isSelf,
        user: user ? { id: user.id, username: user.username } : null 
      };
    }),
});
