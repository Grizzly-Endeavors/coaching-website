# Overwatch Coaching Website

A full-stack Overwatch coaching platform built with Next.js 14, TypeScript, and PostgreSQL. Features replay code submissions, appointment scheduling, Stripe payments, Discord notifications, and a comprehensive admin panel.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js v5
- **Database**: PostgreSQL 16, Prisma ORM
- **Integrations**: Stripe, Discord.js, Discord OAuth
- **Deployment**: Docker, Docker Compose, GitHub Actions
- **Validation**: Zod schemas throughout
- **Content**: Markdown with syntax highlighting

## Key Features

- **Replay Submissions**: Multi-rank submissions with Stripe payment integration and friend codes
- **Appointment Scheduling**: Custom timezone-aware system with weekly recurring slots and exception management
- **Discord Integration**: Automated notifications for submissions, bookings, and reminders (24h and 30m before sessions)
- **Blog System**: Markdown support with GFM, syntax highlighting, and XSS protection
- **Admin Panel**: Manage submissions, bookings, blog posts, availability, friend codes, and payments
- **Security**: NextAuth.js with dual auth (Credentials + Discord OAuth), rate limiting, JWT sessions

## Getting Started

### Prerequisites

- Node.js 20 LTS
- PostgreSQL 16 (or Docker)

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Setup database
npm run prisma:migrate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm start` - Production server
- `npm run lint` - ESLint
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:studio` - Database GUI

## Architecture

### API Routes (31 endpoints)

**Public:**
- `/api/auth/*` - Authentication (NextAuth.js)
- `/api/blog/*` - Blog posts with caching
- `/api/contact` - Contact form
- `/api/replay-submit` - Replay submission
- `/api/booking/*` - Availability and bookings
- `/api/stripe/checkout` - Payment sessions
- `/api/webhooks/stripe` - Stripe webhooks

**Admin Protected:**
- `/api/admin/submissions/*` - Submission CRUD
- `/api/admin/blog/*` - Blog management
- `/api/admin/availability/*` - Schedule management
- `/api/admin/bookings/*` - Booking management
- `/api/admin/friend-codes/*` - Promo codes
- `/api/admin/config/*` - Configuration

### Database Schema (7 Models)

- **ReplaySubmission** - Submissions with status workflow
- **ReplayCode** - Individual replay codes
- **Booking** - Appointments with reminder tracking
- **Payment** - Stripe payment tracking
- **Admin** - Admin accounts
- **AvailabilitySlot** - Weekly recurring schedule
- **AvailabilityException** - Date-specific blocks/bookings

### Background Services

- **Reminder Service**: Runs every 5 minutes via Next.js instrumentation, sends Discord reminders
- **Discord Bot**: Singleton client with 6 notification types (submissions, reviews, bookings, reminders)

### Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── blog/              # Blog pages
│   ├── booking/           # Booking flow
│   └── login/             # Auth pages
├── components/            # React components
│   ├── ui/               # Reusable UI
│   ├── forms/            # Form components
│   ├── admin/            # Admin components
│   └── blog/             # Blog rendering
├── lib/                   # Core utilities
│   ├── auth.ts           # NextAuth config
│   ├── discord.ts        # Discord bot
│   ├── reminder-service.ts # Reminder job
│   ├── rate-limiter.ts   # Rate limiting
│   └── validations/      # Zod schemas
├── prisma/               # Database
│   ├── schema.prisma     # Schema definition
│   └── migrations/       # Migration history
├── scripts/              # Utility scripts
├── .github/workflows/    # CI/CD
├── Dockerfile            # Multi-stage build
└── docker-compose.yml    # Service orchestration
```

## Deployment

### Docker

Multi-stage build with three stages (deps, builder, runner). Alpine-based images with non-root user for security.

```bash
docker-compose up -d
```

### CI/CD Pipeline

GitHub Actions workflow deploys on push to production branch:
1. Generate .env from GitHub Secrets
2. Build and start Docker services
3. Run database migrations
4. Create admin account if needed

See [PROJECT_SPEC.md](PROJECT_SPEC.md) for detailed deployment instructions.

## Environment Variables

Required configuration in `.env`:
- Database connection string
- NextAuth URL and secret
- Discord bot token, OAuth credentials, guild ID, admin user ID
- Stripe keys, webhook secret, and 3 price IDs
- Initial admin credentials
- Google Analytics ID

See `.env.example` for complete list.

## Key Technical Features

- **Type Safety**: Full TypeScript with Zod validation and Prisma
- **Security**: bcrypt password hashing, rate limiting, httpOnly JWT cookies, input validation
- **Custom Scheduling**: Timezone-aware slot generation with conflict detection
- **Payment Processing**: Webhook-driven state machine with automatic cleanup
- **Error Handling**: Centralized handler with proper HTTP codes and structured logging
- **Performance**: Strategic database indexes, HTTP caching, selective field loading

## License

Private project - All rights reserved
