# Overwatch Coaching Website - Project Specification

## Project Overview
A custom website for Overwatch coaching services that handles:
1. Marketing/landing pages to attract clients
2. Blog for content marketing and SEO
3. Replay code submission system
4. ~~Google Calendar appointment scheduling integration~~ (DEPRECATED - using custom booking system)
5. Admin panel for managing submissions and blog posts

**Target**: MVP focusing on core functionality, professional dark purple aesthetic

**Note**: Email notifications via Resend and Google Calendar integration have been deprecated in favor of Discord bot notifications.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (optional, for rapid development)
- **Markdown**: 
  - `gray-matter` for frontmatter parsing
  - `react-markdown` or `marked` for rendering
  - `rehype-highlight` for code syntax highlighting in blog

### Backend
- **API**: Next.js API Routes (App Router route handlers)
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Authentication**: NextAuth.js (v5/Auth.js)
- **Notifications**: Discord bot integration (email system deprecated)
- **File Upload**: Built-in Next.js handling for .md files

### DevOps
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: System-level tunnel and reverse proxy
- **Database**: PostgreSQL container with persistent volume
- **Environment**: Node 20 LTS

---

## Design System

### Color Palette
```css
/* Backgrounds */
--bg-primary: #0f0f23;      /* Main background */
--bg-surface: #1a1a2e;       /* Cards, sections */
--bg-elevated: #2a2a40;      /* Elevated elements */

/* Purple Accents */
--purple-primary: #8b5cf6;   /* Primary CTA, links */
--purple-hover: #a78bfa;     /* Hover states */
--purple-glow: rgba(139, 92, 246, 0.3); /* Glow effects */

/* Text */
--text-primary: #e5e7eb;     /* Main text */
--text-secondary: #9ca3af;   /* Descriptions */
--text-muted: #6b7280;       /* Metadata, timestamps */

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;

/* Borders */
--border-color: #2a2a40;
```

### Typography
- **Font Family**: Inter (headings and body)
- **Headings**: Font weight 700, tracking tight
- **Body**: Font weight 400, line height relaxed
- **Code**: JetBrains Mono for replay codes

### Design Principles
- Dark theme with purple accents
- Subtle animations (hover effects, transitions)
- High contrast for readability
- Rounded corners (8-12px)
- Purple glow effects on interactive elements
- Mobile-first responsive design

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Replay code submissions
model ReplaySubmission {
  id          String   @id @default(cuid())
  email       String
  discordTag  String?  @map("discord_tag")
  replayCode  String   @map("replay_code")
  rank        String   // e.g., "Gold 3", "Diamond 1"
  role        String   // Tank, DPS, Support
  hero        String?  // Specific hero played
  notes       String?  @db.Text
  status      SubmissionStatus @default(PENDING)
  reviewNotes String?  @map("review_notes") @db.Text
  reviewUrl   String?  @map("review_url") // Link to review video
  submittedAt DateTime @default(now()) @map("submitted_at")
  reviewedAt  DateTime? @map("reviewed_at")

  @@map("replay_submissions")
}

enum SubmissionStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  ARCHIVED
}

// Calendar bookings managed by custom booking system
model Booking {
  id            String   @id @default(cuid())
  email         String
  googleEventId String   @unique @map("google_event_id") // Legacy field, kept for backward compatibility
  sessionType   String   @map("session_type") // e.g., "1-on-1 Coaching", "VOD Review"
  scheduledAt   DateTime @map("scheduled_at")
  status        BookingStatus @default(SCHEDULED)
  notes         String?  @db.Text
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@map("bookings")
}

enum BookingStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  NO_SHOW
}

// Blog posts
model BlogPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.Text // Markdown content
  excerpt     String?
  tags        String[] // Array of tags
  published   Boolean  @default(false)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  publishedAt DateTime? @map("published_at")

  @@map("blog_posts")
}

// Admin users
model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed with bcrypt
  name      String?
  createdAt DateTime @default(now()) @map("created_at")
  
  @@map("admins")
}

