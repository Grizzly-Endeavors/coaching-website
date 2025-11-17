# Docker Deployment Guide - Overwatch Coaching Website

## Overview
This document provides comprehensive instructions for deploying the Overwatch Coaching Website using Docker and Docker Compose.

## Files Created

### 1. Dockerfile
**Location**: `/home/user/coaching-website/Dockerfile`

Multi-stage Docker build configuration:
- **Stage 1 (deps)**: Installs Node.js dependencies using npm ci
- **Stage 2 (builder)**: Generates Prisma Client and builds Next.js application with standalone output
- **Stage 3 (runner)**: Production-optimized image running as non-root user (nextjs:1001)

**Key Features**:
- Node 20 Alpine base image (minimal footprint)
- Multi-stage build reduces final image size
- Standalone Next.js output for optimal performance
- Prisma Client generated during build
- Runs as non-root user for security
- Exposes port 3000

### 2. docker-compose.yml
**Location**: `/home/user/coaching-website/docker-compose.yml`

Orchestrates three services:

#### PostgreSQL Service (postgres)
- Image: postgres:16-alpine
- Container: overwatch-coaching-db
- Port: 5432
- Health check: pg_isready every 10s
- Persistent volume: postgres_data
- Auto-restart: unless-stopped

#### Next.js Application Service (app)
- Built from Dockerfile
- Container: overwatch-coaching-app
- Port: 3000
- Depends on: postgres (waits for health check)
- Environment variables from .env file
- Volume: ./uploads for temporary file uploads
- Auto-restart: unless-stopped

#### Cloudflare Tunnel Service (cloudflared)
- Image: cloudflare/cloudflared:latest
- Container: overwatch-coaching-tunnel
- Depends on: app
- Provides secure tunnel without exposing ports
- Auto-restart: unless-stopped

**Networking**: All services communicate via coaching-network bridge network

### 3. .dockerignore
**Location**: `/home/user/coaching-website/.dockerignore`

Excludes unnecessary files from Docker build:
- node_modules (installed fresh in container)
- .next build output
- .git repository
- Environment files (.env*.local)
- Log files
- OS-specific files (.DS_Store)
- SSL certificates (*.pem)

### 4. package.json
**Location**: `/home/user/coaching-website/package.json`

**Key Scripts**:
- `postinstall`: Automatically generates Prisma Client after npm install
- `build`: Builds Next.js with standalone output
- `start`: Runs production server (used in Docker)
- `docker:build`: Builds Docker images
- `docker:up`: Starts containers in detached mode
- `docker:down`: Stops and removes containers
- `docker:logs`: Follows container logs
- `docker:init`: Runs database initialization script

**Dependencies** include:
- Next.js 14.2+ (App Router)
- Prisma 5.14+ (ORM)
- NextAuth 5.0 beta (Authentication)
- Resend + React Email (Email service)
- Google APIs (Calendar integration)
- React Query (Data fetching)
- Zod (Validation)
- And more...

### 5. scripts/docker-init.sh
**Location**: `/home/user/coaching-website/scripts/docker-init.sh`

**Purpose**: Initializes database on first deployment

**Features**:
- Waits for PostgreSQL to be ready (max 30 retries, 2s intervals)
- Runs Prisma migrations automatically
- Optionally seeds initial admin user
- Colored terminal output for easy monitoring
- Error handling and validation

**Admin Seeding**:
Set environment variables to seed an admin user:
```bash
SEED_ADMIN=true
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=changeme123
```

### 6. .env.example
**Location**: `/home/user/coaching-website/.env.example`

Template for environment variables. Copy to `.env` and fill in your values:

```bash
cp .env.example .env
```

## Deployment Instructions

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

### Initial Setup

#### 1. Clone and Navigate to Project
```bash
cd /home/user/coaching-website
```

#### 2. Configure Environment Variables
```bash
# Copy example environment file
cp .env.example .env

# Edit with your actual values
nano .env
```

