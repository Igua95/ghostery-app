import { z } from 'zod';
import { t } from './router';

export const authRouter = t.router({
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
