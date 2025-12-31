/**
 * Script to check admin users in the database
 *
 * This script lists all admin users and their details (without passwords)
 * to help debug authentication issues.
 *
 * Usage:
 *   npx tsx scripts/check-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function main() {
  logger.info('\n🔍 Checking Admin Users\n');

  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (admins.length === 0) {
      logger.info('❌ No admin users found in the database.\n');
      logger.info('Run the create-admin script to create one:\n');
      logger.info('  npx tsx scripts/create-admin.ts\n');
    } else {
      logger.info(`✅ Found ${admins.length} admin user(s):\n`);
      admins.forEach((admin, index) => {
        logger.info(`${index + 1}. Admin User:`);
        logger.info(`   ID:      ${admin.id}`);
        logger.info(`   Email:   ${admin.email}`);
        logger.info(`   Name:    ${admin.name || '(not set)'}`);
        logger.info(`   Created: ${admin.createdAt.toISOString()}\n`);
      });
    }

    // Check environment variables
    logger.info('📋 Environment Configuration:');
    logger.info(`   ADMIN_EMAIL:     ${process.env.ADMIN_EMAIL || '(not set)'}`);
    logger.info(`   NEXTAUTH_URL:    ${process.env.NEXTAUTH_URL || '(not set)'}`);
    logger.info(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '(set)' : '(not set)'}`);
    logger.info(`   DISCORD_CLIENT_ID: ${process.env.DISCORD_CLIENT_ID ? '(set)' : '(not set)'}`);
    logger.info(`   DISCORD_CLIENT_SECRET: ${process.env.DISCORD_CLIENT_SECRET ? '(set)' : '(not set)'}\n`);

  } catch (error) {
    logger.error('Error checking admin users:', error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
