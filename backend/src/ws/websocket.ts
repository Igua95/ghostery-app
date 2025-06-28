import { WebSocketServer } from 'ws';
import { Server } from 'http';

const clients = new Map<string, any>();

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
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

  return wss;
};
