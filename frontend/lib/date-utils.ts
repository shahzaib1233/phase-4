// Date formatting utilities for the Todo application

/**
 * Format a date to a readable string
 * @param date The date to format
 * @returns Formatted date string (e.g., "Jan 3, 2026")
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format a date with time
 * @param date The date to format
 * @returns Formatted date and time string (e.g., "Jan 3, 2026, 10:30 AM")
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format a date as relative time (e.g., "2 days ago")
 * @param date The date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  // Future dates
  if (diffInSeconds < 0) {
    const absDiff = Math.abs(diffInSeconds);
    if (absDiff < 60) return 'in a few seconds';
    if (absDiff < 120) return 'in a minute';
    if (absDiff < 3600) return `in ${Math.floor(absDiff / 60)} minutes`;
    if (absDiff < 7200) return 'in an hour';
    if (absDiff < 86400) return `in ${Math.floor(absDiff / 3600)} hours`;
    if (absDiff < 172800) return 'tomorrow';
    return `on ${formatDate(date)}`;
  }

  // Past dates
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 120) return 'a minute ago';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 7200) return 'an hour ago';
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return 'yesterday';
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 5184000) return 'last month';
  return formatDate(date);
}

/**
 * Format a date for input fields (YYYY-MM-DD)
 * @param date The date to format
 * @returns Formatted date string for input fields
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date is overdue
 * @param date The due date to check
 * @returns True if the date is in the past, false otherwise
 */
export function isOverdue(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return dateObj < now;
}

/**
 * Check if a date is today
 * @param date The date to check
 * @returns True if the date is today, false otherwise
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is tomorrow
 * @param date The date to check
 * @returns True if the date is tomorrow, false otherwise
 */
export function isTomorrow(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    dateObj.getDate() === tomorrow.getDate() &&
    dateObj.getMonth() === tomorrow.getMonth() &&
    dateObj.getFullYear() === tomorrow.getFullYear()
  );
}

/**
 * Get the number of days between two dates
 * @param startDate The start date
 * @param endDate The end date
 * @returns Number of days between the dates
 */
export function getDaysBetween(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}