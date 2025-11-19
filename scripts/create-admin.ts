/**
 * Script to create an admin user
 *
 * This script creates a new admin user in the database with a hashed password.
 * It can be run directly using tsx or ts-node.
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts
 *
 * The script will prompt for email, password, and optional name.
 * Alternatively, you can provide them via command line arguments:
 *   npx tsx scripts/create-admin.ts email@example.com password123 "John Doe"
 */

import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';
import { hashPassword } from '../lib/auth-helpers';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

/**
 * Prompt user for input from command line
 */
function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Main function to create admin user
 */
async function main() {
  logger.info('\n📝 Create Admin User\n');
  logger.info('This script will create a new admin user in the database.');
  logger.info('Password will be hashed using bcrypt (cost factor 10).\n');

  try {
    // Get email from command line args or prompt
    let email = process.argv[2];
    if (!email) {
      email = await prompt('Email address: ');
    }
    email = email.trim().toLowerCase();

    // Validate email
    if (!isValidEmail(email)) {
      logger.error('\n❌ Error: Invalid email address format');
      process.exit(1);
    }

    // Check if admin with this email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      logger.error(`\n❌ Error: Admin user with email "${email}" already exists`);
      process.exit(1);
    }

    // Get password from command line args or prompt
    let password = process.argv[3];
    if (!password) {
      password = await prompt('Password (min 8 characters): ');
    }

    // Validate password
    if (password.length < 8) {
      logger.error('\n❌ Error: Password must be at least 8 characters long');
      process.exit(1);
    }

    // Get name from command line args or prompt (optional)
    let name: string | null = process.argv[4];
    if (!name) {
      name = await prompt('Name (optional, press Enter to skip): ');
    }
    name = name.trim() || null;

    logger.info('\n🔐 Hashing password...');
    const hashedPassword = await hashPassword(password);

    logger.info('💾 Creating admin user...');
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name: name || undefined,
      },
    });

    logger.info('\n✅ Admin user created successfully!\n');
    logger.info('Details:');
    logger.info(`  ID:    ${admin.id}`);
    logger.info(`  Email: ${admin.email}`);
    logger.info(`  Name:  ${admin.name || '(not provided)'}`);
    logger.info(`  Created: ${admin.createdAt.toISOString()}\n`);
    logger.info('You can now log in at: /login\n');
  } catch (error) {
    logger.error('\n❌ Error creating admin user:', error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main();
