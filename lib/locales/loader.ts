/**
 * Server-side locale loader for Next.js Server Components
 * Loads and caches YAML locale files
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { LocaleData, LocaleKey } from './types';

// Cache for parsed locale data
const localeCache = new Map<string, LocaleData>();

/**
 * Base path to locale files
 */
const LOCALES_PATH = path.join(process.cwd(), 'locales', 'english');

/**
 * Load and parse a single YAML locale file
 * @param filename - Name of the YAML file (without extension)
 * @returns Parsed locale data
 * @throws Error if file doesn't exist or is invalid YAML
 */
export function loadLocale<T extends LocaleKey>(filename: T): LocaleData {
  // Check cache first
  if (localeCache.has(filename)) {
    return localeCache.get(filename)!;
  }

  const filePath = path.join(LOCALES_PATH, `${filename}.yaml`);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Locale file not found: ${filename}.yaml at ${filePath}`);
  }

  try {
    // Read and parse YAML file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents) as LocaleData;

    // Cache the result
    localeCache.set(filename, data);

    return data;
  } catch (error) {
    throw new Error(
      `Failed to parse locale file ${filename}.yaml: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Load all available locale files
 * @returns Object with all locale data keyed by filename
 */
export function loadAllLocales(): Record<string, LocaleData> {
  const locales: Record<string, LocaleData> = {};

  try {
    // Read all files in the locales directory
    const files = fs.readdirSync(LOCALES_PATH);

    // Filter for YAML files only
    const yamlFiles = files.filter(
      (file) => file.endsWith('.yaml') || file.endsWith('.yml')
    );

    // Load each file
    for (const file of yamlFiles) {
      const filename = file.replace(/\.(yaml|yml)$/, '');

      // Skip README files
      if (filename.toLowerCase() === 'readme') {
        continue;
      }

      try {
        locales[filename] = loadLocale(filename as LocaleKey);
      } catch (error) {
        console.warn(`Warning: Could not load locale file ${file}:`, error);
      }
    }

    return locales;
  } catch (error) {
    throw new Error(
      `Failed to read locales directory: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Get a nested value from locale data using dot notation
 * @param data - Locale data object
 * @param path - Dot-separated path (e.g., "hero.title")
 * @returns The value at the path, or undefined if not found
 */
export function getNestedValue(
  data: LocaleData,
  path: string
): string | string[] | Record<string, any> | undefined {
  const keys = path.split('.');
  let current: any = data;

  for (const key of keys) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

/**
 * Get a string value from locale data with error handling
 * @param data - Locale data object
 * @param path - Dot-separated path (e.g., "hero.title")
 * @param fallback - Fallback value if not found (defaults to path)
 * @returns The string value or fallback
 */
export function getLocaleString(
  data: LocaleData,
  path: string,
  fallback?: string
): string {
  const value = getNestedValue(data, path);

  if (typeof value === 'string') {
    return value;
  }

  if (value === undefined) {
    console.warn(`Locale string not found: ${path}`);
    return fallback ?? `[${path}]`;
  }

  console.warn(`Locale value at ${path} is not a string:`, value);
  return fallback ?? `[${path}]`;
}

/**
 * Clear the locale cache (useful for development/testing)
 */
export function clearLocaleCache(): void {
  localeCache.clear();
}

/**
 * Get cache statistics (useful for debugging)
 */
export function getCacheStats() {
  return {
    size: localeCache.size,
    keys: Array.from(localeCache.keys()),
  };
}

/**
 * Type-safe locale loader with specific return types
 * Use this for better TypeScript support
 */
export function loadTypedLocale<T extends LocaleKey, R = LocaleData>(
  filename: T
): R {
  return loadLocale(filename) as R;
}
