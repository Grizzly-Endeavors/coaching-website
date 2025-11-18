# Architecture Fixes - Code Examples

This document provides concrete code examples for fixing the critical architectural issues.

---

## Fix 1: Add Rate Limiting to Public Endpoints

### Current Code (VULNERABLE)
```typescript
// /api/replay/submit/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = replaySubmissionSchema.parse(body);
    // ... process submission
  } catch (error) {
    // ...
  }
}
```

### Problem
Anyone can spam submissions repeatedly.

### Solution: Create Rate Limit Middleware

```typescript
// lib/api-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from './rate-limit';

export async function withRateLimit(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<Response>,
  limitKey: string = 'global'
): Promise<Response> {
  // Get client IP (handle proxies)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  
  const key = `${limitKey}:${ip}`;
  
  // Check rate limit (e.g., 10 requests per minute)
  if (!rateLimiter.check(key, { maxRequests: 10, windowMs: 60000 })) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }
  
  // Call the handler
  return handler(request);
}

// Usage in API route:
export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req) => {
    try {
      const body = await req.json();
      // ... process
    } catch (error) {
      // ...
    }
  }, 'replay-submit');
}
```

### Alternative: Using Simple In-Memory Rate Limiter

```typescript
// lib/rate-limit-simple.ts
class SimpleRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number = 60000; // 1 minute

  check(key: string, maxRequests: number = 10): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const simpleRateLimiter = new SimpleRateLimiter();
```

**Affected Endpoints:**
- `/api/replay/submit` - Use limit of 3 requests per hour
- `/api/contact` - Use limit of 5 requests per hour  
- `/api/payment/details` - Use limit of 30 requests per minute
- `/api/blog/posts` - Use limit of 60 requests per minute

---

## Fix 2: Verify Webhook Signatures

### Current Code (VULNERABLE)
```typescript
// /api/webhooks/stripe/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // DANGEROUS: No signature verification!
  const event = body;
  
  if (event.type === 'payment_intent.succeeded') {
    // Update database...
  }
}
```

### Problem
Anyone can send fake webhook events and manipulate your database.

### Solution: Implement Signature Verification

```typescript
// /api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature');
    const body = await request.text();
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }
    
    // Verify the webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }
    
    // Now process the verified event
    console.log(`Processing verified Stripe event: ${event.type}`);
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      // Update database with verified data
      await handlePaymentSuccess(paymentIntent);
    }
    
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  const { id, metadata, amount } = paymentIntent;
  // Update payment in database
  console.log(`Payment succeeded: ${id} for amount ${amount}`);
}
```

### For Google Calendar Webhooks

```typescript
// /api/webhooks/google-calendar/route.ts
import { verifyGoogleWebhook } from '@/lib/google-calendar-verification';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const body = await request.json();
    
    // Verify authorization token (if using OAuth)
    // Or implement UUID verification if using channel subscriptions
    
    // For channel subscriptions, verify the X-Goog-Channel-Token header
    const channelToken = request.headers.get('x-goog-channel-token');
    const expectedToken = process.env.GOOGLE_CALENDAR_WEBHOOK_TOKEN;
    
    if (channelToken !== expectedToken) {
      return NextResponse.json(
        { error: 'Invalid channel token' },
        { status: 401 }
      );
    }
    
    console.log('Google Calendar webhook verified and received');
    
    // Process the verified webhook
    // Your calendar sync logic here
    
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
```

**Action:**
- Add `STRIPE_WEBHOOK_SECRET` to `.env.example` and production secrets
- Add `GOOGLE_CALENDAR_WEBHOOK_TOKEN` if using channel subscriptions
- Document how to get these values

---

## Fix 3: Remove Unused google-calendar-sync.ts

### Current Problem
```
lib/google-calendar.ts        (711 lines) - Main implementation
lib/calendar-sync.ts           (451 lines) - Sync utilities  
lib/google-calendar-sync.ts    (156 lines) - Unused wrapper ← DELETE THIS
```

### The File Is Unused
```bash
# This will return nothing if no files import it
grep -r "from.*google-calendar-sync\|import.*google-calendar-sync" .
```

### Solution: Delete It

```bash
# Simply remove the file
rm /home/user/coaching-website/lib/google-calendar-sync.ts
```

### If You Want to Keep Similar Naming

Consolidate into two files with clearer names:

```typescript
// lib/google-calendar/api.ts
// - fetchUpcomingBookings()
// - getEventById()
// - createEvent()
// - updateEvent()

// lib/google-calendar/sync.ts  
// - syncEventToDatabase()
// - syncAllUpcomingEvents()
// - handleEventCreated()
// - handleEventUpdated()
// - handleEventDeleted()

// lib/google-calendar/index.ts
export * from './api';
export * from './sync';
```

