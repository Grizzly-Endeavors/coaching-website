/**
 * Helper utilities for locale system
 * String interpolation, date formatting, pluralization, etc.
 */

import { format as dateFnsFormat } from 'date-fns';
import type { InterpolationVars, PluralOptions, DateFormat } from './types';

// =============================================================================
// String Interpolation
// =============================================================================

/**
 * Replace placeholders in a string with actual values
 * Supports {placeholder} syntax
 *
 * @example
 * interpolate("Hello {name}!", { name: "John" }) // "Hello John!"
 * interpolate("You have {count} messages", { count: 5 }) // "You have 5 messages"
 */
export function interpolate(
  text: string,
  vars: InterpolationVars = {}
): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    const value = vars[key];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Check if a string contains placeholders
 * @param text - String to check
 * @returns true if string contains {placeholder} patterns
 */
export function hasPlaceholders(text: string): boolean {
  return /\{(\w+)\}/.test(text);
}

/**
 * Extract all placeholder keys from a string
 * @param text - String to extract from
 * @returns Array of placeholder keys
 *
 * @example
 * extractPlaceholders("Hello {name}, you have {count} messages")
 * // Returns: ["name", "count"]
 */
export function extractPlaceholders(text: string): string[] {
  const matches = text.matchAll(/\{(\w+)\}/g);
  return Array.from(matches, (match) => match[1]);
}

// =============================================================================
// Pluralization
// =============================================================================

/**
 * Get the correct plural form based on count
 *
 * @param count - Number to check
 * @param options - Object with plural forms
 * @returns The correct plural form
 *
 * @example
 * pluralize(0, { zero: "No items", one: "1 item", other: "{count} items" })
 * pluralize(1, { one: "1 item", other: "{count} items" })
 * pluralize(5, { one: "1 item", other: "{count} items" })
 */
export function pluralize(count: number, options: PluralOptions): string {
  let result: string;

  if (count === 0 && options.zero) {
    result = options.zero;
  } else if (count === 1) {
    result = options.one;
  } else {
    result = options.other;
  }

  // Replace {count} placeholder in the result
  return interpolate(result, { count });
}

/**
 * Simple pluralization helper for English
 * Automatically adds 's' for count !== 1
 *
 * @example
 * simplePlural(1, "item") // "1 item"
 * simplePlural(5, "item") // "5 items"
 * simplePlural(0, "item") // "0 items"
 */
export function simplePlural(
  count: number,
  singular: string,
  plural?: string
): string {
  const pluralForm = plural || `${singular}s`;
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

// =============================================================================
// Date Formatting
// =============================================================================

/**
 * Date format mapping to date-fns format strings
 */
const DATE_FORMATS: Record<DateFormat, string> = {
  time_12h: 'h:mm a', // 9:00 AM
  time_24h: 'HH:mm', // 09:00
  date_short: 'MMM d, yyyy', // Jan 1, 2024
  date_long: 'MMMM d, yyyy', // January 1, 2024
  datetime: 'MMM d, yyyy h:mm a', // Jan 1, 2024 9:00 AM
};

/**
 * Format a date using predefined formats from locale
 *
 * @param date - Date to format
 * @param formatKey - Format key from locale time.formats
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date(), 'date_short') // "Jan 1, 2024"
 * formatDate(new Date(), 'time_12h') // "9:00 AM"
 */
export function formatDate(date: Date, formatKey: DateFormat): string {
  const formatString = DATE_FORMATS[formatKey];
  if (!formatString) {
    console.warn(`Unknown date format: ${formatKey}`);
    return date.toISOString();
  }

  try {
    return dateFnsFormat(date, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return date.toISOString();
  }
}

/**
 * Format a date with a custom format string
 *
 * @param date - Date to format
 * @param formatString - Custom date-fns format string
 * @returns Formatted date string
 *
 * @example
 * formatDateCustom(new Date(), 'yyyy-MM-dd') // "2024-01-01"
 */
export function formatDateCustom(date: Date, formatString: string): string {
  try {
    return dateFnsFormat(date, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return date.toISOString();
  }
}

// =============================================================================
// Type Guards and Validators
// =============================================================================

/**
 * Check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if a value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Check if a value is an object (not null, not array)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// =============================================================================
// Locale Path Helpers
// =============================================================================

/**
 * Join locale path segments with dots
 * Filters out empty/undefined segments
 *
 * @example
 * joinLocalePath("hero", "title") // "hero.title"
 * joinLocalePath("hero", "", "subtitle") // "hero.subtitle"
 */
export function joinLocalePath(...segments: (string | undefined)[]): string {
  return segments.filter((s) => s && s.length > 0).join('.');
}

/**
 * Split a locale path into segments
 *
 * @example
 * splitLocalePath("hero.title") // ["hero", "title"]
 */
export function splitLocalePath(path: string): string[] {
  return path.split('.');
}

// =============================================================================
// Locale Key Validation
// =============================================================================

/**
 * Check if a locale key is valid
 * Valid keys are non-empty and contain only alphanumeric, underscore, hyphen, and dot
 */
export function isValidLocaleKey(key: string): boolean {
  return /^[a-zA-Z0-9_.-]+$/.test(key);
}

/**
 * Sanitize a locale key
 * Removes invalid characters and normalizes the key
 */
export function sanitizeLocaleKey(key: string): string {
  return key
    .replace(/[^a-zA-Z0-9_.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^[_.-]+|[_.-]+$/g, '');
}

// =============================================================================
// Error Handling Helpers
// =============================================================================

/**
 * Create a fallback string for missing locale keys
 * Returns a clear indicator that helps debugging
 */
export function createFallback(key: string, showKey = true): string {
  if (showKey) {
    return `[${key}]`;
  }
  return '';
}

/**
 * Log a warning for missing locale keys (only in development)
 */
export function warnMissingLocale(key: string, filename?: string): void {
  if (process.env.NODE_ENV === 'development') {
    const location = filename ? ` in ${filename}` : '';
    console.warn(`[Locale] Missing key: "${key}"${location}`);
  }
}

// =============================================================================
// Array Helpers
// =============================================================================

/**
 * Get a specific item from a locale array with fallback
 *
 * @example
 * const ranks = locale.data.ranks;
 * getArrayItem(ranks, 0, "Unknown") // Returns first rank or "Unknown"
 */
export function getArrayItem<T>(
  array: T[] | undefined,
  index: number,
  fallback: T
): T {
  if (!array || !Array.isArray(array)) {
    return fallback;
  }
  return array[index] ?? fallback;
}

/**
 * Find an item in an array of objects by a specific property
 *
 * @example
 * const types = locale.data.coaching_types;
 * findArrayItem(types, "value", "vod-review")
 */
export function findArrayItem<T extends Record<string, any>>(
  array: T[] | undefined,
  key: keyof T,
  value: any
): T | undefined {
  if (!array || !Array.isArray(array)) {
    return undefined;
  }
  return array.find((item) => item[key] === value);
}

// =============================================================================
// Development Helpers
// =============================================================================

/**
 * Pretty print locale data for debugging
 */
export function debugLocale(data: unknown, maxDepth = 3): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Get all keys from a nested object (flattened with dot notation)
 *
 * @example
 * getAllKeys({ hero: { title: "Hi", subtitle: "Hello" } })
 * // Returns: ["hero.title", "hero.subtitle"]
 */
export function getAllKeys(obj: Record<string, any>, prefix = ''): string[] {
  let keys: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (isObject(value) && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value as Record<string, any>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}
