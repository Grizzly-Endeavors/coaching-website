# Admin API Routes Summary

All admin API routes for the Overwatch coaching website have been successfully implemented.

## Overview

All routes require authentication using NextAuth session. Unauthorized requests return 401 status code.

## Created Routes

### 1. Submissions Management

#### GET /api/admin/submissions
**File:** `/home/user/coaching-website/app/api/admin/submissions/route.ts`

Fetch all replay submissions with optional filters.

**Query Parameters:**
- `status` - Filter by submission status (PENDING, IN_PROGRESS, COMPLETED, ARCHIVED)
- `sort` - Sort field (submittedAt, reviewedAt, status) - default: submittedAt
- `order` - Sort order (asc, desc) - default: desc

**Response:**
```json
{
  "success": true,
  "count": 10,
  "submissions": [...]
}
```

#### GET /api/admin/submissions/[id]
**File:** `/home/user/coaching-website/app/api/admin/submissions/[id]/route.ts`

Fetch a single replay submission by ID.

**Response:**
```json
{
  "success": true,
  "submission": {...}
}
```

#### PATCH /api/admin/submissions/[id]
**File:** `/home/user/coaching-website/app/api/admin/submissions/[id]/route.ts`

Update a replay submission.

**Request Body:**
```json
{
  "status": "COMPLETED",
  "reviewNotes": "Great positioning improvement...",
  "reviewUrl": "https://youtube.com/...",
  "sendEmail": true
}
```

**Features:**
- Updates submission status, review notes, and review URL
- Automatically sets `reviewedAt` timestamp when status changes to COMPLETED
- If `sendEmail: true` and status is COMPLETED, sends review ready email to user
- All fields are optional

**Response:**
```json
{
  "success": true,
  "submission": {...},
  "emailSent": true
}
```

#### DELETE /api/admin/submissions/[id]
**File:** `/home/user/coaching-website/app/api/admin/submissions/[id]/route.ts`

Archive a replay submission (soft delete).

**Note:** This route archives the submission by setting status to ARCHIVED rather than hard deleting. To implement hard delete, change to `prisma.replaySubmission.delete()`.

**Response:**
```json
{
  "success": true,
  "message": "Submission archived successfully"
}
```

---

### 2. Blog Management

#### GET /api/admin/blog
**File:** `/home/user/coaching-website/app/api/admin/blog/route.ts`

Fetch all blog posts (including drafts) with pagination.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Posts per page (default: 20, max: 100)
- `published` - Filter by published status ('true', 'false', 'all') - default: 'all'
- `sort` - Sort field (createdAt, updatedAt, publishedAt, title) - default: createdAt
- `order` - Sort order (asc, desc) - default: desc

**Response:**
```json
{
  "success": true,
  "posts": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### POST /api/admin/blog/upload
**File:** `/home/user/coaching-website/app/api/admin/blog/upload/route.ts`

Upload a markdown file and create a blog post.

**Request:** multipart/form-data with .md file

**Frontmatter Requirements:**
```yaml
---
title: "Post Title" # Required
slug: "post-slug" # Required, lowercase alphanumeric with hyphens
excerpt: "Post excerpt" # Optional
tags: ["tag1", "tag2"] # Optional
published: false # Optional, default: false
publishedAt: "2024-11-17T10:00:00Z" # Optional
---

# Markdown content here...
```

**Process:**
1. Parses frontmatter with gray-matter
2. Validates required fields (title, slug)
3. Checks slug uniqueness
4. Auto-generates excerpt if not provided (first 200 chars)
5. Creates BlogPost in database
6. Returns 201 with post ID

**Response (201):**
```json
{
  "success": true,
  "message": "Blog post created successfully",
  "post": {...}
}
```

**Error Responses:**
- 400: Invalid file format or missing required fields
- 409: Slug already exists

#### GET /api/admin/blog/[id]
**File:** `/home/user/coaching-website/app/api/admin/blog/[id]/route.ts`

Fetch a single blog post by ID for editing.

**Response:**
```json
{
  "success": true,
  "post": {...}
}
```

#### PATCH /api/admin/blog/[id]
**File:** `/home/user/coaching-website/app/api/admin/blog/[id]/route.ts`

Update a blog post.

**Request Body:**
```json
{
  "title": "Updated Title",
  "slug": "updated-slug",
  "content": "# Updated content...",
  "excerpt": "Updated excerpt",
  "tags": ["tag1", "tag2"],
  "published": true
}
```

**Features:**
- All fields are optional
- Validates slug uniqueness if changed
- Automatically sets `publishedAt` when publishing for the first time
- Clears `publishedAt` when unpublishing

**Response:**
```json
{
  "success": true,
  "post": {...}
}
```

**Error Responses:**
- 409: Slug already exists (when changing slug)

#### DELETE /api/admin/blog/[id]
**File:** `/home/user/coaching-website/app/api/admin/blog/[id]/route.ts`

Delete a blog post (hard delete).

**Response:**
```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

---

### 3. Bookings Management

#### GET /api/admin/bookings
**File:** `/home/user/coaching-website/app/api/admin/bookings/route.ts`

Fetch all bookings from database with optional filters.

**Query Parameters:**
- `status` - Filter by booking status (SCHEDULED, COMPLETED, CANCELLED, NO_SHOW)
- `sort` - Sort field (scheduledAt, createdAt, updatedAt) - default: scheduledAt
- `order` - Sort order (asc, desc) - default: asc
- `upcoming` - Filter for upcoming bookings only ('true', 'false')

