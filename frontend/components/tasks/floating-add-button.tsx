import React from 'react';
import { Button } from '@/components/ui/button';

interface FloatingAddButtonProps {
  onClick: () => void;
  className?: string;
}

export const FloatingAddButton = ({ onClick, className }: FloatingAddButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-transform hover:scale-105 ${className}`}
      aria-label="Add new task"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </button>
  );
};