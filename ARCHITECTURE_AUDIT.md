# Coaching Website - Architectural Analysis Report

## Executive Summary
The coaching website is a Next.js 14 application with a well-structured foundation, but has several organizational inconsistencies and potential architectural improvements. Overall code quality is good with proper TypeScript usage and validation, but there are some areas of concern regarding code organization and separation of concerns.

**Overall Assessment: FAIR/GOOD** (6.5/10)
- Well-implemented core features
- Decent component organization
- Some problematic patterns and organizational inconsistencies
- Missing critical infrastructure components (rate limiting, caching)

---

## 1. OVERALL FILE AND FOLDER ORGANIZATION

### Current Structure
```
app/                          # Next.js App Router
├── (public)/                 # Public route group
│   ├── page.tsx             # Home page
│   ├── blog/                # Blog pages
│   ├── booking/             # Booking page
│   ├── pricing/             # Pricing page
│   ├── contact/             # Contact page
│   └── calendar-test/       # Test page
├── admin/                    # Admin dashboard pages
├── api/                      # API routes
│   ├── admin/               # Admin endpoints
│   ├── auth/                # Auth endpoints
│   ├── blog/                # Blog endpoints
│   ├── booking/             # Booking endpoints
│   ├── payment/             # Payment endpoints
│   ├── contact/             # Contact endpoint
│   ├── replay/              # Replay submission endpoint
│   └── webhooks/            # External webhooks
├── checkout/                # Checkout pages
├── login/                   # Login pages
└── layout.tsx              # Root layout

components/                   # React components
├── ui/                      # UI components (atomic)
├── forms/                   # Form components
├── layout/                  # Layout components
├── admin/                   # Admin UI components
├── blog/                    # Blog components
├── booking/                 # Booking components
└── DiscordConnect.tsx       # Loose component (should be organized)

lib/                         # Utilities and services
├── auth.ts                  # NextAuth configuration
├── auth-helpers.ts          # Auth helper functions
├── stripe.ts                # Stripe integration
├── discord.ts               # Discord bot/OAuth
├── google-calendar.ts       # Google Calendar API
├── calendar-sync.ts         # Calendar sync logic
├── google-calendar-sync.ts  # Calendar sync wrapper (DUPLICATE)
├── validations.ts           # Main validation schemas
├── validations/             # Subdirectory for validations
├── utils.ts                 # General utilities
├── types.ts                 # Type definitions
├── markdown.ts              # Markdown utilities
├── prisma.ts                # Prisma client
└── rate-limit.ts            # Rate limiting

prisma/
└── schema.prisma            # Database schema

scripts/                      # Utility scripts
```

### Issues Found

#### 1.1 Calendar Integration Confusion
**SEVERITY: MEDIUM**

Three separate files for similar concerns:
- `lib/google-calendar.ts` (711 lines) - Core Google Calendar API
- `lib/calendar-sync.ts` (451 lines) - Syncing to database
- `lib/google-calendar-sync.ts` (156 lines) - Wrapper around calendar-sync

**Problem:** `google-calendar-sync.ts` is NOT USED ANYWHERE. It's a thin wrapper that adds confusion rather than clarity.

```typescript
// google-calendar-sync.ts (UNUSED)
export async function syncCalendarToDatabase(maxResults = 100, sendConfirmationEmails = false) {
  return syncAllUpcomingEvents(maxResults, sendConfirmationEmails); // Just calls calendar-sync
}
```

**Recommendation:** Remove `google-calendar-sync.ts` or consolidate its functions into `calendar-sync.ts` with clearer naming.

---

#### 1.2 Auth Files Separation
**SEVERITY: MEDIUM**

Two auth-related files with unclear separation:
- `lib/auth.ts` (128 lines) - NextAuth configuration and session setup
- `lib/auth-helpers.ts` (173 lines) - Password hashing, auth utilities

**Problem:** This split isn't clearly justified. It's not a "services" vs "utilities" split - both are utilities. The naming doesn't reflect their purpose.

**Recommendation:** Either:
1. Consolidate into `lib/auth.ts` with a section for utilities
2. Rename to `lib/auth/config.ts` and `lib/auth/helpers.ts` in a subfolder structure

---

#### 1.3 Loose Component in Root
**SEVERITY: LOW**

`components/DiscordConnect.tsx` is at the root level instead of being organized into a subdirectory.

**Recommendation:** Move to `components/auth/DiscordConnect.tsx` since it's auth-related.

---

#### 1.4 Validation Files Split
**SEVERITY: LOW**

