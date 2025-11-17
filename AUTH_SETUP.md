# Authentication System Setup Guide

This guide explains how to set up and use the NextAuth authentication system for the Overwatch Coaching Website admin panel.

## Overview

The authentication system uses:
- **NextAuth.js v5** (Auth.js) for authentication
- **Credentials provider** for email/password authentication
- **JWT strategy** for session management
- **bcrypt** for password hashing (cost factor 10)
- **Zod** for form validation
- **Middleware** for route protection

## Security Features

✅ **Password Security**
- Passwords hashed with bcrypt (cost factor 10)
- Minimum 8 character requirement
- Secure password comparison

✅ **Session Security**
- JWT-based sessions
- HttpOnly cookies (prevents XSS attacks)
- Secure flag in production (HTTPS only)
- SameSite: 'lax' (CSRF protection)
- 30-day session duration

✅ **Route Protection**
- Middleware protects all `/admin/*` routes
- Automatic redirect to login for unauthenticated users
- Callback URL support for post-login redirection

✅ **Error Handling**
- Generic error messages (doesn't leak user existence)
- Form validation with helpful error messages
- Proper error logging for debugging

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

All required dependencies are already in package.json:
- `next-auth` (v5)
- `bcrypt`
- `zod`
- `@types/bcrypt`

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Generate a secure NextAuth secret:

```bash
openssl rand -base64 32
```

Update your `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/overwatch_coaching

# NextAuth
NEXTAUTH_URL=http://localhost:3000  # For development
NEXTAUTH_SECRET=your_generated_secret_here
```

For production, set `NEXTAUTH_URL` to your actual domain:
```env
NEXTAUTH_URL=https://yourdomain.com
```

### 3. Database Setup

Run Prisma migrations to create the Admin table:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (development)
npm run prisma:migrate:dev

# Or for production
npm run prisma:migrate
```

The Admin model includes:
- `id` (String, CUID)
- `email` (String, unique)
- `password` (String, hashed)
- `name` (String, optional)
- `createdAt` (DateTime)

### 4. Create First Admin User

Use the included script to create your first admin user:

```bash
npm run create-admin
```

The script will prompt you for:
- Email address
- Password (min 8 characters)
- Name (optional)

Alternatively, provide arguments directly:

```bash
npx tsx scripts/create-admin.ts admin@example.com mySecurePassword123 "Admin Name"
```

## Usage

### Admin Login

Navigate to `/admin/login` to access the login page.

Features:
- Email/password form with validation
- "Remember me" checkbox (extends session to 30 days)
- Loading states during authentication
- Error messages for invalid credentials
- Automatic redirect to `/admin` on success
- Callback URL support

### Protected Routes

All routes under `/admin/*` (except `/admin/login`) are automatically protected by middleware.

If a user tries to access a protected route without authentication:
1. They are redirected to `/admin/login`
2. The original URL is preserved as `callbackUrl` parameter
3. After successful login, they are redirected back to the original page

### In Server Components

Use the `requireAuthPage()` helper to protect server components:

```typescript
// app/admin/dashboard/page.tsx
import { requireAuthPage } from '@/lib/auth-helpers';

export default async function AdminDashboard() {
  const session = await requireAuthPage(); // Redirects if not authenticated

  return (
    <div>
      <h1>Welcome, {session.user.email}!</h1>
    </div>
  );
}
```

### In API Routes

Use the `requireAuth()` helper to protect API endpoints:

```typescript
// app/api/admin/submissions/route.ts
import { requireAuth } from '@/lib/auth-helpers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const session = await requireAuth(); // Throws error if not authenticated

    // Your protected logic here
    return NextResponse.json({ data: 'protected data' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
```

### Client-Side Authentication

Use NextAuth's `signIn` and `signOut` functions:

```typescript
'use client';

import { signIn, signOut } from 'next-auth/react';

// Sign in
await signIn('credentials', {
  email: 'admin@example.com',
  password: 'password123',
  redirect: false,
});

// Sign out
await signOut({ callbackUrl: '/admin/login' });
```

## File Structure

```
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── auth-helpers.ts      # Helper functions (hashPassword, requireAuth, etc.)
│   └── prisma.ts            # Prisma client singleton
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts # NextAuth API route handler
│   └── admin/
│       └── login/
│           └── page.tsx     # Login page with form
├── middleware.ts            # Route protection middleware
└── scripts/
    └── create-admin.ts      # Admin user creation script
```

## API Reference

### Authentication Helpers (`lib/auth-helpers.ts`)

#### `hashPassword(password: string): Promise<string>`
Hash a password using bcrypt with cost factor 10.

```typescript
const hashedPassword = await hashPassword('myPassword123');
```

#### `verifyPassword(password: string, hashedPassword: string): Promise<boolean>`
Verify a password against a hashed password.

```typescript
const isValid = await verifyPassword('myPassword123', hashedPassword);
```

#### `getServerSession()`
Get the current server-side session.

```typescript
const session = await getServerSession();
if (session) {
  console.log(session.user.email);
}
```

#### `requireAuth()`
Require authentication for API routes. Throws error if not authenticated.

```typescript
const session = await requireAuth(); // Throws if not authenticated
```

#### `requireAuthPage()`
Require authentication for server pages. Redirects to login if not authenticated.

```typescript
const session = await requireAuthPage(); // Redirects if not authenticated
```

#### `isAuthenticated(): Promise<boolean>`
Check if user is authenticated.

```typescript
const authenticated = await isAuthenticated();
```

#### `getCurrentUserId(): Promise<string | null>`
Get current user's ID.

```typescript
const userId = await getCurrentUserId();
```

#### `getCurrentUserEmail(): Promise<string | null>`
Get current user's email.

```typescript
const email = await getCurrentUserEmail();
```

#### `generateSecurePassword(length?: number): string`
Generate a secure random password. Useful for initial admin creation or password reset.

```typescript
const password = generateSecurePassword(); // Default: 16 characters
const longPassword = generateSecurePassword(24); // Custom length

console.log(password); // "aB3$xY9@mN5!qW2#"
```

Features:
- Includes lowercase, uppercase, numbers, and symbols
- Ensures at least one character from each category
- Randomized character order
- Default length: 16 characters

## Testing

### Test Login Flow

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/admin`
   - Should redirect to `/admin/login`

3. Try logging in with invalid credentials
   - Should show error: "Invalid email or password"

4. Log in with valid credentials
   - Should redirect to `/admin`

5. Try accessing `/admin/login` while logged in
   - Should redirect to `/admin`

### Test Rate Limiting (Future Enhancement)

Currently, rate limiting is not implemented but can be added using:
- `next-rate-limit` package
- Middleware-based rate limiting
- Database-based attempt tracking

## Troubleshooting

### "NEXTAUTH_SECRET is not set"
Make sure your `.env` file contains `NEXTAUTH_SECRET`.

```bash
# Generate a new secret
openssl rand -base64 32

# Add to .env
NEXTAUTH_SECRET=your_generated_secret
```

### "Database connection error"
Ensure PostgreSQL is running and `DATABASE_URL` is correct.

```bash
# Check database connection
npm run prisma:studio
```

### "Cannot find module 'next-auth'"
Install dependencies:

```bash
npm install
```

### "Session is null after login"
1. Check that `NEXTAUTH_URL` matches your current domain
2. Clear browser cookies
3. Restart the development server

### "Password hash comparison fails"
Ensure you're using the `hashPassword` function from `lib/auth-helpers.ts` with bcrypt cost factor 10.

## Security Checklist

- ✅ NEXTAUTH_SECRET is set to a random 32-byte string
- ✅ DATABASE_URL does not expose credentials in logs
- ✅ HTTPS is enabled in production (Cloudflare Tunnel)
- ✅ HttpOnly cookies are enabled
- ✅ SameSite cookies are set to 'lax'
- ✅ Passwords are hashed with bcrypt (cost 10)
- ✅ Error messages don't leak user existence
- ✅ All admin routes are protected by middleware
- ✅ Form inputs are validated with Zod
- ⚠️ Rate limiting should be implemented (future enhancement)
- ⚠️ Password reset functionality (future enhancement)
- ⚠️ 2FA support (future enhancement)

## Future Enhancements

Consider adding:

1. **Rate Limiting**
   - Limit login attempts per IP/email
   - Use `next-rate-limit` or Redis

2. **Password Reset**
   - Email-based password reset flow
   - Secure token generation
   - Token expiration

3. **Two-Factor Authentication**
   - TOTP-based 2FA
   - Backup codes
   - Email/SMS verification

4. **Session Management**
   - View active sessions
   - Revoke sessions
   - Force logout

5. **Audit Logging**
   - Log all authentication attempts
   - Track admin actions
   - IP address logging

6. **Account Security**
   - Password strength meter
   - Password history
   - Account lockout after failed attempts

## Support

For issues or questions:
- Check the [NextAuth.js documentation](https://next-auth.js.org)
- Review the [Prisma documentation](https://www.prisma.io/docs)
- See the PROJECT_SPEC.md file for overall project architecture
