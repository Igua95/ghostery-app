import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useCheckUserExists } from '../../hooks/useMessages';

interface NewChatModalProps {
  onClose: () => void;
  onStartChat: (username: string) => void;
  currentUserId: number;
}

export function NewChatModal({ onClose, onStartChat, currentUserId }: NewChatModalProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [debouncedUsername, setDebouncedUsername] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const { data: userCheck, isLoading } = useCheckUserExists(
    debouncedUsername.length > 0 ? debouncedUsername : null,
    currentUserId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setError('Please enter a username');
      return;
    }

    if (userCheck?.isSelf) {
      setError('You cannot start a conversation with yourself');
      return;
    }

    if (!userCheck?.exists) {
      setError('User not found. Please check the username and try again.');
      return;
    }

    setError('');
    onStartChat(trimmedUsername);
  };

  const isUsernameValid = userCheck?.exists === true && !userCheck?.isSelf;
  const showError = debouncedUsername.length > 0 && !isLoading && (userCheck?.exists === false || userCheck?.isSelf);
  const errorMessage = userCheck?.isSelf ? 'Cannot message yourself' : 'User not found';

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
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter username..."
                autoFocus
              />
              {isLoading && debouncedUsername.length > 0 && (
                <p className="text-xs text-secondary mt-1">Checking username...</p>
              )}
              {isUsernameValid && debouncedUsername.length > 0 && (
                <p className="text-xs text-green-400 mt-1">✓ User found</p>
              )}
              {showError && (
                <p className="text-xs text-red-400 mt-1">{errorMessage}</p>
              )}
              {error && (
                <p className="text-xs text-red-400 mt-1">{error}</p>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!username.trim() || !isUsernameValid || isLoading} 
                className="flex-1"
              >
                Start Chat
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
