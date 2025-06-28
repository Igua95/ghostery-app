import express from 'express';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './trpc/router.js';
import router from './routes/index.js';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const createContext = ({ req, res }: { req: express.Request; res: express.Response }) => ({});
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use('/api', router);

app.use('/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}));

const wss = new WebSocketServer({ server });
const clients = new Map<string, any>();

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === 'auth') {
        clients.set(message.username, ws);
        console.log(`User ${message.username} connected`);
      }

      if (message.type === 'send_message') {
        const { sender, receiver, content } = message;
        console.log(`Message from ${sender} to ${receiver}: ${content}`);
        
        const receiverSocket = clients.get(receiver);
        if (receiverSocket && receiverSocket.readyState === 1) {
          receiverSocket.send(JSON.stringify({
            type: 'new_message',
            from: sender,
            content,
          }));
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    for (const [username, socket] of clients.entries()) {
      if (socket === ws) {
        clients.delete(username);
        console.log(`User ${username} disconnected`);
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});