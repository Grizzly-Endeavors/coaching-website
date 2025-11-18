# Architecture Audit - Quick Summary

**Overall Score: 6.5/10** - Functional but needs security hardening and organizational improvements

---

## Top 5 Critical Issues (Fix These First)

### 1. Missing Rate Limiting on Public Endpoints
**Severity:** CRITICAL | **Risk:** Spam/DDoS
- `/api/replay/submit` - anyone can spam submissions
- `/api/contact` - contact form not protected
- `/api/blog/posts` - endpoints could be hammered
- **Fix Time:** 2-3 hours
- **Files:** `/api/replay/submit/route.ts`, `/api/contact/route.ts`

### 2. Webhook Signature Verification Missing
**Severity:** CRITICAL | **Risk:** Security vulnerability
- Stripe webhooks not verified (`/api/webhooks/stripe/route.ts`)
- Google Calendar webhooks not verified (`/api/webhooks/google-calendar/route.ts`)
- Anyone could send fake webhook events
- **Fix Time:** 1-2 hours

### 3. Unused Code: google-calendar-sync.ts
**Severity:** HIGH | **Risk:** Maintenance burden
- File is NOT imported or used anywhere (156 lines of dead code)
- Only imports from `calendar-sync.ts`, doesn't add value
- Creates confusion about what calendar files do
- **Fix:** Delete the file or consolidate into `calendar-sync.ts`
- **Time:** 15 minutes

### 4. Inconsistent API Response Formats
**Severity:** MEDIUM | **Risk:** Client complexity
- Some endpoints: `{success: true, data: {...}}`
- Others: `{posts: [...], pagination: {...}}`
- Makes client code harder to write
- **Fix:** Create standard ApiResponse interface
- **Time:** 2-3 hours

### 5. Missing Input Validation
**Severity:** MEDIUM | **Risk:** Security
- `/api/payment/details/route.ts` uses manual validation
- Should use Zod like other endpoints
- Inconsistent approach across codebase
- **Time:** 30 minutes per endpoint

---

## Top 5 Organizational Issues

### 1. Three Calendar Files (Confusing)
```
lib/google-calendar.ts        (711 lines) - Main API
lib/calendar-sync.ts           (451 lines) - Sync logic
lib/google-calendar-sync.ts    (156 lines) - UNUSED wrapper
```
**Recommendation:** Delete the wrapper or merge all 3 into 2 clear files

### 2. Auth Files Not Clearly Separated
```
lib/auth.ts           - NextAuth config + session
lib/auth-helpers.ts   - Password hashing, auth utilities
```
**Recommendation:** Either consolidate or create `lib/auth/` folder structure

### 3. Loose Component Not in Folder
```
components/DiscordConnect.tsx  ← Should be in components/auth/
```
**Recommendation:** Move to `components/auth/DiscordConnect.tsx`

### 4. Validation Imports Are Confusing
```
lib/validations.ts imports from lib/validations/booking.ts
```
**Recommendation:** Use `lib/validations/index.ts` for re-exports

### 5. Inconsistent Component File Naming
```
components/ui/Button.tsx        ← PascalCase
components/ui/dialog.tsx        ← lowercase (Radix import)
components/ui/alert.tsx         ← lowercase (Radix import)
```
**Recommendation:** Clarify naming - separate Radix exports from custom components

---

## Missing Infrastructure (No Quick Fix)

| Feature | Status | Impact |
|---------|--------|--------|
| Rate Limiting | TODO in 4+ files | Spam vulnerability |
| Webhook Verification | MISSING | Security risk |
| Response Caching | PARTIAL | Performance issue |
| Health Check Endpoint | MISSING | Deployment pain |
| Error Boundaries | MISSING | Poor UX on errors |
| Structured Logging | MISSING | Hard to debug |
| Feature Flags | MISSING | No feature toggles |
| Request Logging | MISSING | No audit trail |
| Database Indexes | MISSING | Potential slow queries |

---

## What's Actually Good

✓ Database schema is excellent (well-normalized, good relationships)
✓ TypeScript strict mode enabled
✓ Component organization by feature is solid
✓ API route pattern is mostly consistent
✓ Zod validation is well-implemented
✓ Middleware-based auth protection works
✓ Docker support exists
✓ Environment configuration is comprehensive

---

## Action Plan

### Phase 1: Security (Do First - 1-2 days)
1. Add rate limiting to public endpoints
2. Verify webhook signatures
3. Add input validation consistently

### Phase 2: Code Cleanup (1-2 days)
1. Remove `google-calendar-sync.ts`
2. Consolidate auth files
3. Standardize API response formats
4. Move loose components

### Phase 3: Infrastructure (3-5 days)
1. Add response caching
2. Create service layer
3. Add structured logging
4. Add health check endpoint
5. Create error boundary components

### Phase 4: Polish (Ongoing)
1. Add integration tests
2. Add feature flags
3. Improve documentation
4. Reduce admin component granularity

---

## Files to Review/Fix

**High Priority:**
- `/api/webhooks/stripe/route.ts` - Add signature verification
- `/api/webhooks/google-calendar/route.ts` - Add signature verification  
- `/api/replay/submit/route.ts` - Add rate limiting
- `/api/contact/route.ts` - Add rate limiting
- `/lib/google-calendar-sync.ts` - DELETE or consolidate

**Medium Priority:**
- `/lib/auth.ts` and `/lib/auth-helpers.ts` - Consolidate or restructure
- `/api/payment/details/route.ts` - Use Zod validation
- `/components/DiscordConnect.tsx` - Move to `/components/auth/`

**Low Priority:**
- `/lib/validations.ts` - Reorganize imports
- `/components/ui/` - Clarify Radix vs custom components

---

## Database Notes

**Good:** Schema is well-designed
**Missing:** 
- Indexes on frequently queried columns (email, scheduledAt, slug)
- Soft deletes (no deletedAt field)
- Audit fields (createdBy, updatedBy)

---

## Environment/Config Notes

**Good:** Comprehensive .env.example
**Missing:**
- Environment variable validation at startup
- Centralized config object
- Feature flag configuration

---

## Estimated Effort to Fix All Issues

| Priority | Effort | Days |
|----------|--------|------|
| P1 (Critical Security) | 4-5 hours | 0.5 |
| P2 (High - Code Cleanup) | 8-10 hours | 1 |
| P3 (Medium - Infrastructure) | 20-30 hours | 3-4 |
| P4 (Low - Polish) | 15-20 hours | 2-3 |
| **Total** | **50-65 hours** | **6-8 days** |

This assumes 1 developer working full-time on refactoring.

---

## Questions to Answer

1. Is this a production app? If yes, security issues need immediate attention.
2. How many users/submissions per month? If high, caching is critical.
3. Do you have load testing? Needed before declaring it ready to scale.
4. Is there a CI/CD pipeline? Should validate security issues.
5. Are there integration tests? Would help with refactoring confidence.

