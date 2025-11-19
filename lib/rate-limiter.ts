/**
 * Unified Rate Limiting Module
 *
 * This provides rate limiting for various endpoints across the application.
 * For production with multiple instances, consider using Redis (Upstash).
 *
 * Features:
 * - Function-based API for general rate limiting
 * - Class-based RateLimiter for specialized use cases
 * - Automatic cleanup of old entries
 * - Configurable window and max attempts
 * - Support for both NextRequest and standard Request
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000).unref();

/**
 * Helper to get client IP from request
 * Checks various headers commonly used by proxies and CDNs
 * Works with both NextRequest and standard Request
 */
export function getClientIp(request: NextRequest | Request): string {
  const headers = request.headers;

  // Cloudflare (priority)
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;

  // Standard forwarded headers
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // Take the first IP in the list
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  // Fallback to a placeholder (shouldn't happen in production)
  return 'unknown';
}

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

/**
 * Function-based rate limiter
 * Use this for general rate limiting in API routes
 */
export async function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): Promise<{ success: boolean; response?: NextResponse }> {
  const ip = getClientIp(request);
  const key = `ratelimit:${ip}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    return { success: true };
  }

  if (entry.count >= options.maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
          message: options.message || 'Please try again later',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': options.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString(),
          },
        }
      ),
    };
  }

  // Increment counter
  entry.count += 1;
  rateLimitStore.set(key, entry);

  return { success: true };
}

/**
 * Get rate limit headers for a successful response
 */
export function getRateLimitHeaders(
  request: NextRequest,
  options: RateLimitOptions
): Record<string, string> {
  const ip = getClientIp(request);
  const key = `ratelimit:${ip}`;
  const entry = rateLimitStore.get(key);

  if (!entry) {
    return {
      'X-RateLimit-Limit': options.maxRequests.toString(),
      'X-RateLimit-Remaining': (options.maxRequests - 1).toString(),
      'X-RateLimit-Reset': (Date.now() + options.windowMs).toString(),
    };
  }

  const remaining = Math.max(0, options.maxRequests - entry.count);

  return {
    'X-RateLimit-Limit': options.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': entry.resetTime.toString(),
  };
}

// =============================================================================
// Class-based RateLimiter (for specialized use cases like login rate limiting)
// =============================================================================

type RateLimitCheckResult = {
  isLimited: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * Class-based rate limiter for specialized use cases
 * Provides more control and state management than the function-based API
 */
export class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {
    // Start cleanup interval to prevent memory leaks
    this.startCleanup();
  }

  /**
   * Check if an identifier (IP address or email) has exceeded the rate limit
   * @param identifier - Usually an IP address or user identifier
   * @returns Object with isLimited boolean and remaining attempts
   */
  check(identifier: string): RateLimitCheckResult {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    // No previous attempts or window has expired
    if (!entry || now > entry.resetTime) {
      const resetAt = now + this.windowMs;
      this.attempts.set(identifier, { count: 1, resetTime: resetAt });

      return {
        isLimited: false,
        remaining: this.maxAttempts - 1,
        resetAt,
      };
    }

    // Increment attempt count
    entry.count += 1;
    this.attempts.set(identifier, entry);

    const isLimited = entry.count > this.maxAttempts;
    const remaining = Math.max(0, this.maxAttempts - entry.count);

    return {
      isLimited,
      remaining,
      resetAt: entry.resetTime,
    };
  }

  /**
   * Reset rate limit for an identifier (e.g., after successful login)
   * @param identifier - Usually an IP address or user identifier
   */
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  /**
   * Start periodic cleanup of expired entries
   * Runs every 5 minutes
   */
  private startCleanup(): void {
    if (this.cleanupInterval) return;

    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const entries = Array.from(this.attempts.entries());

      for (const [identifier, entry] of entries) {
        if (now > entry.resetTime) {
          this.attempts.delete(identifier);
        }
      }
    }, 5 * 60 * 1000); // Run every 5 minutes

    // Prevent the interval from keeping the process alive
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * Stop cleanup interval (for graceful shutdown)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.attempts.clear();
  }
}

/**
 * Global rate limiter instance for login attempts
 * Limits: 5 attempts per 15 minutes per email/IP
 */
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000);

/**
 * Middleware helper to check rate limit
 * Returns null if allowed, or an error response if rate limited
 *
 * @example
 * ```typescript
 * export async function POST(request: Request) {
 *   const rateLimitResult = checkRateLimit(request, loginRateLimiter);
 *   if (rateLimitResult) return rateLimitResult;
 *
 *   // ... proceed with login logic
 * }
 * ```
 */
export function checkRateLimit(
  request: Request,
  limiter: RateLimiter = loginRateLimiter
): Response | null {
  const ip = getClientIp(request);
  const { isLimited, remaining, resetAt } = limiter.check(ip);

  if (isLimited) {
    const resetDate = new Date(resetAt);
    const minutesUntilReset = Math.ceil((resetAt - Date.now()) / 60000);

    return new Response(
      JSON.stringify({
        error: 'Too many login attempts',
        message: `Please try again in ${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}`,
        resetAt: resetDate.toISOString(),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((resetAt - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': String(limiter['maxAttempts']),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetDate.toISOString(),
        },
      }
    );
  }

  // Not rate limited - allowed to proceed
  return null;
}
