#!/bin/bash
set -e

echo "🚀 Starting Docker initialization script..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

while ! docker exec overwatch-coaching-db pg_isready -U ${DB_USER:-postgres} > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT+1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        print_error "PostgreSQL did not become ready in time"
        exit 1
    fi
    echo "Waiting for database... (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

print_message "PostgreSQL is ready!"

# Run Prisma migrations
echo "Running Prisma migrations..."
docker exec overwatch-coaching-app npx prisma migrate deploy

if [ $? -eq 0 ]; then
    print_message "Migrations completed successfully"
else
    print_error "Migration failed"
    exit 1
fi

# Check if we should seed the database with an admin user
if [ "$SEED_ADMIN" = "true" ]; then
    echo "Seeding initial admin user..."
    
    # Create a temporary Node.js script to create admin user
    docker exec overwatch-coaching-app node -e "
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcryptjs');
    
    const prisma = new PrismaClient();
    
    async function seedAdmin() {
        try {
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
            const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
            
            // Check if admin already exists
            const existingAdmin = await prisma.admin.findUnique({
                where: { email: adminEmail }
            });
            
            if (existingAdmin) {
                console.log('Admin user already exists');
                return;
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            
            // Create admin user
            await prisma.admin.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    name: 'Admin User'
                }
            });
            
            console.log('Admin user created successfully');
            console.log('Email:', adminEmail);
            console.log('Password:', adminPassword);
            console.log('⚠️  Please change the password after first login!');
        } catch (error) {
            console.error('Error seeding admin:', error);
            process.exit(1);
        } finally {
            await prisma.\$disconnect();
        }
    }
    
    seedAdmin();
    "
    
    if [ $? -eq 0 ]; then
        print_message "Admin user seeded successfully"
    else
        print_warning "Failed to seed admin user (may already exist)"
    fi
fi

print_message "Database initialization complete!"
print_message "You can now access the application at http://localhost:3000"

echo ""
echo "Next steps:"
echo "  - Access the application: http://localhost:3000"
echo "  - Access admin panel: http://localhost:3000/admin/login"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop containers: docker-compose down"
echo ""
