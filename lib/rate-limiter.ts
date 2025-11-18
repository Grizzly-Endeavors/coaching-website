import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (for development/small scale)
// For production at scale, replace with Redis (Upstash)

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

export function getClientIp(request: NextRequest): string {
  // Check various headers in order of preference
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return 'unknown';
}

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

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
