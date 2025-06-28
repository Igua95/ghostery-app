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
    .mutation(({ input }) => {
      if (input.password === 'password') {
        return { success: true, username: input.username };
      }
      throw new Error('Invalid credentials');
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