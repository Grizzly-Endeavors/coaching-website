# Quick Start Guide - Overwatch Coaching Website

## 🚀 Foundation Setup Complete!

Your Next.js 14 project foundation is fully configured and ready to use.

## ✅ What's Been Set Up

### 1. Next.js 14 + TypeScript
- App Router architecture
- Strict TypeScript configuration
- ESLint with Next.js rules
- All dependencies installed (38 packages)

### 2. Tailwind CSS Design System
- Custom color palette (dark theme with purple accents)
- Typography configuration (Inter font)
- Component classes (buttons, cards, inputs, badges)
- Animations (fade-in, pulse-glow, spin)

### 3. Prisma Database Schema
- 5 complete models with proper relationships
- ReplaySubmission, Booking, BlogPost, Admin, EmailLog
- 5 enums for status tracking
- PostgreSQL-ready schema

### 4. Project Structure
```
app/          → Pages & API routes
components/   → Reusable React components
lib/          → Utilities & helpers
prisma/       → Database schema
emails/       → Email templates
public/       → Static assets
```

### 5. Core Libraries
- `lib/prisma.ts` - Database client
- `lib/utils.ts` - Helper functions
- `lib/types.ts` - Type definitions
- `lib/validations.ts` - Zod schemas
- `lib/auth.ts` - NextAuth config

## 🎯 First Steps

### 1. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your values
# At minimum, set DATABASE_URL
```

### 2. Set Up Database
```bash
# Start PostgreSQL (if using Docker)
docker-compose up -d postgres

# Or use your existing PostgreSQL instance
# Update DATABASE_URL in .env

# Run migrations
npm run prisma:migrate:dev
```

### 3. Create Admin User
```bash
npm run create-admin
# Follow the prompts to create your first admin account
```

### 4. Start Development Server
```bash
npm run dev
# Open http://localhost:3000
```

## 📁 Key Files Reference

### Configuration
- `next.config.js` - Next.js settings (standalone output for Docker)
- `tailwind.config.ts` - Design system colors & typography
- `tsconfig.json` - TypeScript compiler options
- `prisma/schema.prisma` - Database schema

### Application
- `app/layout.tsx` - Root layout with Inter font & SEO metadata
- `app/globals.css` - Tailwind imports & custom styles
- `app/page.tsx` - Homepage

### Docker
- `docker-compose.yml` - PostgreSQL, App, Cloudflare Tunnel
- `Dockerfile` - Multi-stage Next.js build
- `.dockerignore` - Build optimization

## 🎨 Design System Quick Reference

### Colors
```tsx
// Backgrounds
bg-background-primary   // #0f0f23
bg-background-surface   // #1a1a2e
bg-background-elevated  // #2a2a40

// Purple Accents
bg-purple-primary       // #8b5cf6
bg-purple-hover         // #a78bfa
bg-purple-glow          // rgba(139, 92, 246, 0.3)

// Text
text-text-primary       // #e5e7eb
text-text-secondary     // #9ca3af
text-text-muted         // #6b7280

// Status
text-status-success     // #10b981
text-status-warning     // #f59e0b
text-status-error       // #ef4444
```

### Component Classes
```tsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<div className="card">Card Content</div>
<input className="input" />
<textarea className="textarea" />
<select className="select" />
<label className="label">Label Text</label>
```

### Status Badges
```tsx
<span className="status-pending">Pending</span>
<span className="status-in-progress">In Progress</span>
<span className="status-completed">Completed</span>
<span className="status-error">Error</span>
```

## 🛠️ Useful Commands

### Development
```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm start               # Start production server
npm run lint            # Run ESLint
```

### Database
```bash
npm run prisma:generate      # Generate Prisma Client
npm run prisma:migrate:dev   # Create & run migration (dev)
npm run prisma:migrate       # Deploy migrations (production)
npm run prisma:studio        # Open Prisma Studio GUI
npm run prisma:reset         # Reset database (dev only)
```

### Docker
```bash
npm run docker:build    # Build containers
npm run docker:up       # Start all services
npm run docker:down     # Stop all services
npm run docker:logs     # View logs
npm run docker:init     # Initialize environment
```

### Utilities
```bash
npm run create-admin    # Create admin user
```

## 📚 Documentation Files

- `PROJECT_SPEC.md` - Complete project specification
- `SETUP_SUMMARY.md` - Detailed setup summary
- `FOUNDATION_CHECKLIST.md` - Foundation verification checklist
- `README.md` - Project overview
- `QUICK_START.md` - This file

## 🔑 Environment Variables

Required in `.env`:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google Calendar (for booking integration)
GOOGLE_CALENDAR_CLIENT_ID="your-client-id"
GOOGLE_CALENDAR_CLIENT_SECRET="your-client-secret"
GOOGLE_CALENDAR_CALENDAR_ID="your-calendar-id@group.calendar.google.com"

# Resend (for emails)
RESEND_API_KEY="re_your_api_key"

# Admin
ADMIN_EMAIL="your-email@example.com"
```

## 🎯 Next Development Steps

1. **Implement Public Pages**
   - Homepage with hero section
   - Services page with pricing
   - About page
   - Contact form

2. **Build Replay Submission System**
   - Public form at `/booking`
   - API route at `/api/replay/submit`
   - Email notifications

3. **Create Admin Panel**
   - Login at `/admin/login`
   - Submissions manager at `/admin/submissions`
   - Blog manager at `/admin/blog`

4. **Set Up Blog System**
   - Blog listing at `/blog`
   - Individual posts at `/blog/[slug]`
   - Markdown rendering with syntax highlighting

5. **Integrate External Services**
   - Google Calendar API for bookings
   - Resend for email notifications
   - Cloudflare Tunnel for deployment

## 🐳 Docker Deployment

For production deployment:

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with production values

# 2. Build and start
docker-compose up -d

# 3. Run migrations
docker-compose exec app npm run prisma:migrate

# 4. Create admin user
docker-compose exec app npm run create-admin

# 5. View logs
docker-compose logs -f app
```

## ✅ Verification Checklist

Before starting feature development:

- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Prisma Client generated (`npm run prisma:generate`)
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] Can access homepage at http://localhost:3000
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] ESLint passes (`npm run lint`)

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker-compose ps

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Prisma Client Not Found
```bash
# Regenerate Prisma Client
npm run prisma:generate
```

### TypeScript Errors
```bash
# Check for errors
npx tsc --noEmit

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

See `PROJECT_SPEC.md` for:
- Complete feature specifications
- API route documentation
- Integration guides
- Security considerations
- Deployment instructions

## 🎉 Ready to Build!

Your foundation is complete and production-ready. Start building your Overwatch coaching platform!

```bash
npm run dev
# Happy coding! 🚀
```
