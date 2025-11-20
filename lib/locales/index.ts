/**
 * Locale System - Main Entry Point
 *
 * A comprehensive locale loading system for YAML translation files
 * with full TypeScript support, caching, and utilities.
 *
 * @see example-usage.md for detailed usage examples
 */

// =============================================================================
// Server-Side Exports (for Server Components)
// =============================================================================

export {
  loadLocale,
  loadAllLocales,
  loadTypedLocale,
  getNestedValue,
  getLocaleString,
  clearLocaleCache,
  getCacheStats,
} from './loader';

// =============================================================================
// Client-Side Exports (for Client Components)
// =============================================================================

export {
  LocaleProvider,
  useLocale,
  useLocales,
  useLocaleFile,
  usePlural,
  useFormatDate,
  useInterpolate,
  useCommonLocale,
  useValidationLocale,
  useAllLocales,
  useCurrentLocale,
  withLocale,
  createTypedLocaleHook,
} from './client';

// =============================================================================
// Utility Exports (for both Server and Client)
// =============================================================================

export {
  // String interpolation
  interpolate,
  hasPlaceholders,
  extractPlaceholders,

  // Pluralization
  pluralize,
  simplePlural,

  // Date formatting
  formatDate,
  formatDateCustom,

  // Type guards
  isString,
  isArray,
  isObject,

  // Path helpers
  joinLocalePath,
  splitLocalePath,

  // Validation
  isValidLocaleKey,
  sanitizeLocaleKey,

  // Error handling
  createFallback,
  warnMissingLocale,

  // Array helpers
  getArrayItem,
  findArrayItem,

  // Debug helpers
  debugLocale,
  getAllKeys,
} from './utils';

// =============================================================================
// Type Exports
// =============================================================================

export type {
  LocaleKey,
  LocaleData,
  CommonLocale,
  HomeLocale,
  ValidationLocale,
  BookingLocale,
  InterpolationVars,
  PluralOptions,
  DateFormat,
} from './types';
