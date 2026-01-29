import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
  };
  onSignOut?: () => void;
}

export const Header = ({ user, onSignOut }: HeaderProps) => {
  const { theme, setTheme, isDarkMode } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <span className="text-xl">📋</span>
            <span>TodoApp</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-sm font-medium">
                {user.name || user.email}
              </span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </Button>

          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onSignOut}
            >
              Sign Out
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};