// DEPRECATED: Email notification log (email system no longer used - Discord notifications used instead)
// model EmailLog {
//   id        String   @id @default(cuid())
//   to        String
//   subject   String
//   type      EmailType
//   status    EmailStatus
//   sentAt    DateTime @default(now()) @map("sent_at")
//   error     String?
//
//   @@map("email_logs")
// }
//
// enum EmailType {
//   SUBMISSION_RECEIVED
//   REVIEW_READY
//   BOOKING_CONFIRMED
//   BOOKING_REMINDER
// }
//
// enum EmailStatus {
//   SENT
//   FAILED
//   PENDING
// }
```

---

## Site Structure

### Public Pages

#### 1. Homepage (`/`)
**Purpose**: Landing page to convert visitors into clients

**Sections**:
- Hero section with headline, subheadline, CTA button
- Services overview (3-4 cards)
- Social proof (testimonials or rank achievements)
- About section (brief intro)
- Recent blog posts (3 latest)
- Final CTA section

**Key Elements**:
- Prominent "Book a Session" button (purple, glowing)
- "Submit Replay Code" secondary CTA
- Navigation to all main pages

#### 2. Services Page (`/services`)
**Purpose**: Detail coaching offerings and pricing

**Content**:
- Service tiers/packages (cards with pricing)
- What's included in each tier
- Role-specific coaching options (Tank/DPS/Support)
- Process explanation (how coaching works)
- FAQ section
- CTA to booking page

#### 3. About Page (`/about`)
**Purpose**: Build credibility and trust

**Content**:
- Your coaching background and credentials
- Rank history/achievements
- Coaching philosophy
- Why choose your coaching
- Personal photo or Overwatch profile screenshot
- CTA to contact or booking

#### 4. Blog Listing (`/blog`)
**Purpose**: Content marketing and SEO

**Features**:
- Grid of blog post cards
- Each card shows: title, excerpt, date, tags
- Filter by tags (optional for MVP)
- Pagination (if >12 posts)
- Search functionality (optional for MVP)

#### 5. Blog Post (`/blog/[slug]`)
**Purpose**: Individual blog post display

**Features**:
- Markdown rendering with syntax highlighting
- Author info (your name/profile)
- Published date
- Tags
- "Back to Blog" navigation
- Related posts section (optional)
- Social share buttons (optional)

#### 6. Booking Page (`/booking`)
**Purpose**: Schedule sessions and submit replay codes

**Two Sections**:
1. **Live Coaching Booking**
   - ~~Google Calendar appointment scheduler embed~~ (DEPRECATED - using custom booking system)
   - Session type selection
   - Clear pricing display

2. **Replay Code Submission**
   - Form with fields:
     - Email (required)
     - Discord tag (optional)
     - Replay code (required, validated format)
     - Rank (dropdown: Bronze-GM)
     - Role (dropdown: Tank/DPS/Support)
     - Hero played (text input)
     - Additional notes (textarea)
   - Submit button
   - Expected turnaround time notice

#### 7. Contact Page (`/contact`)
**Purpose**: General inquiries

**Content**:
- Simple contact form (name, email, message)
- Alternative contact methods (Discord, email)
- Response time expectations

### Admin Pages

#### 1. Admin Login (`/admin/login`)
**Features**:
- Email/password login form
- Session-based authentication
- "Remember me" option
- Password reset link (optional for MVP)

#### 2. Admin Dashboard (`/admin`)
**Purpose**: Overview of pending work

**Sections**:
- Pending replay submissions count
- Recent bookings
- Quick stats (total submissions, completed reviews)
- Quick links to main admin pages

#### 3. Submissions Manager (`/admin/submissions`)
**Purpose**: Manage replay code submissions

**Features**:
- Table view of all submissions
- Columns: Date, Email, Rank, Role, Hero, Status, Actions
- Filter by status (Pending, In Progress, Completed)
- Sort by date
- Actions per submission:
  - View details (modal or detail page)
  - Mark in progress
  - Add review notes and URL
  - Mark completed
  - Delete/Archive

**Detail View**:
- All submission info
- Form to add review notes and video URL
- Status update dropdown
- Discord notification checkbox (send when completed)

#### 4. Blog Manager (`/admin/blog`)
**Purpose**: Manage blog posts

**Features**:
- List of all posts (published and drafts)
- Columns: Title, Status, Published Date, Actions
- Actions:
  - Create new post
  - Edit post
  - Delete post
  - Toggle published status

**Create/Edit Post Page** (`/admin/blog/new`, `/admin/blog/edit/[id]`):
- Upload .md file button
- Preview rendered markdown
- Edit form:
  - Title (pre-filled from frontmatter)
  - Slug (auto-generated, editable)
  - Excerpt (pre-filled or manual)
  - Tags (multi-select or comma-separated)
  - Content (textarea with markdown preview)
  - Published checkbox
- Save draft / Publish button

#### 5. Schedule Overview (`/admin/schedule`)
**Purpose**: View upcoming bookings

**Features**:
- Table of upcoming bookings
- Columns: Date/Time, Email, Session Type, Status
- Filter by status
- Mark as completed/no-show

---

## API Routes

### Public API Routes

#### `POST /api/replay/submit`
**Purpose**: Submit a replay code for review

**Request Body**:
```json
{
  "email": "player@example.com",
  "discordTag": "PlayerName#1234",
  "replayCode": "ABC123",
  "rank": "Diamond 2",
  "role": "Support",
  "hero": "Ana",
  "notes": "I struggle with positioning in teamfights"
}
```

**Response**: 201 Created
```json
{
  "success": true,
  "submissionId": "clxxx..."
}
```

**Side Effects**:
- Save to database
- Send Discord notification to admin

#### `GET /api/blog/posts`
**Purpose**: Get published blog posts (paginated)

**Query Params**:
- `page` (default: 1)
- `limit` (default: 12)
- `tag` (optional filter)

**Response**: 200 OK
```json
{
  "posts": [
    {
      "id": "...",
      "title": "...",
      "slug": "...",
      "excerpt": "...",
      "tags": ["support", "guides"],
      "publishedAt": "2024-11-17T..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4
  }
}
```

#### `GET /api/blog/[slug]`
**Purpose**: Get a single blog post by slug

**Response**: 200 OK
```json
{
  "id": "...",
  "title": "...",
  "slug": "...",
  "content": "# Markdown content...",
  "excerpt": "...",
  "tags": ["..."],
  "publishedAt": "..."
}
```

#### `POST /api/contact`
**Purpose**: Submit contact form

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'm interested in coaching..."
}
```

**Response**: 200 OK
**Side Effects**: Send Discord notification to admin

#### `POST /api/webhooks/google-calendar` (DEPRECATED)
**Purpose**: ~~Receive Google Calendar notifications~~ (No longer used)

**Note**: This endpoint has been deprecated. The project now uses a custom booking system instead of Google Calendar integration.

### Admin API Routes (Protected)

All admin routes require authentication via NextAuth session.

#### `GET /api/admin/submissions`
**Purpose**: Get all replay submissions (with filters)

**Query Params**:
- `status` (optional: PENDING, IN_PROGRESS, COMPLETED)
- `sort` (default: submittedAt desc)

#### `GET /api/admin/submissions/[id]`
**Purpose**: Get single submission details

#### `PATCH /api/admin/submissions/[id]`
**Purpose**: Update submission

**Request Body**:
```json
{
  "status": "COMPLETED",
  "reviewNotes": "Great positioning improvement...",
  "reviewUrl": "https://youtube.com/...",
  "sendNotification": true
}
```

**Side Effects**: If `sendNotification: true`, send Discord notification to user

#### `DELETE /api/admin/submissions/[id]`
**Purpose**: Delete/archive submission

#### `POST /api/admin/blog/upload`
**Purpose**: Upload markdown file and create blog post

**Request**: multipart/form-data with .md file

**Process**:
1. Parse frontmatter with gray-matter
2. Validate required fields (title, slug)
3. Check slug uniqueness
4. Save to database
5. Return post ID

**Response**: 201 Created

#### `GET /api/admin/blog/posts`
**Purpose**: Get all blog posts (including drafts)

#### `GET /api/admin/blog/[id]`
**Purpose**: Get single post for editing

#### `PATCH /api/admin/blog/[id]`
**Purpose**: Update blog post

**Request Body**:
```json
{
  "title": "...",
  "slug": "...",
  "content": "...",
  "excerpt": "...",
  "tags": ["..."],
  "published": true
}
```

#### `DELETE /api/admin/blog/[id]`
**Purpose**: Delete blog post

#### `GET /api/admin/bookings`
**Purpose**: Get all bookings from database

#### `PATCH /api/admin/bookings/[id]`
**Purpose**: Update booking status

---

## Docker Compose Setup

### File: `docker-compose.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: overwatch-coaching-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - coaching-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Next.js Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: overwatch-coaching-app
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - DISCORD_BOT_TOKEN=${DISCORD_BOT_TOKEN}
      - ADMIN_DISCORD_USER_ID=${ADMIN_DISCORD_USER_ID}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - coaching-network
    volumes:
      - ./uploads:/app/uploads # For temporary file uploads

volumes:
  postgres_data:
    driver: local

networks:
  coaching-network:
    driver: bridge
```

### File: `Dockerfile`

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### File: `.dockerignore`

```
node_modules
.next
.git
.env*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
*.pem
```

---

## Environment Variables

### File: `.env.example`

```bash
# Database
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_NAME=overwatch_coaching
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}

# NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret_here_generate_with_openssl

# Discord Notifications (replaces email system)
DISCORD_BOT_TOKEN=your_discord_bot_token_here
ADMIN_DISCORD_USER_ID=your_discord_user_id_here

# Admin
ADMIN_EMAIL=your-email@example.com
```

---

## Integration & Deployment Instructions

**IMPORTANT**: After implementing the project, generate detailed setup instructions that include:

### Required Integration Guides:
1. **Discord Bot Setup** (replaces email notifications)
   - Creating a Discord bot application
   - Obtaining bot token
   - Setting up bot permissions
   - Getting your Discord user ID
   - Testing Discord notifications

2. **NextAuth Configuration**
   - Secret generation
   - Admin user creation process
   - Any additional auth setup needed

### Required Deployment Guides:
1. **Initial Setup**
   - Environment variable configuration
   - Database initialization
   - Running migrations
   - Creating first admin user

2. **Local Development**
   - Starting development environment
   - Database setup
   - Running the dev server

3. **Production Deployment**
   - Docker build and startup
   - Migration deployment
   - Container verification
   - Log monitoring
   - Accessing the site

4. **Maintenance Tasks**
   - Updating the deployment
   - Database backups and restoration
   - Log management

**Generate these instructions based on the actual implementation details, including:**
- Exact command sequences that work with the implemented code
- Any custom scripts or utilities created during development
- Troubleshooting steps for common issues
- Any implementation-specific quirks or important notes

---

## Post-Launch Checklist

### Immediate (MVP Launch)
- [ ] All integrations tested and working
- [ ] Admin login functional
- [ ] Replay code submission working
- [ ] Discord notifications sending
- [ ] Custom booking system working
- [ ] Blog post creation working
- [ ] Mobile responsive on all pages
- [ ] SSL certificate active (Cloudflare)
- [ ] Analytics installed (Google Analytics 4)
- [ ] Domain configured correctly

### Week 1
- [ ] Monitor error logs
- [ ] Test booking flow end-to-end
- [ ] Verify Discord notification delivery
- [ ] Write first 3 blog posts
- [ ] Set up Google Search Console
- [ ] Submit sitemap

### Month 1
- [ ] Add testimonials section
- [ ] Create case studies
- [ ] SEO optimization review
- [ ] Social media links added
- [ ] Consider adding FAQ page

### Future Enhancements (Post-MVP)
- [x] Stripe payment integration (COMPLETED)
- [x] Discord bot integration for notifications (COMPLETED - replaces email)
- [ ] Client portal (dashboard to view submissions)
- [ ] Replay code validation against Blizzard API
- [ ] Automated booking reminders (24hr before)
- [ ] Blog post categories/advanced filtering
- [ ] Newsletter signup
- [ ] Video testimonials
- [ ] Before/after rank showcase
- [ ] Community Discord link
- [ ] Advanced analytics dashboard

---

## Development Notes

### Code Organization
```
├── app/
│   ├── (public)/           # Public pages
│   │   ├── page.tsx        # Homepage
│   │   ├── services/
│   │   ├── about/
│   │   ├── blog/
│   │   ├── booking/
│   │   └── contact/
│   ├── admin/              # Admin pages (protected)
│   │   ├── layout.tsx      # Admin layout with auth check
│   │   ├── page.tsx        # Dashboard
│   │   ├── submissions/
│   │   ├── blog/
│   │   └── schedule/
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth
│   │   ├── replay/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── webhooks/
│   │   └── admin/
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── forms/              # Form components
│   ├── admin/              # Admin-specific components
│   └── layout/             # Layout components (Header, Footer)
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── auth.ts             # NextAuth configuration
│   ├── discord.ts          # Discord bot utilities
│   └── utils.ts            # General utilities
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── images/
│   └── fonts/
├── styles/
│   └── globals.css
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── package.json
```

### Key Packages to Install

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^5.0.0",
    "bcrypt": "^5.1.1",
    "discord.js": "^14.0.0",
    "gray-matter": "^4.0.3",
    "react-markdown": "^9.0.0",
    "rehype-highlight": "^7.0.0",
    "zod": "^3.22.0",
    "googleapis": "^128.0.0",
    "@tanstack/react-query": "^5.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
```