Validation schemas are split between:
- `lib/validations.ts` (main schemas)
- `lib/validations/booking.ts` (booking-specific)
- `lib/validations/contact.ts` (contact-specific)

**Problem:** `lib/validations.ts` imports from `lib/validations/booking.ts` creating a circular-like pattern, though not technically circular.

**Recommendation:** Either flatten all validations into `lib/validations.ts` or put the main re-exports in an `index.ts` file.

---

### Summary of Organization Issues
✓ Good: Route grouping with (public) is appropriate
✓ Good: API routes organized by feature
✗ Bad: Calendar files create unnecessary complexity
✗ Bad: Auth utilities unclear split
✗ Bad: Validation imports are confusing
✗ Ugly: Loose component file

---

## 2. ARCHITECTURE PATTERNS

### Identified Patterns

#### 2.1 API Route Pattern
**Consistency: GOOD**

Most API routes follow a consistent pattern:
```typescript
export async function GET/POST(request: NextRequest) {
  try {
    // Validate input
    // Fetch/Process data
    // Return response
  } catch (error) {
    // Error handling
  }
}
```

**Examples:** `/api/admin/submissions`, `/api/blog/posts`, `/api/payment/details`

**Issue:** Error handling is somewhat repetitive but consistent.

---

#### 2.2 Service Layer Pattern
**Consistency: INCONSISTENT**

Some functionality is in `lib/` files (services):
- `lib/stripe.ts` - Payment service
- `lib/discord.ts` - Discord notification service
- `lib/google-calendar.ts` - Calendar service
- `lib/markdown.ts` - Markdown service

But other logic is embedded directly in API routes:
- Contact form validation in `/api/contact/route.ts`
- Blog filtering in `/api/blog/posts/route.ts`

**Recommendation:** Create a services pattern:
```
lib/
├── services/
│   ├── stripe.ts
│   ├── discord.ts
│   ├── calendar.ts
│   ├── blog.ts
│   └── submission.ts
```

---

#### 2.3 Component Pattern
**Consistency: GOOD**

Components are organized by feature:
- `/components/ui/` - Presentational components
- `/components/forms/` - Form-specific components
- `/components/admin/` - Admin dashboard components
- `/components/blog/` - Blog components
- `/components/booking/` - Booking components
- `/components/layout/` - Layout components

Barrel exports (index.ts) are properly used:
```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Card, CardHeader, ... } from './Card';
```

---

#### 2.4 Middleware Pattern
**Consistency: GOOD**

Admin route protection via `middleware.ts`:
```typescript
export default auth((req) => {
  if (isAdminRoute && !req.auth) {
    return NextResponse.redirect('/login');
  }
});
```

---

### Mixed/Problematic Patterns

#### 2.5 Inconsistent Error Handling
**SEVERITY: LOW**

Different API routes handle errors slightly differently:

```typescript
// API route 1: Detailed error response
if (error instanceof ZodError) {
  return NextResponse.json({
    success: false,
    error: 'Validation error',
    details: error.errors.map(...)
  }, { status: 400 });
}

// API route 2: Simple error response  
if (!sessionId) {
  return NextResponse.json(
    { error: 'session_id is required' },
    { status: 400 }
  );
}
```

**Recommendation:** Create a unified error response helper:
```typescript
// lib/api-errors.ts
export function validationError(details) { ... }
export function unauthorized() { ... }
export function notFound() { ... }
```

---

#### 2.6 Missing Infrastructure Pattern: Rate Limiting
**SEVERITY: HIGH**

Multiple TODO comments found:
- `/api/webhooks/google-calendar/route.ts` (line 72)
- `/api/replay/submit/route.ts` (line 43)
- `/api/contact/route.ts` (line 30)
- `/api/blog/posts/route.ts` (line 51)

Rate limiting exists in `lib/rate-limit.ts` but is only used in auth (`lib/auth.ts`).

**Problem:** Public API endpoints are unprotected from spam/abuse.

**Recommendation:**
```typescript
// Create middleware for rate limiting
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for');
  if (!rateLimiter.check(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  // ...
}
```

---

#### 2.7 Missing Infrastructure Pattern: Response Caching
**SEVERITY: MEDIUM**

Blog posts endpoint has manual cache headers:
```typescript
// /api/blog/posts/route.ts
return NextResponse.json({...}, {
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  }
});
```

But most other endpoints don't implement caching, leading to potential performance issues.

---

## 3. FRONTEND/BACKEND ORGANIZATION

### Frontend
**Organization: GOOD**

- Page routes are well-organized in `app/` with route groups
- Components are logically grouped by feature/domain
- Public and protected pages clearly separated

