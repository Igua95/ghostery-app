import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { UserService } from '../services/userService.js';

const t = initTRPC.create();
const userService = new UserService();

export const appRouter = t.router({
  getExample: t.procedure
    .input(z.string())
    .query(({ input }) => {
      return `Hello, ${input}!`;
    }),
  createExample: t.procedure
    .input(z.object({
      name: z.string(),
    }))
    .mutation(({ input }) => {
      return { success: true, name: input.name };
    }),
  getUsers: t.procedure
    .query(async () => {
      return userService.getAllUsers();
    }),
});

export type AppRouter = typeof appRouter;