**Response:**
```json
{
  "success": true,
  "count": 5,
  "bookings": [
    {
      "id": "...",
      "email": "...",
      "sessionType": "1-on-1 Coaching",
      "scheduledAt": "2024-11-20T10:00:00Z",
      "status": "SCHEDULED",
      "isPast": false,
      "isUpcoming": true,
      ...
    }
  ]
}
```

**Note:** Response includes computed fields `isPast` and `isUpcoming` for better UX.

#### GET /api/admin/bookings/[id]
**File:** `/home/user/coaching-website/app/api/admin/bookings/[id]/route.ts`

Fetch a single booking by ID.

**Response:**
```json
{
  "success": true,
  "booking": {...}
}
```

#### PATCH /api/admin/bookings/[id]
**File:** `/home/user/coaching-website/app/api/admin/bookings/[id]/route.ts`

Update a booking's status.

**Request Body:**
```json
{
  "status": "COMPLETED",
  "notes": "Session went well"
}
```

**Fields:**
- `status` - BookingStatus (required): SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
- `notes` - string (optional): Additional notes about the booking

**Response:**
```json
{
  "success": true,
  "booking": {...}
}
```

---

## Common Features Across All Routes

### Authentication
All routes use the `requireAuth()` helper function from `/home/user/coaching-website/lib/auth.ts`:
- Verifies NextAuth session
- Returns 401 if not authenticated
- Throws error that's caught by route handlers

### Input Validation
All routes use Zod schemas for:
- Query parameter validation
- Request body validation
- Type safety with TypeScript

### Error Handling
Comprehensive error handling for:
- **401 Unauthorized**: Missing or invalid authentication
- **400 Bad Request**: Invalid input data or validation errors
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate slug or other conflicts
- **500 Internal Server Error**: Unexpected errors

### Response Format
All successful responses follow this pattern:
```json
{
  "success": true,
  ...data
}
```

All error responses follow this pattern:
```json
{
  "success": false,
  "error": "Error message",
  "details": [...] // Optional, for validation errors
}
```

### TypeScript Types
All routes use proper TypeScript types from:
- `@prisma/client` for database models and enums
- Zod schemas for validation
- Next.js types for requests and responses

---

## Supporting Files Created

### Authentication Utility
**File:** `/home/user/coaching-website/lib/auth.ts`

NextAuth v5 configuration with:
- Credentials provider for email/password login
- Bcrypt password verification
- JWT session strategy
- Helper functions: `getAuthSession()`, `requireAuth()`
- Custom session types with admin user data

### Prisma Client
**File:** `/home/user/coaching-website/lib/prisma.ts`

Singleton Prisma client instance with:
- Development logging enabled
- Global instance to prevent connection exhaustion
- Proper TypeScript types

### Email Utilities
**File:** `/home/user/coaching-website/lib/email.ts`

Email sending functions using Resend:
- `sendSubmissionConfirmation()` - User confirmation after submission
- `sendReviewReady()` - Notify user when review is complete
- Email logging to database
- Error handling and retry logic

---

## Project Structure

```
app/api/admin/
├── submissions/
│   ├── route.ts           # GET: List all submissions
│   └── [id]/
│       └── route.ts       # GET, PATCH, DELETE: Individual submission
├── blog/
│   ├── route.ts           # GET: List all posts
│   ├── upload/
│   │   └── route.ts       # POST: Upload markdown file
│   └── [id]/
│       └── route.ts       # GET, PATCH, DELETE: Individual post
└── bookings/
    ├── route.ts           # GET: List all bookings
    └── [id]/
        └── route.ts       # GET, PATCH: Individual booking
```

---

## Security Features

1. **Authentication Required**: All routes verify NextAuth session
2. **Input Validation**: Zod schemas validate all inputs
3. **SQL Injection Prevention**: Prisma ORM with parameterized queries
4. **Type Safety**: Full TypeScript coverage
5. **Error Handling**: Proper error messages without exposing internals
6. **Slug Validation**: Regex validation for URL-safe slugs
7. **Email Validation**: URL and email format validation
8. **Rate Limiting**: (Recommended to add at reverse proxy level)

---

## Next Steps

### Before Running the Application:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up Database:**
   - Create PostgreSQL database
   - Copy `.env.example` to `.env` and configure DATABASE_URL
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev
     ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Create Admin User:**
   You'll need to create an admin user in the database with a hashed password:
   ```bash
   # Run Prisma Studio
   npx prisma studio
   # Or create via script/seed file
   ```

5. **Configure Environment Variables:**
   - NEXTAUTH_SECRET (generate with: `openssl rand -base64 32`)
   - RESEND_API_KEY
   - DATABASE_URL
   - Other API keys as needed

6. **Create NextAuth API Route:**
   Create `app/api/auth/[...nextauth]/route.ts`:
   ```typescript
   import { handlers } from '@/lib/auth';
   export const { GET, POST } = handlers;
   ```

7. **Test the API:**
   ```bash
   npm run dev
   # Navigate to http://localhost:3000
   ```

---

## Testing the API Routes

Use tools like:
- **Postman** or **Insomnia** for API testing
- **curl** for command-line testing
- **Next.js API route testing** with Jest

Example curl command:
```bash
# Login first to get session cookie
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Then use the session cookie for admin routes
curl -X GET http://localhost:3000/api/admin/submissions \
  -H "Cookie: next-auth.session-token=..."
```

---

## Maintenance Notes

- **Soft Delete**: Submissions use soft delete (ARCHIVED status). Can be changed to hard delete if needed.
- **Hard Delete**: Blog posts use hard delete. Can be changed to soft delete if needed.
- **Email Logging**: All emails are logged to the database for tracking.
- **Timestamps**: All models have automatic timestamps (createdAt, updatedAt).
- **Pagination**: Blog posts endpoint supports pagination (max 100 per page).

---

Generated: 2024-11-17