### Backend/API
**Organization: FAIR**

API routes are organized by feature:
```
/api/
  /admin/          # Admin CRUD operations
  /auth/           # Authentication
  /blog/           # Blog operations
  /booking/        # Booking operations
  /payment/        # Payment processing
  /contact/        # Contact form
  /replay/         # Replay submissions
  /webhooks/       # External webhooks
```

**Issues:**
1. No clear separation between public and admin API routes (both under /api/)
2. Webhook handlers don't validate webhook signatures consistently
3. Payment routes lack separation from order routes

**Recommendation:** Consider restructuring:
```
/api/
  /public/
    /blog/
    /payment/
    /booking/
    /contact/
  /admin/
    /submissions/
    /blog/
    /bookings/
    /availability/
  /webhooks/
```

---

## 4. COMPONENT STRUCTURE AND ORGANIZATION

### Component Organization: GOOD

```
components/
├── ui/                    # 18 files
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Dialog.tsx        # Radix UI dialog
│   ├── Alert.tsx         # Radix UI alert
│   ├── LoadingSpinner.tsx
│   └── ...
├── forms/                # 3 files
│   ├── FormField.tsx
│   ├── FormLabel.tsx
│   └── FormError.tsx
├── layout/               # 3 files
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
├── admin/                # 10 files (admin UI)
│   ├── AdminButton.tsx
│   ├── AdminCard.tsx
│   ├── SubmissionsTable.tsx
│   └── ...
├── blog/                 # 5 files
│   ├── BlogCard.tsx
│   ├── BlogContent.tsx
│   └── ...
└── booking/              # 1 file
    └── TimeSlotPicker.tsx
```

**Issues:**

1. **Inconsistent naming:** Some UI components are lowercase (`alert.tsx`, `dialog.tsx`), others are PascalCase (`Button.tsx`)

2. **Radix UI components mixed with custom:** `dialog.tsx` and `alert.tsx` are imported from Radix UI but located in `components/ui/` as if custom-built

3. **Admin components too granular:** 10 separate files for admin UI components might be over-organized

4. **Missing patterns:** No pattern for:
   - Page-level components
   - Feature containers
   - Layout variants

**Recommendation:**

```
components/
├── ui/
│   ├── primitives/      # Basic building blocks
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── radix-exports/   # Re-exports from radix-ui
│   │   ├── dialog.tsx
│   │   └── alert.tsx
│   ├── composite/       # Composed from primitives
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   └── index.ts
├── forms/
├── layout/
└── features/            # Feature-specific components
    ├── admin/
    ├── blog/
    └── booking/
```

---

## 5. API ROUTE ORGANIZATION

### Current Organization: GOOD

API routes follow Next.js conventions well:
- `[id]` for dynamic segments
- RESTful URL patterns
- Dynamic route imports for different HTTP methods

### Issues Found:

#### 5.1 Inconsistent Response Format
**SEVERITY: MEDIUM**

Some endpoints return `{success: boolean, data: ...}`:
```typescript
// /api/admin/submissions/route.ts
return NextResponse.json({
  success: true,
  count: transformedSubmissions.length,
  submissions: transformedSubmissions,
});
```

Others return direct data:
```typescript
// /api/blog/posts/route.ts
return NextResponse.json({
  posts: posts.map(...),
  pagination: {...}
});
```

**Recommendation:** Standardize on one format:
```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: PaginationInfo;
}
```

---

#### 5.2 Missing Input Validation in Some Routes
**SEVERITY: MEDIUM**

`/api/payment/details/route.ts` lacks Zod validation:
```typescript
const sessionId = searchParams.get('session_id');
if (!sessionId) {
  return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
}
```

Should use Zod for consistency:
```typescript
const querySchema = z.object({
  session_id: z.string().min(1),
});
const { session_id } = querySchema.parse({session_id: searchParams.get('session_id')});
```

---

#### 5.3 Missing Webhook Signature Verification
**SEVERITY: HIGH**

Both Stripe and Google Calendar webhooks should verify signatures:

```typescript
// /api/webhooks/stripe/route.ts
export async function POST(request: NextRequest) {
  const body = await request.text();
  // ❌ MISSING: Verify Stripe signature
  // Should use: stripe.webhooks.constructEvent(body, signature, secret)
  
  const event = JSON.parse(body);
  // ...
}
```

**Recommendation:** Implement signature verification for security.

---

#### 5.4 Authentication Pattern Inconsistency
**SEVERITY: MEDIUM**

Most admin endpoints use:
```typescript
await requireAuth(); // Throws error
```

But middleware also protects admin routes. This is defensive but creates redundancy.

