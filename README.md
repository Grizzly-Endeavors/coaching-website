# Overwatch Coaching Website

A professional Overwatch coaching platform built with Next.js 14, TypeScript, and PostgreSQL.

## Features

- **Replay Code Submissions**: Players can submit replay codes for VOD reviews
- **Custom Appointment System**: Book coaching sessions with custom availability management
- **Blog System**: Markdown-based blog with syntax highlighting
- **Admin Panel**: Manage submissions, bookings, and blog posts
- **Discord Notifications**: Automated notifications via Discord bot integration
- **Docker Deployment**: Full containerized setup with PostgreSQL

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5
- **Notifications**: Discord bot integration
- **Deployment**: Docker + Cloudflare Tunnel

## Getting Started

### Prerequisites

- Node.js 20 LTS
- PostgreSQL 16 (or use Docker)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in your environment variables:
```bash
cp .env.example .env
```

4. Set up the database:
```bash
npm run prisma:migrate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── forms/            # Form components
│   ├── admin/            # Admin-specific components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── prisma.ts         # Prisma client singleton
│   ├── utils.ts          # Helper functions
│   └── types.ts          # TypeScript types
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema
├── public/               # Static assets
└── docker-compose.yml    # Docker configuration
```

## Design System

The application uses a dark theme with purple accents:

- **Primary Background**: `#0f0f23`
- **Surface**: `#1a1a2e`
- **Purple Primary**: `#8b5cf6`
- **Purple Hover**: `#a78bfa`
- **Text Primary**: `#e5e7eb`
- **Text Secondary**: `#9ca3af`

## Database Schema

The application includes the following models:

- **ReplaySubmission**: Replay code submissions from players
- **Booking**: Custom appointment bookings for coaching sessions
- **BlogPost**: Markdown blog posts
- **Admin**: Admin user accounts
- **AvailabilitySlot**: Weekly recurring availability schedule
- **AvailabilityException**: Specific date exceptions (bookings, blocked dates, holidays)

See `prisma/schema.prisma` for the complete schema.

## Deployment

See `PROJECT_SPEC.md` for detailed deployment instructions including:
- Docker setup
- Cloudflare Tunnel configuration
- Environment variable setup
- Database initialization

## License

Private project - All rights reserved
