import { Button } from '../ui/Button';

interface Thread {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
}

interface SidebarProps {
  threads: Thread[];
  selectedThread: Thread | null;
  onSelectThread: (thread: Thread) => void;
  onNewChat: () => void;
}

export function Sidebar({ threads, selectedThread, onSelectThread, onNewChat }: SidebarProps) {
  return (
    <div className="w-80 bg-surface border-r border-subtle flex flex-col">
      <div className="p-4 border-b border-subtle">
        <Button onClick={onNewChat} className="w-full">
          New Conversation
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className={`p-4 border-b border-subtle cursor-pointer hover:bg-hover transition-colors ${
              selectedThread?.id === thread.id ? 'bg-hover' : ''
            }`}
            onClick={() => onSelectThread(thread)}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-primary truncate">{thread.name}</h3>
              <span className="text-xs text-secondary">{thread.timestamp}</span>
            </div>
            {thread.lastMessage && (
              <p className="text-sm text-secondary truncate">{thread.lastMessage}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