**Recommendation:** Use middleware for broad protection, remove redundant checks in routes or document the pattern clearly.

---

## 6. DATABASE/DATA LAYER ORGANIZATION

### Schema Organization: EXCELLENT

The Prisma schema is well-designed:

```prisma
// Core models
model ReplaySubmission { ... }
model ReplayCode { ... }
model Payment { ... }
model Booking { ... }

// Supporting models
model AvailabilitySlot { ... }
model AvailabilityException { ... }
model BlogPost { ... }
model Admin { ... }

// Enums
enum SubmissionStatus { ... }
enum PaymentStatus { ... }
enum BookingStatus { ... }
```

**Strengths:**
- Clear relationships with proper foreign keys
- Appropriate use of cascading deletes
- Good field naming (snake_case in database, PascalCase in models)
- Enums for constrained values

**Issues:**

1. **Missing indexes:** No explicit indexes defined for frequently queried fields:
   - `ReplaySubmission.email` (searched frequently)
   - `BlogPost.slug` (unique but could use index)
   - `Booking.email` and `scheduledAt` (range queries)

2. **No soft deletes:** Hard deletion might be problematic for audit trails

3. **Missing audit fields:**
   - `createdBy` / `updatedBy` for admin changes
   - `deletedAt` for soft deletes

**Recommendations:**
```prisma
// Add indexes
model ReplaySubmission {
  @@index([email])
  @@index([status])
}

model Booking {
  @@index([email])
  @@index([scheduledAt])
}

// Add audit fields
model BlogPost {
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?
  updatedBy   String?
}
```

---

### Data Access Pattern: FAIR

Prisma is used directly in API routes (correct approach), but:

1. **No repository/service layer:** Complex queries are duplicated:
```typescript
// In /api/admin/submissions/route.ts
const submissions = await prisma.replaySubmission.findMany({...});

// Similar in other routes...
```

2. **No query builders:** Each API route builds its own WHERE clauses

**Recommendation:** Create a service layer:
```typescript
// lib/services/submission.ts
export async function getSubmissions(filters: SubmissionFilters) {
  return prisma.replaySubmission.findMany({
    where: buildWhereClause(filters),
    // ...
  });
}
```

---

## 7. ARCHITECTURAL RED FLAGS AND CONCERNS

### Critical Issues

1. **No Rate Limiting on Public Endpoints**
   - Replay submission endpoint not protected
   - Contact form not protected
   - Blog endpoints could be hammered
   - **Impact:** Spam, abuse, DoS vulnerability

2. **Webhook Signature Verification Missing**
   - Stripe webhooks not verified
   - Google Calendar webhooks not verified
   - **Impact:** Security vulnerability, unauthorized state changes

3. **No API Authentication for Public Routes**
   - Anyone can call `/api/replay/submit`
   - No API keys or authentication
   - **Impact:** Spam submissions

---

### Major Issues

4. **No Caching Strategy**
   - Blog posts could be cached (mostly static)
   - Availability slots could be cached
   - Currently relies on database queries
   - **Impact:** Unnecessary database load

5. **Unused Code**
   - `google-calendar-sync.ts` is not imported anywhere
   - Bloats codebase and causes confusion
   - **Impact:** Maintenance burden, confusion

6. **No Error Boundary Components**
   - No error.tsx files in most routes
   - Generic 500 errors don't help debugging
   - **Impact:** Poor user experience on errors

7. **Missing Environment Validation**
   - Environment variables checked ad-hoc
   - No centralized validation at startup
   - **Impact:** Cryptic errors at runtime

---

### Medium Issues

8. **Inconsistent API Response Format**
   - Some endpoints use `{success, data}`
   - Others use direct data structure
   - **Impact:** Client code complexity

9. **Admin UI Components Overly Granular**
   - 10 separate admin UI component files
   - Could be consolidated to 3-4 files
   - **Impact:** Navigation burden

10. **Database Query N+1 Issues**
    - Blog posts fetch without explicit selection
    - Submissions fetch all related replays
    - **Impact:** Potential performance issues

11. **Missing Input Sanitization**
    - Some routes trim/lowercase input
    - Others don't
    - Markdown content not sanitized for XSS
    - **Impact:** Inconsistent security posture

---

### Low Issues

12. **Inconsistent File Naming**
    - `alert.tsx` (lowercase) vs `Button.tsx` (PascalCase)
    - `DiscordConnect.tsx` not in component folder
    - **Impact:** Confusion for new developers

13. **Comments Could Be Better**
    - Some files have excellent documentation
    - Others have none
    - **Impact:** Onboarding difficulty