### Next.js Config

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Docker
  images: {
    domains: ['your-domain.com'], // Add any external image domains
  },
}

module.exports = nextConfig
```

### Prisma Commands Reference

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name description

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Validate schema
npx prisma validate

# Format schema
npx prisma format
```

---

## Security Considerations

### Authentication
- Use NextAuth for admin authentication
- Hash passwords with bcrypt (cost factor 10)
- Implement rate limiting on login endpoint
- Use secure session cookies (httpOnly, secure, sameSite)

### API Security
- Validate all inputs with Zod schemas
- Sanitize user-generated content (especially blog markdown)
- Implement rate limiting on public endpoints (especially forms)
- Use CORS appropriately

### Database
- Use parameterized queries (Prisma handles this)
- Limit database user permissions
- Regular backups
- Connection pooling configured

### Environment
- Never commit `.env` files
- Use strong passwords for database
- Rotate secrets periodically
- Use HTTPS only (Cloudflare handles this)

### Content Security
- Sanitize markdown content to prevent XSS
- Validate replay codes format
- Rate limit form submissions
- Implement CAPTCHA if spam becomes an issue

---

## Monitoring & Maintenance

### Logging
- Use structured logging (consider Pino or Winston)
- Log all API errors
- Log webhook events
- Monitor Discord notification delivery status