**Required Variables**:
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Database credentials
- `NEXTAUTH_URL`: Your domain (e.g., https://yoursite.com)
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `ADMIN_EMAIL`: Your admin email
- `RESEND_API_KEY`: Get from https://resend.com
- `GOOGLE_CALENDAR_*`: Google Calendar API credentials
- `CLOUDFLARE_TUNNEL_TOKEN`: Cloudflare tunnel token

**Optional Variables**:
- `SEED_ADMIN=true`: Seeds admin user on first run
- `ADMIN_PASSWORD`: Initial admin password (default: changeme123)

#### 3. Generate NextAuth Secret
```bash
openssl rand -base64 32
```
Add the output to `NEXTAUTH_SECRET` in your .env file.

### Development Deployment

For local development without Docker:
```bash
# Install dependencies
npm install

# Set up database (use local PostgreSQL or Docker just for DB)
docker-compose up -d postgres

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Access at: http://localhost:3000

### Production Deployment with Docker

#### Option A: Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d --build

# Wait for services to be ready (check logs)
docker-compose logs -f

# Initialize database (run migrations & seed admin)
npm run docker:init
```

#### Option B: Step-by-Step

```bash
# 1. Build images
npm run docker:build

# 2. Start services
npm run docker:up

# 3. Check service health
docker ps

# 4. Initialize database
npm run docker:init

# 5. View logs
npm run docker:logs
```

### Verifying Deployment

1. **Check Container Status**:
```bash
docker ps
```
You should see 3 running containers:
- overwatch-coaching-db (PostgreSQL)
- overwatch-coaching-app (Next.js)
- overwatch-coaching-tunnel (Cloudflared)

2. **Check Application Logs**:
```bash
docker-compose logs app
```
Look for "ready started server on 0.0.0.0:3000"

3. **Test Database Connection**:
```bash
docker exec overwatch-coaching-app npx prisma db push
```

4. **Access Application**:
- Local: http://localhost:3000
- Via Cloudflare Tunnel: https://your-domain.com

### Database Management

#### Run Migrations
```bash
docker exec overwatch-coaching-app npx prisma migrate deploy
```

#### Access Prisma Studio (Database GUI)
```bash
docker exec -it overwatch-coaching-app npx prisma studio
```
Then tunnel: `ssh -L 5555:localhost:5555 user@server`

#### Create Database Backup
```bash
docker exec overwatch-coaching-db pg_dump -U postgres overwatch_coaching > backup.sql
```

#### Restore Database Backup
```bash
cat backup.sql | docker exec -i overwatch-coaching-db psql -U postgres overwatch_coaching
```

### Updating Deployment

#### Update Application Code
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart app service only
docker-compose up -d --build app

# Run any new migrations
docker exec overwatch-coaching-app npx prisma migrate deploy
```

#### Update Dependencies
```bash
# Rebuild with fresh dependencies
docker-compose build --no-cache app
docker-compose up -d app
```

### Troubleshooting

#### Container Won't Start
```bash
# Check logs
docker-compose logs app

# Check if PostgreSQL is ready
docker exec overwatch-coaching-db pg_isready -U postgres
```

#### Database Connection Errors
- Verify DATABASE_URL in .env
- Ensure postgres service is healthy: `docker ps`
- Check network: `docker network inspect coaching-network`

#### Prisma Client Not Found
```bash
# Regenerate Prisma Client
docker exec overwatch-coaching-app npx prisma generate
docker-compose restart app
```

#### Port Already in Use
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead
```

#### Reset Everything (DANGER: Loses Data)
```bash
docker-compose down -v
docker-compose up -d --build
npm run docker:init
```

### Monitoring & Maintenance

#### View Real-time Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f cloudflared
```

#### Check Resource Usage
```bash
docker stats
```

#### Access Container Shell
```bash
# App container
docker exec -it overwatch-coaching-app sh

# Database container
docker exec -it overwatch-coaching-db sh
```

### Stopping Services

#### Stop All Services
```bash
docker-compose down
```

#### Stop But Keep Volumes
```bash
docker-compose stop
```

#### Stop and Remove Everything (Including Volumes)
```bash
docker-compose down -v
```

## Security Considerations

### Environment Variables
- Never commit `.env` file to git
- Use strong passwords for DB_PASSWORD
- Rotate NEXTAUTH_SECRET periodically
- Keep API keys secure

### Container Security
- Application runs as non-root user (nextjs:1001)
- Minimal Alpine base images
- No unnecessary packages installed
- Network isolation via Docker networks

### Database Security
- Database not exposed publicly (only via Docker network)
- Port 5432 only needed for local access (can be removed in production)
- Regular backups recommended
- Use strong PostgreSQL password

## Next Steps After Deployment

1. **Configure Cloudflare Tunnel**: Set up tunnel to expose your application
2. **Set Up Google Calendar API**: Configure OAuth and webhook
3. **Configure Resend**: Verify domain and test emails
4. **Create Admin User**: Use SEED_ADMIN or create manually
5. **Test All Features**:
   - Admin login
   - Replay code submission
   - Email notifications
   - Blog post creation
   - Booking integration

## Production Recommendations

1. **Enable SSL**: Cloudflare Tunnel handles this automatically
2. **Set Up Monitoring**: Consider adding logging service (Sentry, LogRocket)
3. **Configure Backups**: Automate PostgreSQL backups (daily recommended)
4. **Set Up CI/CD**: Automate deployments on git push
5. **Add Health Checks**: Implement /api/health endpoint
6. **Configure Alerts**: Set up alerts for container failures
7. **Regular Updates**: Keep dependencies and images updated

## File Structure Summary

```
/home/user/coaching-website/
├── Dockerfile                  # Multi-stage build configuration
├── docker-compose.yml          # Service orchestration
├── .dockerignore              # Build exclusions
├── .env.example               # Environment template
├── package.json               # Dependencies & scripts
├── scripts/
│   └── docker-init.sh         # Database initialization
└── [Application code...]
```

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Docker Docs**: https://docs.docker.com
- **Cloudflare Tunnel**: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks

---

**Last Updated**: 2025-11-17
**Docker Version**: 20.10+
**Docker Compose Version**: 2.0+
**Node Version**: 20 LTS
**PostgreSQL Version**: 16
