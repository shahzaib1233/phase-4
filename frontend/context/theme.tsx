'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { meetsContrastRequirements } from '@/lib/contrast-utils';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  validateContrast: (color1: string, color2: string, isLargeText?: boolean) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system', ...props }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved theme in localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme) return savedTheme;
    }
    return defaultTheme;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme && savedTheme !== 'system') {
        return savedTheme === 'dark';
      }
      // Check system preference if theme is 'system' or not set
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // default to light mode on server
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove any existing theme classes
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      setIsDarkMode(systemTheme === 'dark');
    } else {
      root.classList.add(theme);
      setIsDarkMode(theme === 'dark');
    }

    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setIsDarkMode(mediaQuery.matches);
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const validateContrast = (color1: string, color2: string, isLargeText?: boolean) => {
    return meetsContrastRequirements(color1, color2, isLargeText);
  };

  const value = {
    theme,
    setTheme,
    isDarkMode,
    toggleTheme,
    validateContrast,
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}