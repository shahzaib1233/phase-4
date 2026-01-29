import React from 'react';
import { useTheme } from '@/context/theme';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const { theme, toggleTheme, isDarkMode } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        <span className="text-lg" role="img" aria-label="Sun icon">☀️</span>
      ) : (
        <span className="text-lg" role="img" aria-label="Moon icon">🌙</span>
      )}
    </Button>
  );
};