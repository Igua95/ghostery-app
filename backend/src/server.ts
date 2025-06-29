import express from 'express';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './trpc/router.js';
import router from './routes/index.js';
import cors from 'cors';
import { createServer } from 'http';
import { setupWebSocket } from './ws/websocket.js';

const createContext = ({ req, res }: { req: express.Request; res: express.Response }) => ({});
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 4000;

app.use(cors());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Ghostery App Backend is running' });
});

app.use('/api', router);

app.use('/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}));

setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});