import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { MessageService } from '../services/messageService.js';

const clients = new Map<string, any>();
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
          clients.set(message.username, ws);
          console.log(`User ${message.username} connected`);
        }

        if (message.type === 'send_message') {
          const { sender, receiver, content } = message;
          console.log(`Message from ${sender} to ${receiver}: ${content}`);
          
          try {
            // Store message in database
            await messageService.createMessageFromWebSocket(sender, receiver, content);
            
            // Send to receiver if online
            const receiverSocket = clients.get(receiver);
            if (receiverSocket && receiverSocket.readyState === 1) {
              receiverSocket.send(JSON.stringify({
                type: 'new_message',
                from: sender,
                content,
              }));
            }
          } catch (error) {
            console.error('Error storing message:', error);
            // Still send to receiver even if DB storage fails
            const receiverSocket = clients.get(receiver);
            if (receiverSocket && receiverSocket.readyState === 1) {
              receiverSocket.send(JSON.stringify({
                type: 'new_message',
                from: sender,
                content,
              }));
            }
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

  return wss;
};
