import { initTRPC } from '@trpc/server';
import { authRouter } from './authRouter.js';
import { messagesRouter } from './messagesRouter.js';

export const t = initTRPC.create();

export const appRouter = t.router({
  auth: authRouter,
  messages: messagesRouter,
});

export type AppRouter = typeof appRouter;