14. **No TypeScript Strict Mode Features Used**
    - `any` types in some places
    - Could use `satisfies` operator
    - **Impact:** Less type safety

---

## 8. CONFIGURATION FILES ORGANIZATION

### Excellent Configuration

✓ `tsconfig.json` - Strict mode enabled, paths configured
✓ `next.config.js` - Webpack fixes for dependencies, experimental flags
✓ `tailwind.config.ts` - Well-organized color palette, custom animations
✓ `postcss.config.js` - Present and minimal
✓ `.env.example` - Comprehensive environment variables documented

### Issues

1. **Environment Secrets Not Validated at Startup**
   - `stripe.ts` checks for keys but throws at module load time
   - Other services don't validate
   - **Better approach:** Centralized validation on app start

2. **No Feature Flags Configuration**
   - No way to toggle features without code changes
   - **Recommendation:** Add feature flags service

3. **No Logging Configuration**
   - Using `console.log/error` directly
   - No structured logging
   - **Recommendation:** Add Winston or Pino

---

## 9. BUILD AND DEPLOYMENT SETUP

### Current Setup: GOOD

✓ Docker support with `Dockerfile` and `docker-compose.yml`
✓ Scripts for setup: `scripts/docker-init.sh`, `scripts/create-admin.ts`
✓ Environment configuration via `.env`
✓ Build optimizations in `next.config.js`

### Issues

1. **No Health Check**
   - No `/health` endpoint for load balancers
   - **Recommendation:** Add health check endpoint

2. **No Build Verification**
   - No build verification scripts
   - **Recommendation:** Add pre-deploy checks

3. **Database Migration Strategy Unclear**
   - `prisma:migrate:dev` exists but production strategy unclear
   - **Recommendation:** Document migration strategy

4. **Static Export Not Possible**
   - Code correctly prevents static export (needs database)
   - But error message on failed static export could be better

---

## 10. SPECIFIC CODE QUALITY OBSERVATIONS

### Strengths

✓ Good TypeScript strict mode usage
✓ Excellent Zod validation schemas
✓ Proper error handling patterns in most places
✓ Good use of Next.js features (App Router, middleware)
✓ Clean component props interfaces
✓ Documented API endpoints
✓ Appropriate use of async/await
✓ Good separation of concerns at high level

### Weaknesses

✗ Unused imports in some files
✗ Magic strings instead of constants
✗ Duplicate error handling code
✗ No centralized error types
✗ Missing null checks in some places
✗ Large API route functions (100+ lines)
✗ No request/response logging middleware

---

## SUMMARY AND RECOMMENDATIONS

### Priority 1 (Critical) - Address Immediately

1. **Add Rate Limiting** to public endpoints
2. **Verify Webhook Signatures** for Stripe and Google Calendar
3. **Add API Authentication** or validate requests properly
4. **Remove Unused Code** (google-calendar-sync.ts)

### Priority 2 (High) - Address in Next Sprint

5. **Consolidate Calendar Files** (3 into 2)
6. **Split Auth Files** or clarify their purpose
7. **Standardize API Response Format**
8. **Implement Caching Strategy**
9. **Create Error Boundary Components**
10. **Add Health Check Endpoint**

### Priority 3 (Medium) - Refactor When Touching Code

11. **Create Service Layer** for complex database operations
12. **Reduce Admin Component Granularity**
13. **Create Error Response Helpers**
14. **Validate Environment Variables** at startup
15. **Add Request/Response Logging** middleware

### Priority 4 (Low) - Nice to Have

16. **Add Feature Flags** service
17. **Consolidate Form Components**
18. **Add Structured Logging** (Winston/Pino)
19. **Improve Code Comments** consistency
20. **Add Integration Tests**

---

## FINAL ASSESSMENT

**Architecture Score: 6.5/10**

### What's Working Well
- Core Next.js setup is solid
- Database schema is excellent
- Component organization is reasonable
- TypeScript usage is good
- Most API endpoints follow patterns

### What Needs Work
- Security vulnerabilities (rate limiting, webhook verification)
- Organizational inconsistencies (three calendar files, split auth files)
- Missing infrastructure (caching, logging, health checks)
- Unused code creating confusion
- Inconsistent API response formats

### Verdict
The project is **functional and reasonably well-organized** but has **security gaps and organizational issues** that should be addressed before scaling. The codebase would benefit from **consolidation** of similar concerns and **implementation of missing infrastructure patterns**.

Most concerns are fixable with focused refactoring efforts. The architecture is not fundamentally broken, just needs polish and security hardening.
