import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to format dates
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

// Utility function to format date for display only (without time)
export function formatDateOnly(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

// Utility function to generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Utility function to debounce a function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility function to check if a task is overdue
export function isTaskOverdue(dueDate?: Date | string | null): boolean {
  if (!dueDate) return false;
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return due < new Date();
}

// Utility function to get days difference between two dates
export function daysFromToday(date: Date | string): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diffTime = dateObj.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Utility function to toggle array item
export function toggleArrayItem<T>(array: T[], item: T): T[] {
  if (array.includes(item)) {
    return array.filter((i) => i !== item);
  } else {
    return [...array, item];
  }
}

// Utility function to clamp a value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}