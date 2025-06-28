import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  const [user, setUser] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-deep text-primary">
      {!user ? (
        <LoginPage onLogin={setUser} />
      ) : (
        <ChatPage user={user} onLogout={() => setUser(null)} />
      )}
    </div>
  );
}