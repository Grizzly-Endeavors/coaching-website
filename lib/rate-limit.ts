/**
 * Simple in-memory rate limiter for login attempts
 *
 * This provides basic rate limiting for authentication endpoints.
 * For production with multiple instances, consider using Redis.
 *
 * Security features:
 * - Limits login attempts per IP address
 * - Configurable window and max attempts
 * - Automatic cleanup of old entries
 */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

class RateLimiter {
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
   * Check if an identifier (IP address) has exceeded the rate limit
   * @param identifier - Usually an IP address or user identifier
   * @returns Object with isLimited boolean and remaining attempts
   */
  check(identifier: string): {
    isLimited: boolean;
    remaining: number;
    resetAt: number;
  } {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    // No previous attempts or window has expired
    if (!entry || now > entry.resetAt) {
      const resetAt = now + this.windowMs;
      this.attempts.set(identifier, { count: 1, resetAt });

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
      resetAt: entry.resetAt,
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
        if (now > entry.resetAt) {
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
 * Limits: 5 attempts per 15 minutes per IP address
 */
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000);

/**
 * Helper to get client IP from request
 * Checks various headers commonly used by proxies and CDNs
 */
export function getClientIp(request: Request): string {
  // Try to get IP from various headers
  const headers = request.headers;

  // Cloudflare
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
