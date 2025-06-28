import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface Thread {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
}

interface Message {
  id: string;
  from: string;
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  thread: Thread;
  messages: Message[];
  currentUser: string;
  onSendMessage: (content: string) => void;
  isConnected: boolean;
}

export function ChatWindow({ thread, messages, currentUser, onSendMessage, isConnected }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px threshold
      setShouldAutoScroll(isNearBottom);
    }
  };

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll]);

  useEffect(() => {
    setShouldAutoScroll(true);
    scrollToBottom();
  }, [thread.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
      setShouldAutoScroll(true);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="h-16 bg-surface border-b border-subtle flex items-center px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="text-deep font-medium">
              {thread.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-medium text-primary">{thread.name}</h2>
            <p className="text-xs text-secondary">
              {isConnected ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
        onScroll={handleScroll}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.from === currentUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.from === currentUser
                  ? 'bg-accent text-deep'
                  : 'bg-surface text-primary border border-subtle'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
        
        {/* Scroll to bottom button */}
        {!shouldAutoScroll && (
          <div className="absolute bottom-20 right-6">
            <Button
              onClick={() => {
                setShouldAutoScroll(true);
                scrollToBottom();
              }}
              className="rounded-full w-10 h-10 p-0 shadow-lg"
              variant="secondary"
            >
              ↓
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-subtle">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected}
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim() || !isConnected}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
