import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface NewChatModalProps {
  onClose: () => void;
  onStartChat: (username: string) => void;
}

export function NewChatModal({ onClose, onStartChat }: NewChatModalProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onStartChat(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-deep/80 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold">New Conversation</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Username
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                autoFocus
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={!username.trim()} className="flex-1">
                Start Chat
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
