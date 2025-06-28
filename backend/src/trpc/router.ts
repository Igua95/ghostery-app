import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { UserService } from '../services/userService.js';

export const t = initTRPC.create();
const userService = new UserService();

const authRouter = t.router({
  login: t.procedure
    .input(z.object({
      username: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const user = await userService.validatePassword(input.username, input.password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      return { success: true, username: user.username, userId: user.id };
    }),
});

export const appRouter = t.router({
  auth: authRouter,
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