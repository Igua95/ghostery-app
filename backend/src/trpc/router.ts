import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

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
      // Logic to create an example
      return { success: true, name: input.name };
    }),
});

export type AppRouter = typeof appRouter;