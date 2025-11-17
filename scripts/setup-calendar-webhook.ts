#!/usr/bin/env tsx

/**
 * Setup Google Calendar Webhook Script
 *
 * This script sets up a webhook channel with Google Calendar to receive
 * push notifications when calendar events are created, updated, or deleted.
 *
 * Usage:
 *   npm run setup:calendar-webhook <webhook-url>
 *
 * Example:
 *   npm run setup:calendar-webhook https://your-domain.com/api/webhooks/google-calendar
 *
 * The script will:
 * 1. Validate the webhook URL
 * 2. Create a watch channel with Google Calendar
 * 3. Display the channel ID and resource ID
 * 4. Show expiration time
 * 5. Provide instructions to save these values to environment variables
 *
 * IMPORTANT:
 * - You must have Google Calendar credentials configured (see .env.example)
 * - The webhook URL must be publicly accessible (use ngrok for local testing)
 * - Webhook channels expire after ~7 days and must be renewed
 * - Consider setting up a cron job to renew the webhook automatically
 *
 * Environment Variables Required:
 * - GOOGLE_CALENDAR_CLIENT_ID or GOOGLE_SERVICE_ACCOUNT_EMAIL
 * - GOOGLE_CALENDAR_CLIENT_SECRET or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
 * - GOOGLE_CALENDAR_CALENDAR_ID
 * - GOOGLE_CALENDAR_WEBHOOK_SECRET
 */

import { setupCalendarWebhook } from '../lib/google-calendar';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

/**
 * Print colored message to console
 */
function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Validate webhook URL format
 */
function validateWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Get webhook URL from command line arguments or prompt user
 */
async function getWebhookUrl(): Promise<string> {
  // Check if URL provided as command line argument
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const url = args[0];
    if (validateWebhookUrl(url)) {
      return url;
    }
    log(`Invalid webhook URL: ${url}`, 'red');
    log('URL must start with http:// or https://', 'red');
    process.exit(1);
  }

  // Prompt user for URL
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Enter your webhook URL: ', (url) => {
      rl.close();
      if (!validateWebhookUrl(url)) {
        log('Invalid webhook URL. Must start with http:// or https://', 'red');
        process.exit(1);
      }
      resolve(url.trim());
    });
  });
}

/**
 * Display environment variable instructions
 */
