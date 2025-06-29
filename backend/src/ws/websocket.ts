import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { MessageService } from '../services/messageService.js';

// TODO: we could replace this with a Redis cache in case we have multiples pods.
const clientsCache = new Map<string, any>();
const messageService = new MessageService();

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());


        // TODO: This WebSocket implementation has no authentication
        // It would be good to add a JWT token, retrieve the username from the token
        // and store in the cache.
        if (message.type === 'auth') {
          clientsCache.set(message.username, ws);
          console.log(`User ${message.username} connected`);
        }

        if (message.type === 'send_message') {
          const { sender, receiver, content } = message;
          try {
            await messageService.createMessageFromWebSocket(sender, receiver, content);
          } catch (error) {
            console.error('Error storing message:', error);
          }
          console.log(`Message from ${sender} to ${receiver}`);
          const receiverSocket = clientsCache.get(receiver);
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
      for (const [username, socket] of clientsCache.entries()) {
        if (socket === ws) {
          clientsCache.delete(username);
          console.log(`User ${username} disconnected`);
          break;
        }
      }
    });
  });

  return wss;
};