---

## Fix 4: Standardize API Response Format

### Current Problem
Some endpoints return different formats:

```typescript
// Type 1: /api/admin/submissions
return NextResponse.json({
  success: true,
  count: 5,
  submissions: [...]
});

// Type 2: /api/blog/posts  
return NextResponse.json({
  posts: [...],
  pagination: {...}
});
```

### Solution: Create Standard Response Type

```typescript
// lib/api-response.ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Helper functions for consistent responses
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function successPaginatedResponse<T>(
  items: T[],
  page: number,
  limit: number,
  total: number
): ApiResponse<PaginatedData<T>> {
  return {
    success: true,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
    timestamp: new Date().toISOString(),
  };
}

export function errorResponse(error: string, message?: string): ApiResponse {
  return {
    success: false,
    error,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function validationErrorResponse(details: any): ApiResponse {
  return {
    success: false,
    error: 'Validation failed',
    data: { details },
    timestamp: new Date().toISOString(),
  };
}
```

### Usage in API Routes

```typescript
// /api/admin/submissions/route.ts
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    
    const submissions = await prisma.replaySubmission.findMany({...});
    
    return NextResponse.json(
      successPaginatedResponse(submissions, 1, 20, submissions.length)
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        validationErrorResponse(error.errors),
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}

// /api/blog/posts/route.ts
export async function GET(request: NextRequest) {
  try {
    const { page, limit, tag } = validateQuery(request);
    
    const [posts, total] = await getPosts(page, limit, tag);
    
    return NextResponse.json(
      successPaginatedResponse(posts, page, limit, total),
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        }
      }
    );
  } catch (error) {
    // ... error handling
  }
}
```

---

## Fix 5: Consolidate Auth Files

### Current Problem
```
lib/auth.ts          - NextAuth config (128 lines)
lib/auth-helpers.ts  - Auth utilities (173 lines)
```

Unclear why they're separated.

### Solution Option 1: Flatten

```typescript
// lib/auth.ts (consolidate all)
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare, hash } from 'bcryptjs';
import { prisma } from './prisma';
import { z } from 'zod';
import { loginRateLimiter } from './rate-limit';

// ... NextAuth setup

// Utility functions
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  // ...
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  // ...
}

export async function requireAuthPage() {
  // ...
}
```

Delete `auth-helpers.ts`.

### Solution Option 2: Structured Folder

```
lib/auth/
├── index.ts          # Exports
├── config.ts         # NextAuth configuration  
├── providers.ts      # Auth providers
└── utils.ts          # Helper functions (password hashing, etc)
```

```typescript
// lib/auth/index.ts
export { handlers, signIn, signOut, auth } from './config';
export * from './utils';

// lib/auth/utils.ts
export async function hashPassword(password: string) { ... }
export async function requireAuthPage() { ... }
export async function getCurrentUserId() { ... }
```

---

## Fix 6: Move Loose Component

### Current
```
components/DiscordConnect.tsx  ← Root level
```

### Solution
```bash
# Create auth folder
mkdir -p /home/user/coaching-website/components/auth

# Move component
mv components/DiscordConnect.tsx components/auth/DiscordConnect.tsx

# Update imports in components/auth/index.ts
```

---

## Fix 7: Consistent Input Validation

### Current Problem
```typescript
// /api/payment/details/route.ts - MANUAL validation
const sessionId = searchParams.get('session_id');
if (!sessionId) {
  return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
}

// Other routes use Zod - inconsistent!
```

### Solution: Always Use Zod

```typescript
// /api/payment/details/route.ts
import { z } from 'zod';

const paymentQuerySchema = z.object({
  session_id: z.string()
    .min(1, 'Session ID is required')
    .startsWith('cs_', 'Invalid session ID format'),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const { session_id } = paymentQuerySchema.parse(searchParams);
    
    const payment = await prisma.payment.findUnique({
      where: { stripeSessionId: session_id },
    });
    
    return NextResponse.json(successResponse(payment));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        validationErrorResponse(error.errors),
        { status: 400 }
      );
    }
    // ...
  }
}
```

---

## Summary: Priority Implementation Order

1. **Day 1 AM:** Fix webhook signature verification (2 files, 1-2 hours)
2. **Day 1 PM:** Add rate limiting to public endpoints (4 files, 2-3 hours)
3. **Day 2 AM:** Remove unused file + standardize response format (2 hours)
4. **Day 2 PM:** Consolidate auth files + move loose component (1 hour)
5. **Day 3:** Add input validation consistency (1-2 hours)

Total: ~8-10 hours of focused work, highly impactful.

