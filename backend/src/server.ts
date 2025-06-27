import express from 'express';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './trpc/router.js';
import router from './routes/index.js';
import cors from 'cors';

const createContext = ({ req, res }: { req: express.Request; res: express.Response }) => ({});
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// REST API routes
app.use('/api', router);

// tRPC API routes
app.use('/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});