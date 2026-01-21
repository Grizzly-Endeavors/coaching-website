import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generates a URL-friendly slug from a given string.
 * @param title The string to convert to a slug.
 * @returns The generated slug.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Formats a date for display in the UI.
 * Uses en-US locale with abbreviated month, numeric day, and full year.
 *
 * @param dateString - Date string or Date object to format
 * @returns Formatted date string (e.g., "Jan 5, 2026")
 *
 * @example
 * formatDisplayDate('2026-01-05T10:30:00Z') // Returns "Jan 5, 2026"
 * formatDisplayDate(new Date()) // Returns current date formatted
 */
export function formatDisplayDate(dateString: string | Date): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a date with time for display in the UI.
 * Uses en-US locale with abbreviated month, numeric day, year, and time.
 *
 * @param dateString - Date string or Date object to format
 * @returns Formatted date and time string (e.g., "Jan 5, 2026, 10:30 AM")
 *
 * @example
 * formatDisplayDateTime('2026-01-05T10:30:00Z') // Returns "Jan 5, 2026, 10:30 AM"
 */
export function formatDisplayDateTime(dateString: string | Date): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
