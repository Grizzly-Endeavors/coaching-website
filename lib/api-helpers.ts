import { NextRequest } from 'next/server';

/**
 * Extracts all query parameters from a NextRequest as a key-value object.
 * Useful for admin API routes that need to process multiple optional filters.
 *
 * @param request - The NextRequest object
 * @returns Record with parameter names as keys and values (or undefined if not present)
 *
 * @example
 * // URL: /api/admin/bookings?status=SCHEDULED&page=1
 * const params = extractQueryParams(request);
 * // Result: { status: 'SCHEDULED', page: '1' }
 */
export function extractQueryParams(request: NextRequest): Record<string, string | undefined> {
  const searchParams = request.nextUrl.searchParams;
  return Object.fromEntries(
    Array.from(searchParams.entries()).map(([key, value]) => [key, value || undefined])
  );
}

/**
 * Extracts specific query parameters from a NextRequest.
 * Returns undefined for parameters that are not present.
 *
 * @param request - The NextRequest object
 * @param keys - Array of parameter names to extract
 * @returns Record with only the specified parameter names
 *
 * @example
 * // URL: /api/admin/bookings?status=SCHEDULED&page=1&limit=10
 * const params = extractSpecificParams(request, ['status', 'page']);
 * // Result: { status: 'SCHEDULED', page: '1' }
 */
export function extractSpecificParams<T extends string>(
  request: NextRequest,
  keys: T[]
): Record<T, string | undefined> {
  const searchParams = request.nextUrl.searchParams;
  return keys.reduce(
    (acc, key) => {
      const value = searchParams.get(key);
      acc[key] = value || undefined;
      return acc;
    },
    {} as Record<T, string | undefined>
  );
}
