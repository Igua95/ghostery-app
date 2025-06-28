import { Button } from '../ui/Button';

interface NavbarProps {
  user: string;
  onLogout: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="h-16 bg-surface border-b border-subtle flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-display font-bold text-accent">Ghostery Chat</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-secondary">Welcome, {user}</span>
        <Button variant="ghost" size="sm" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
