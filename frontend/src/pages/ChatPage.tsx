import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { ChatWindow } from '../components/chat/ChatWindow';
import { NewChatModal } from '../components/chat/NewChatModal';
import { useWebSocket } from '../hooks/useWebSocket';

interface ChatPageProps {
  user: string;
  onLogout: () => void;
}

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

export default function ChatPage({ user, onLogout }: ChatPageProps) {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [threadMessages, setThreadMessages] = useState<Record<string, Message[]>>({});
  
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      timestamp: '2 min ago'
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'See you tomorrow!',
      timestamp: '1 hour ago'
    },
    {
      id: '3',
      name: 'Bob Wilson',
      lastMessage: 'Thanks for the help',
      timestamp: '3 hours ago'
    }
  ]);

  const handleWebSocketMessage = useCallback((message: any) => {
    const senderId = message.from;
    const threadId = threads.find(t => t.name === senderId)?.id;
    
    if (threadId) {
      setThreadMessages(prev => ({
        ...prev,
        [threadId]: [...(prev[threadId] || []), {
          id: Date.now().toString(),
          from: message.from,
          content: message.content,
          timestamp: new Date().toISOString()
        }]
      }));
      
      setThreads(prev => prev.map(thread => 
        thread.id === threadId 
          ? { ...thread, lastMessage: message.content, timestamp: 'now' }
          : thread
      ));
    }
  }, [threads]);

  const { sendMessage, isConnected } = useWebSocket({
    username: user,
    onMessage: handleWebSocketMessage
  });

  useEffect(() => {
    if (threads.length > 0 && !selectedThread) {
      setSelectedThread(threads[0]);
    }
  }, [threads]);

  const handleSendMessage = (content: string) => {
    if (selectedThread) {
      sendMessage({
        type: 'send_message',
        sender: user,
        receiver: selectedThread.name,
        content
      });
      
      const newMessage: Message = {
        id: Date.now().toString(),
        from: user,
        content,
        timestamp: new Date().toISOString()
      };

      setThreadMessages(prev => ({
        ...prev,
        [selectedThread.id]: [...(prev[selectedThread.id] || []), newMessage]
      }));

      setThreads(prev => prev.map(thread => 
        thread.id === selectedThread.id 
          ? { ...thread, lastMessage: content, timestamp: 'now' }
          : thread
      ));
    }
  };

  const handleSelectThread = (thread: Thread) => {
    setSelectedThread(thread);
  };

  const handleNewChat = (username: string) => {
    const existingThread = threads.find(t => t.name.toLowerCase() === username.toLowerCase());
    
    if (existingThread) {
      setSelectedThread(existingThread);
    } else {
      const newThread: Thread = {
        id: Date.now().toString(),
        name: username,
        lastMessage: '',
        timestamp: 'now'
      };
      
      setThreads(prev => [newThread, ...prev]);
      setSelectedThread(newThread);
    }
    
    setShowNewChatModal(false);
  };

  const currentMessages = selectedThread ? threadMessages[selectedThread.id] || [] : [];

  return (
    <div className="h-screen bg-deep flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          threads={threads}
          selectedThread={selectedThread}
          onSelectThread={handleSelectThread}
          onNewChat={() => setShowNewChatModal(true)}
        />
        
        <div className="flex-1">
          {selectedThread ? (
            <ChatWindow
              thread={selectedThread}
              messages={currentMessages}
              currentUser={user}
              onSendMessage={handleSendMessage}
              isConnected={isConnected}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-secondary">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>

      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onStartChat={handleNewChat}
        />
      )}
    </div>
  );
}
