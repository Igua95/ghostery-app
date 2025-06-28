import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { ChatWindow } from '../components/chat/ChatWindow';
import { NewChatModal } from '../components/chat/NewChatModal';
import { useWebSocket } from '../hooks/useWebSocket';
import { useGetUserThreads, useGetThreadMessages } from '../hooks/useMessages';

interface User {
  username: string;
  userId: number;
}

interface ChatPageProps {
  user: User;
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
  
  const { data: threads = [], refetch: refetchThreads } = useGetUserThreads(user.userId);
  
  const { data: messages = [], refetch: refetchMessages } = useGetThreadMessages(
    selectedThread ? parseInt(selectedThread.id) : null,
    user.userId
  );

  const handleWebSocketMessage = useCallback((message: any) => {
    refetchThreads();
    
    if (selectedThread) {
      const senderId = message.from;
      if (selectedThread.name === senderId) {
        refetchMessages();
      }
    }
  }, [selectedThread, refetchThreads, refetchMessages]);

  const { sendMessage, isConnected } = useWebSocket({
    username: user.username,
    onMessage: handleWebSocketMessage
  });

  useEffect(() => {
    if (threads.length > 0 && !selectedThread) {
      setSelectedThread(threads[0]);
    }
  }, [threads, selectedThread]);

  const handleSendMessage = (content: string) => {
    if (selectedThread) {
      sendMessage({
        type: 'send_message',
        sender: user.username,
        receiver: selectedThread.name,
        content
      });
      
      setTimeout(() => {
        refetchMessages();
        refetchThreads();
      }, 100);
    }
  };

  const handleSelectThread = (thread: Thread) => {
    setSelectedThread(thread);
  };

  const handleNewChat = (username: string) => {
    if (username.toLowerCase() === user.username.toLowerCase()) {
      return;
    }
    
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
      
      setSelectedThread(newThread);
    }
    
    setShowNewChatModal(false);
  };

  return (
    <div className="h-screen bg-deep flex flex-col">
      <Navbar user={user.username} onLogout={onLogout} />
      
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
              messages={messages}
              currentUser={user.username}
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
          currentUserId={user.userId}
        />
      )}
    </div>
  );
}
