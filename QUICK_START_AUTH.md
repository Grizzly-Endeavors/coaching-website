# Authentication Quick Start Guide

## Get Started in 3 Steps

### Step 1: Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Generate secure secret
openssl rand -base64 32

# Update .env with:
# - DATABASE_URL (your PostgreSQL connection)
# - NEXTAUTH_SECRET (generated secret above)
# - NEXTAUTH_URL (http://localhost:3000 for dev)
```

### Step 2: Database & Dependencies
```bash
# Install dependencies
npm install

# Run database migrations
npm run prisma:migrate:dev

# Verify Prisma client is generated
npm run prisma:generate
```

### Step 3: Create Admin User
```bash
# Interactive mode (recommended)
npm run create-admin

# Or with arguments
npx tsx scripts/create-admin.ts admin@example.com SecurePass123 "Admin Name"
```

## Test It Out

```bash
# Start dev server
npm run dev

# Visit admin panel
http://localhost:3000/admin

# Should redirect to login
http://localhost:3000/admin/login

# Log in with credentials you just created
```

## Files Created

✅ `/lib/auth.ts` - NextAuth configuration
✅ `/lib/auth-helpers.ts` - Helper functions
✅ `/lib/rate-limit.ts` - Rate limiting
✅ `/app/api/auth/[...nextauth]/route.ts` - Auth API
✅ `/app/admin/login/page.tsx` - Login page
✅ `/middleware.ts` - Route protection
✅ `/scripts/create-admin.ts` - Admin creation

## Quick Commands

```bash
# Create admin user
npm run create-admin

# Start dev server
npm run dev

# Run migrations
npm run prisma:migrate:dev

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Generate Prisma client
npm run prisma:generate
```

## Security Features

- ✅ Bcrypt password hashing (cost 10)
- ✅ Rate limiting (5 attempts/15 min)
- ✅ Secure cookies (httpOnly, secure, sameSite)
- ✅ JWT sessions
- ✅ Middleware route protection
- ✅ Generic error messages

## Need Help?

- Detailed guide: See `AUTH_SETUP.md`
- Full implementation details: See `IMPLEMENTATION_SUMMARY.md`
- Project specs: See `PROJECT_SPEC.md`

## Common Issues

**"NEXTAUTH_SECRET is not set"**
```bash
# Generate and add to .env
openssl rand -base64 32
```

**"Database connection error"**
```bash
# Check PostgreSQL is running
docker-compose up -d postgres
# Or start local PostgreSQL service
```

**"Cannot find module 'next-auth'"**
```bash
npm install
```

**"Admin user already exists"**
```bash
# Check existing admins in Prisma Studio
npm run prisma:studio
# Navigate to Admin table
```

## What's Next?

After authentication works:
1. Customize the login page design
2. Build admin dashboard pages
3. Protect API routes with `requireAuth()`
4. Add admin management features
5. Consider adding 2FA or password reset

---

**That's it! Your authentication system is ready to use.**