function displayEnvInstructions(channelId: string, resourceId: string, expiration: string) {
  log('\n' + '='.repeat(80), 'cyan');
  log('WEBHOOK SETUP COMPLETE!', 'green');
  log('='.repeat(80), 'cyan');

  log('\nWebhook Details:', 'bright');
  log(`  Channel ID:  ${channelId}`, 'yellow');
  log(`  Resource ID: ${resourceId}`, 'yellow');
  log(`  Expires:     ${new Date(parseInt(expiration)).toISOString()}`, 'yellow');

  const expirationDate = new Date(parseInt(expiration));
  const daysUntilExpiration = Math.floor(
    (expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  log(`\nWebhook will expire in approximately ${daysUntilExpiration} days.`, 'yellow');

  log('\n' + '='.repeat(80), 'cyan');
  log('NEXT STEPS:', 'bright');
  log('='.repeat(80), 'cyan');

  log('\n1. Save these values to your .env file:', 'blue');
  log('   Add or update the following lines:\n', 'blue');
  log(`   GOOGLE_CALENDAR_CHANNEL_ID="${channelId}"`, 'green');
  log(`   GOOGLE_CALENDAR_RESOURCE_ID="${resourceId}"`, 'green');

  log('\n2. If using Docker, also update docker-compose.yml:', 'blue');
  log('   Add these to the environment section:\n', 'blue');
  log(`   - GOOGLE_CALENDAR_CHANNEL_ID=${channelId}`, 'green');
  log(`   - GOOGLE_CALENDAR_RESOURCE_ID=${resourceId}`, 'green');

  log('\n3. Set up webhook renewal:', 'blue');
  log('   Google Calendar webhooks expire after ~7 days.', 'blue');
  log('   Consider setting up a cron job to renew the webhook:', 'blue');
  log('   - Run this script every 6 days, OR', 'blue');
  log('   - Create an API endpoint to handle webhook renewal, OR', 'blue');
  log('   - Use a scheduled task to call setupCalendarWebhook()', 'blue');

  log('\n4. Test the webhook:', 'blue');
  log('   - Create a test event in your Google Calendar', 'blue');
  log('   - Check your application logs for webhook notifications', 'blue');
  log('   - Verify the booking appears in your database', 'blue');

  log('\n' + '='.repeat(80), 'cyan');
  log('TROUBLESHOOTING:', 'bright');
  log('='.repeat(80), 'cyan');

  log('\nIf webhook notifications are not working:', 'blue');
  log('  1. Ensure webhook URL is publicly accessible', 'blue');
  log('  2. Verify GOOGLE_CALENDAR_WEBHOOK_SECRET matches in webhook handler', 'blue');
  log('  3. Check application logs for errors', 'blue');
  log('  4. Test webhook endpoint: GET https://your-domain.com/api/webhooks/google-calendar', 'blue');
  log('  5. For local testing, use ngrok or similar tunnel service', 'blue');

  log('\n' + '='.repeat(80) + '\n', 'cyan');
}

/**
 * Update .env file with channel ID and resource ID
 */
async function updateEnvFile(channelId: string, resourceId: string): Promise<boolean> {
  const envPath = path.join(process.cwd(), '.env');

  // Check if .env exists
  if (!fs.existsSync(envPath)) {
    log('\nWarning: .env file not found. Please create it from .env.example', 'yellow');
    return false;
  }

  try {
    let envContent = fs.readFileSync(envPath, 'utf-8');
    let updated = false;

    // Update or add GOOGLE_CALENDAR_CHANNEL_ID
    if (envContent.includes('GOOGLE_CALENDAR_CHANNEL_ID=')) {
      envContent = envContent.replace(
        /GOOGLE_CALENDAR_CHANNEL_ID=.*/,
        `GOOGLE_CALENDAR_CHANNEL_ID="${channelId}"`
      );
      updated = true;
    } else {
      envContent += `\nGOOGLE_CALENDAR_CHANNEL_ID="${channelId}"\n`;
    }

    // Update or add GOOGLE_CALENDAR_RESOURCE_ID
    if (envContent.includes('GOOGLE_CALENDAR_RESOURCE_ID=')) {
      envContent = envContent.replace(
        /GOOGLE_CALENDAR_RESOURCE_ID=.*/,
        `GOOGLE_CALENDAR_RESOURCE_ID="${resourceId}"`
      );
      updated = true;
    } else {
      envContent += `GOOGLE_CALENDAR_RESOURCE_ID="${resourceId}"\n`;
    }

    fs.writeFileSync(envPath, envContent);
    log('\n✓ Updated .env file with channel ID and resource ID', 'green');
    return true;
  } catch (error) {
    log(`\nWarning: Failed to update .env file: ${error}`, 'yellow');
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    log('\n' + '='.repeat(80), 'cyan');
    log('Google Calendar Webhook Setup', 'bright');
    log('='.repeat(80) + '\n', 'cyan');

    // Validate environment variables
    log('Checking environment variables...', 'blue');

    const hasServiceAccount =
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    const hasOAuth =
      process.env.GOOGLE_CALENDAR_CLIENT_ID &&
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET &&
      process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;

    if (!hasServiceAccount && !hasOAuth) {
      log('Error: Missing Google Calendar credentials!', 'red');
      log('\nYou need either:', 'yellow');
      log('  Service Account:', 'yellow');
      log('    - GOOGLE_SERVICE_ACCOUNT_EMAIL', 'yellow');
      log('    - GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY', 'yellow');
      log('  OR OAuth 2.0:', 'yellow');
      log('    - GOOGLE_CALENDAR_CLIENT_ID', 'yellow');
      log('    - GOOGLE_CALENDAR_CLIENT_SECRET', 'yellow');
      log('    - GOOGLE_CALENDAR_REFRESH_TOKEN', 'yellow');
      log('\nPlease configure these in your .env file.', 'yellow');
      log('See docs/GOOGLE_CALENDAR_SETUP.md for instructions.\n', 'yellow');
      process.exit(1);
    }

    if (!process.env.GOOGLE_CALENDAR_CALENDAR_ID) {
      log('Error: GOOGLE_CALENDAR_CALENDAR_ID is not set!', 'red');
      log('Please add it to your .env file.\n', 'yellow');
      process.exit(1);
    }

    if (!process.env.GOOGLE_CALENDAR_WEBHOOK_SECRET) {
      log('Error: GOOGLE_CALENDAR_WEBHOOK_SECRET is not set!', 'red');
      log('Please add it to your .env file.\n', 'yellow');
      process.exit(1);
    }

    log('✓ Environment variables configured\n', 'green');

    // Get webhook URL
    const webhookUrl = await getWebhookUrl();

    log(`\nSetting up webhook for: ${webhookUrl}`, 'blue');
    log('This may take a few seconds...\n', 'blue');

    // Setup webhook
    const result = await setupCalendarWebhook(webhookUrl);

    // Display results and instructions
    displayEnvInstructions(result.id, result.resourceId, result.expiration);

    // Offer to update .env file
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('\nWould you like to automatically update your .env file? (y/n): ', (answer) => {
      rl.close();
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        updateEnvFile(result.id, result.resourceId).then(() => {
          log('\nSetup complete! You can now restart your application.', 'green');
          process.exit(0);
        });
      } else {
        log('\nRemember to manually update your .env file with the values above.', 'yellow');
        process.exit(0);
      }
    });
  } catch (error) {
    log('\n' + '='.repeat(80), 'red');
    log('ERROR SETTING UP WEBHOOK', 'red');
    log('='.repeat(80), 'red');

    if (error instanceof Error) {
      log(`\n${error.message}\n`, 'red');

      if (error.message.includes('credentials')) {
        log('Please check your Google Calendar credentials in .env', 'yellow');
        log('See docs/GOOGLE_CALENDAR_SETUP.md for setup instructions.', 'yellow');
      } else if (error.message.includes('calendar')) {
        log('Please verify your GOOGLE_CALENDAR_CALENDAR_ID is correct', 'yellow');
      } else if (error.message.includes('webhook') || error.message.includes('address')) {
        log('Please ensure your webhook URL is publicly accessible', 'yellow');
        log('For local testing, use ngrok or a similar tunnel service', 'yellow');
      }
    } else {
      log('An unknown error occurred', 'red');
      console.error(error);
    }

    log('', 'reset');
    process.exit(1);
  }
}

// Run the script
main();