### Metrics to Track
- Replay code submissions per day
- Booking conversion rate
- Average review turnaround time
- Discord notification delivery rate
- Page load times
- Blog post views

### Regular Maintenance
- Weekly: Check error logs
- Monthly: Database backup verification
- Quarterly: Dependency updates
- As needed: Content updates (blog posts, services)

---

## Support & Documentation

### For Development Questions
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- NextAuth docs: https://next-auth.js.org
- Discord.js docs: https://discord.js.org
- Tailwind docs: https://tailwindcss.com/docs

### API References
- Discord Developer Portal: https://discord.com/developers/docs

---

## Timeline Estimate

**Setup & Configuration**: 1-2 hours
- Environment setup
- Integration credentials
- Docker configuration

**Core Development**: AI-assisted
- Frontend pages: Auto-generated
- Backend API: Auto-generated
- Database schema: Defined above

**Testing & Refinement**: 2-4 hours
- Test all forms
- Verify integrations
- Mobile responsiveness check
- Fix any bugs

**Content Creation**: Ongoing
- Write initial blog posts
- Create service descriptions
- Gather testimonials

**Total Time to MVP**: ~1 day active work + AI generation time

---

## Success Criteria

### MVP is successful when:
- [ ] Public can submit replay codes successfully
- [ ] You receive Discord notifications for submissions
- [ ] Custom booking system allows users to book sessions
- [ ] You can log in to admin panel
- [ ] You can manage submissions (view, update, complete)
- [ ] You can create blog posts by uploading .md files
- [ ] All pages are mobile responsive
- [ ] Site loads under 3 seconds
- [ ] Zero critical bugs in production

### Post-MVP Growth Indicators:
- 10+ replay code submissions per month
- 5+ coaching bookings per month
- 1000+ blog page views per month
- At least 2 new blog posts per month
- Discord notification delivery rate >95%

---

## Notes for Claude Code

When implementing this project:

1. **Use TypeScript strictly** - no `any` types
2. **Follow Next.js 14 App Router conventions**
3. **Use shadcn/ui components where appropriate** for rapid development
4. **Implement error boundaries** for graceful error handling
5. **Add loading states** for all async operations
6. **Make all forms use React Hook Form + Zod** for validation
7. **Implement proper TypeScript types** for all Prisma models
8. **Add JSDoc comments** for complex functions
9. **Use React Server Components** where possible for better performance
10. **Implement proper SEO metadata** for all public pages
11. **Add accessibility attributes** (ARIA labels, semantic HTML)
12. **Follow the design system** specified above consistently
13. **Create reusable components** to avoid duplication
14. **Add proper error handling** for all API routes
15. **Implement logging** for debugging in production

**Priority Order**:
1. Database schema & migrations
2. Authentication system
3. Public pages (homepage, services, about, booking)
4. Replay code submission flow
5. Admin panel (submissions manager)
6. Blog system
7. Custom booking system
8. Discord notifications
9. Polish & responsive design
10. Testing & bug fixes

**Testing Checklist** (before considering MVP complete):
- [ ] Test replay code submission with valid data
- [ ] Test replay code submission with invalid data
- [ ] Test admin login
- [ ] Test creating blog post from .md file
- [ ] Test marking submission as complete
- [ ] Verify Discord notifications are sent correctly
- [ ] Test on mobile device
- [ ] Test booking flow
- [ ] Check all links work
- [ ] Verify custom booking system works

---

End of Project Specification
