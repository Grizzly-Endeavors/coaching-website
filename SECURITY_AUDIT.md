# Pre-Launch Security Audit Report

**Date:** November 22, 2025
**Project:** Overwatch Coaching Website
**Status:** Passed with Moderate Issues

## Executive Summary
The application has a strong security foundation with robust authentication and authorization mechanisms. Critical user-facing endpoints (contact, replay submission) are protected with rate limiting and input validation. However, a few vulnerabilities and missing protections were identified, particularly regarding XSS in the admin panel and lack of rate limiting on some public endpoints.

## Key Findings

### 1. Authentication & Authorization (Strong)
*   **Mechanism:** NextAuth.js is correctly configured with secure session handling.
*   **Protection:** Middleware effectively guards all `/admin` and `/api/admin` routes.
*   **Implementation:** API routes consistently use `auth()` or `requireAuth` helpers to verify permissions.

### 2. Input Validation (Strong)
*   **Schema Validation:** Zod is used extensively to validate request bodies across API routes.
*   **Sanitization:** The contact form endpoint (`/api/contact`) explicitly sanitizes inputs.
*   **Logic Validation:** The replay submission endpoint (`/api/replay/submit`) enforces business logic (e.g., requiring scheduled times for live sessions).

### 3. API Security (Moderate)
*   **Protected:**
    *   `/api/contact`: Rate limited (5 req/hour).
    *   `/api/replay/submit`: Rate limited (10 req/hour).
    *   `/api/webhooks/stripe`: Verifies Stripe signatures, preventing spoofed events.
*   **Unprotected (Risks):**
    *   `/api/booking/available-slots`: No rate limiting found. Vulnerable to scraping or DoS.
    *   `/api/checkout`: No rate limiting found. Vulnerable to abuse (creating junk DB records and spamming Stripe).

### 4. Vulnerabilities Identified

#### **High Priority: Stored XSS in Admin Panel**
*   **Location:** `components/admin/BlogPostForm.tsx`
*   **Issue:** The `renderMarkdownPreview` function manually parses markdown and injects it using `dangerouslySetInnerHTML` without sanitization.
*   **Risk:** If an attacker compromises an admin account (or if a lower-privilege user could access this form), they could execute arbitrary JavaScript in the browser of anyone viewing the preview.
*   **Snippet:**
    ```typescript
    // Vulnerable code
    if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`; // line content is injected directly
    ```

### 5. Secrets Management (Strong)
*   Secrets are properly loaded from environment variables and are not hardcoded in the source code.

## Recommendations

### Immediate Actions
1.  **Fix XSS in Admin Panel:**
    *   Replace the manual markdown parsing in `BlogPostForm.tsx` with a secure library like `react-markdown` or `marked` combined with `dompurify`.
    *   *Alternative:* Sanitize the input before rendering if keeping the manual parser is desired (not recommended).

2.  **Apply Rate Limiting:**
    *   Add `rateLimit()` checks to `app/api/booking/available-slots/route.ts`.
    *   Add `rateLimit()` checks to `app/api/checkout/route.ts`.

### Secondary Actions
1.  **Security Headers:** Configure HTTP security headers (CSP, HSTS, X-Content-Type-Options) in `next.config.js` or `middleware.ts`.
2.  **Dependency Audit:** Run `npm audit` to identify and update any vulnerable dependencies.

## Conclusion
The application is largely secure for launch, provided the XSS vulnerability is patched and rate limiting is expanded to cover the checkout and availability endpoints.
