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
  console.log('\n📝 Create Admin User\n');
  console.log('This script will create a new admin user in the database.');
  console.log('Password will be hashed using bcrypt (cost factor 10).\n');

  try {
    // Get email from command line args or prompt
    let email = process.argv[2];
    if (!email) {
      email = await prompt('Email address: ');
    }
    email = email.trim().toLowerCase();

    // Validate email
    if (!isValidEmail(email)) {
      console.error('\n❌ Error: Invalid email address format');
      process.exit(1);
    }

    // Check if admin with this email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.error(`\n❌ Error: Admin user with email "${email}" already exists`);
      process.exit(1);
    }

    // Get password from command line args or prompt
    let password = process.argv[3];
    if (!password) {
      password = await prompt('Password (min 8 characters): ');
    }

    // Validate password
    if (password.length < 8) {
      console.error('\n❌ Error: Password must be at least 8 characters long');
      process.exit(1);
    }

    // Get name from command line args or prompt (optional)
    let name: string | null = process.argv[4];
    if (!name) {
      name = await prompt('Name (optional, press Enter to skip): ');
    }
    name = name.trim() || null;

    console.log('\n🔐 Hashing password...');
    const hashedPassword = await hashPassword(password);

    console.log('💾 Creating admin user...');
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name: name || undefined,
      },
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('Details:');
    console.log(`  ID:    ${admin.id}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Name:  ${admin.name || '(not provided)'}`);
    console.log(`  Created: ${admin.createdAt.toISOString()}\n`);
    console.log('You can now log in at: /login\n');
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main();
