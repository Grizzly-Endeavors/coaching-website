'use client';

/**
 * Client-side locale context and hooks
 * Use these in Client Components for dynamic locale access
 */

import React, { createContext, useContext, useMemo } from 'react';
import type { LocaleData, InterpolationVars, PluralOptions } from './types';
import {
  interpolate,
  pluralize,
  formatDate,
  warnMissingLocale,
  createFallback,
} from './utils';
import type { DateFormat } from './types';

// =============================================================================
// Context Setup
// =============================================================================

interface LocaleContextValue {
  locales: Record<string, LocaleData>;
  currentLocale: string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

// =============================================================================
// Provider Component
// =============================================================================

interface LocaleProviderProps {
  children: React.ReactNode;
  /**
   * Locale data loaded from server
   * Pass this from Server Components via props
   */
  locales: Record<string, LocaleData>;
  /**
   * Current locale code (e.g., 'en', 'es')
   * Defaults to 'en'
   */
  currentLocale?: string;
}

/**
 * Locale Provider Component
 * Wrap your app or specific sections with this to provide locale data to client components
 *
 * @example
 * // In Server Component
 * import { loadAllLocales } from '@/lib/locales/loader';
 * import { LocaleProvider } from '@/lib/locales/client';
 *
 * export default function Layout({ children }) {
 *   const locales = loadAllLocales();
 *   return (
 *     <LocaleProvider locales={locales}>
 *       {children}
 *     </LocaleProvider>
 *   );
 * }
 */
export function LocaleProvider({
  children,
  locales,
  currentLocale = 'en',
}: LocaleProviderProps) {
  const value = useMemo(
    () => ({
      locales,
      currentLocale,
    }),
    [locales, currentLocale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Access the locale context
 * @throws Error if used outside LocaleProvider
 */
function useLocaleContext(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

/**
 * Get locale data for a specific file
 *
 * @param filename - Locale file name (without extension)
 * @returns Locale data object
 *
 * @example
 * const common = useLocaleFile('common');
 * return <button>{common.buttons.primary.submit}</button>
 */
export function useLocaleFile(filename: string): LocaleData {
  const { locales } = useLocaleContext();
  const data = locales[filename];

  if (!data) {
    warnMissingLocale(filename);
    return {};
  }

  return data;
}

/**
 * Get a specific locale string with dot notation
 *
 * @param filename - Locale file name
 * @param path - Dot-separated path to the string
 * @param options - Optional interpolation vars and fallback
 * @returns Localized string
 *
 * @example
 * const text = useLocale('common', 'buttons.primary.submit');
 * const greeting = useLocale('home', 'hero.title', {
 *   vars: { name: "John" },
 *   fallback: "Hello"
 * });
 */
export function useLocale(
  filename: string,
  path: string,
  options?: {
    vars?: InterpolationVars;
    fallback?: string;
  }
): string {
  const data = useLocaleFile(filename);

  // Navigate through the path
  const keys = path.split('.');
  let current: any = data;

  for (const key of keys) {
    if (current === undefined || current === null) {
      warnMissingLocale(`${filename}.${path}`);
      return options?.fallback ?? createFallback(path);
    }
    current = current[key];
  }

  // Ensure we got a string
  if (typeof current !== 'string') {
    warnMissingLocale(`${filename}.${path}`, filename);
    return options?.fallback ?? createFallback(path);
  }

  // Apply interpolation if vars provided
  if (options?.vars) {
    return interpolate(current, options.vars);
  }

  return current;
}

/**
 * Get multiple locale strings at once
 *
 * @param filename - Locale file name
 * @param paths - Array of dot-separated paths
 * @returns Object with keys being the last segment of path and values being the strings
 *
 * @example
 * const { submit, cancel } = useLocales('common', [
 *   'buttons.primary.submit',
 *   'buttons.primary.cancel'
 * ]);
 */
export function useLocales(
  filename: string,
  paths: string[]
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const path of paths) {
    const segments = path.split('.');
    const key = segments[segments.length - 1];
    result[key] = useLocale(filename, path);
  }

  return result;
}

/**
 * Hook for pluralization in client components
 *
 * @param count - Number to determine plural form
 * @param options - Plural form options
 * @returns Pluralized string
 *
 * @example
 * const text = usePlural(count, {
 *   zero: "No items",
 *   one: "1 item",
 *   other: "{count} items"
 * });
 */
export function usePlural(count: number, options: PluralOptions): string {
  return useMemo(() => pluralize(count, options), [count, options]);
}

/**
 * Hook for date formatting in client components
 *
 * @param date - Date to format
 * @param formatKey - Format key from locale
 * @returns Formatted date string
 *
 * @example
 * const formattedDate = useFormatDate(new Date(), 'date_short');
 */
export function useFormatDate(date: Date, formatKey: DateFormat): string {
  return useMemo(() => formatDate(date, formatKey), [date, formatKey]);
}

/**
 * Hook for string interpolation in client components
 * Useful when you have a locale string and need to interpolate it
 *
 * @param text - Text with placeholders
 * @param vars - Variables to interpolate
 * @returns Interpolated string
 *
 * @example
 * const text = useInterpolate("Hello {name}!", { name: userName });
 */
export function useInterpolate(
  text: string,
  vars: InterpolationVars
): string {
  return useMemo(() => interpolate(text, vars), [text, vars]);
}

// =============================================================================
// Convenience Hooks for Common Locales
// =============================================================================

/**
 * Hook for common locale strings
 * Provides quick access to frequently used UI strings
 *
 * @example
 * const common = useCommonLocale();
 * return <button>{common.buttons.primary.submit}</button>
 */
export function useCommonLocale(): LocaleData {
  return useLocaleFile('common');
}

/**
 * Hook for validation messages
 * Useful in forms and validation logic
 *
 * @example
 * const validation = useValidationLocale();
 * const error = validation.email.invalid;
 */
export function useValidationLocale(): LocaleData {
  return useLocaleFile('validation');
}

// =============================================================================
// Higher-Order Component
// =============================================================================

/**
 * HOC to inject locale props into a component
 *
 * @example
 * interface Props {
 *   locale: LocaleData;
 * }
 *
 * function MyComponent({ locale }: Props) {
 *   return <div>{locale.hero.title}</div>;
 * }
 *
 * export default withLocale('home')(MyComponent);
 */
export function withLocale<P extends { locale: LocaleData }>(
  filename: string
) {
  return function (Component: React.ComponentType<P>) {
    return function WithLocaleComponent(
      props: Omit<P, 'locale'>
    ): React.ReactElement {
      const locale = useLocaleFile(filename);
      return <Component {...(props as P)} locale={locale} />;
    };
  };
}

// =============================================================================
// Type-safe Hook Creators
// =============================================================================

/**
 * Create a type-safe hook for a specific locale file
 * This provides full TypeScript autocomplete for your locale structure
 *
 * @example
 * // Define your type
 * interface HomeLocale {
 *   hero: {
 *     title: string;
 *     subtitle: string;
 *   };
 * }
 *
 * // Create typed hook
 * export const useHomeLocale = createTypedLocaleHook<HomeLocale>('home');
 *
 * // Use in component
 * const home = useHomeLocale();
 * return <h1>{home.hero.title}</h1>; // Full autocomplete!
 */
export function createTypedLocaleHook<T extends LocaleData>(filename: string) {
  return (): T => {
    return useLocaleFile(filename) as T;
  };
}

// =============================================================================
// Debug Helpers (Development Only)
// =============================================================================

/**
 * Hook to access all loaded locales (for debugging)
 * Only use in development
 */
export function useAllLocales(): Record<string, LocaleData> {
  const { locales } = useLocaleContext();
  return locales;
}

/**
 * Hook to get current locale code
 */
export function useCurrentLocale(): string {
  const { currentLocale } = useLocaleContext();
  return currentLocale;
}
