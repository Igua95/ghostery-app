import { z } from 'zod';
import { t } from './router';
import { UserService } from '../services/userService.js';

const userService = new UserService();

export const authRouter = t.router({
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
      return { success: true, username: user.username, id: user.id };
    }),
});
