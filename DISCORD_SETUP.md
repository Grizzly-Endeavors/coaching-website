# Discord Integration Setup Guide

This guide will walk you through setting up Discord integration for your coaching website. The Discord bot sends direct messages (DMs) for:

1. **VOD Request Notifications** - Sends you a DM when someone submits a replay for review
2. **Review Ready Notifications** - Sends users a DM when their review is completed (if they provided a Discord ID)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1: Create a Discord Application](#step-1-create-a-discord-application)
- [Step 2: Create a Discord Bot](#step-2-create-a-discord-bot)
- [Step 3: Configure Bot Permissions](#step-3-configure-bot-permissions)
- [Step 4: Get Your Discord User ID](#step-4-get-your-discord-user-id)
- [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
- [Step 6: Test the Integration](#step-6-test-the-integration)
- [Troubleshooting](#troubleshooting)
- [How It Works](#how-it-works)

---

## Prerequisites

- A Discord account
- Access to the [Discord Developer Portal](https://discord.com/developers/applications)
- Admin access to your coaching website server

---

## Step 1: Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"** in the top right
3. Give your application a name (e.g., "Overwatch Coaching Bot")
4. Click **"Create"**
5. You'll be taken to your application's dashboard

---

## Step 2: Create a Discord Bot

1. In your application dashboard, click **"Bot"** in the left sidebar
2. Click **"Add Bot"**
3. Confirm by clicking **"Yes, do it!"**
4. Your bot is now created!

### Get Your Bot Token

1. Under the bot's username, you'll see a **"TOKEN"** section
2. Click **"Reset Token"** (if it's your first time) or **"Copy"** if the token is already visible
3. **IMPORTANT:** Save this token securely - you'll need it for your `.env` file
4. ⚠️ **Never share this token publicly or commit it to version control**

### Configure Bot Settings

1. Scroll down to **"Privileged Gateway Intents"**
2. You don't need to enable any special intents for DM functionality
3. Under **"Bot Permissions"**, the bot only needs:
   - Send Messages (for DMs)

---

## Step 3: Configure Bot Permissions

The bot doesn't need to join any servers - it only sends DMs directly to users. However, users must:

1. Share a server with the bot, OR
2. Have previously received a DM from the bot (you can send them one manually first)

### Option A: Invite Bot to Your Server (Recommended)

This ensures the bot can DM users who are in the same server:

1. In the Developer Portal, go to **"OAuth2"** → **"URL Generator"**
2. Under **"SCOPES"**, select:
   - `bot`
3. Under **"BOT PERMISSIONS"**, select:
   - Send Messages
4. Copy the generated URL at the bottom
5. Paste the URL in your browser
6. Select the server you want to add the bot to
7. Click **"Authorize"**

---

## Step 4: Get Your Discord User ID

To receive DM notifications when VOD requests come in, you need your Discord User ID:

### Enable Developer Mode

1. Open Discord
2. Click the ⚙️ gear icon (User Settings) at the bottom left
3. Go to **"Advanced"** (under "App Settings")
4. Enable **"Developer Mode"**

### Copy Your User ID

1. Right-click your username/avatar anywhere in Discord
2. Click **"Copy User ID"** (this option only appears when Developer Mode is enabled)
3. Save this ID - you'll need it for your `.env` file

---

## Step 5: Configure Environment Variables

Add the following to your `.env` file:

```bash
# Discord Bot Integration
DISCORD_BOT_TOKEN=your_bot_token_from_step_2
ADMIN_DISCORD_USER_ID=your_user_id_from_step_4
```

### Example:

```bash
# Discord Bot Integration
DISCORD_BOT_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.GhOsT.FaKeToKeN1234567890aBcDeFgHiJkLmNoPqRsTuVwXyZ
ADMIN_DISCORD_USER_ID=123456789012345678
```

⚠️ **Security Note:** Never commit your actual `.env` file to version control. Only commit `.env.example` with placeholder values.

---

## Step 6: Test the Integration

### Test VOD Request Notifications

1. Make sure your `.env` file is properly configured
2. Restart your application to load the new environment variables
3. Submit a test replay through your website's replay submission form
4. You should receive a DM from your bot with the submission details

### Test Review Ready Notifications

1. In the admin panel, mark a submission as "COMPLETED"
2. Add a review URL (optional)
3. Check the **"Send Discord notification to user"** checkbox
4. Click **"Save Changes"**

**Important:** For users to receive notifications, they must:
- Have provided their Discord User ID in the `discordTag` field when submitting
- Either share a server with the bot OR have previously received a DM from it
- Have DMs enabled in their Discord privacy settings

---

## Troubleshooting

### Bot Can't Send DMs

**Problem:** Bot fails to send DMs to users

**Solutions:**
1. Ensure the bot shares a server with the user
2. Verify the user has DMs enabled in their privacy settings:
   - Server Settings → Privacy Settings → "Allow direct messages from server members"
3. The user's Discord ID must be correct (check for typos)

### Invalid Bot Token

**Problem:** "Invalid bot token" error in logs

**Solutions:**
1. Regenerate the bot token in the Developer Portal
2. Update your `.env` file with the new token
3. Restart the application

### User ID Not Working

**Problem:** Discord user ID doesn't work for receiving notifications

**Solutions:**
1. Make sure Developer Mode is enabled when copying the ID
2. Verify the ID is just numbers (no letters or special characters)
3. The ID should be 17-19 digits long

### Discord Tag Format Issues

**Problem:** Users can't receive notifications even with correct setup

**Solutions:**
1. For the `discordTag` field, users should provide their Discord User ID (not username)
2. You can instruct users to:
   - Enable Developer Mode
   - Right-click their own username
   - Copy their User ID
   - Paste it in the Discord Tag field when submitting replays

---

## How It Works

### Architecture

```
User Submits Replay
        ↓
    API Route (/api/replay/submit)
        ↓
    Discord Module (lib/discord.ts)
        ↓
    Discord Bot sends DM to admin
```

```
Admin Marks Review Complete
        ↓
    API Route (/api/admin/submissions/[id])
        ↓
    Discord Module (lib/discord.ts)
        ↓
    Discord Bot sends DM to user (if Discord ID provided)
```

### Message Contents

**VOD Request Notification (to Admin):**
- Submission ID
- Coaching Type
- User's email
- Discord tag (if provided)
- Rank, Role, Hero
- All replay codes with map names and notes
- Submission timestamp

**Review Ready Notification (to User):**
- Review completion notification
- Review video URL (if provided)
- Coach's notes (if provided)
- Review completion timestamp

### Privacy & Security

- Bot token is stored securely in environment variables
- Only users who provide their Discord ID will receive notifications
- The bot uses minimal permissions (only Send Messages for DMs)
- All Discord communication is direct messages (not public channels)

---

## Advanced Configuration

### Custom Message Formatting

You can customize the Discord message format by editing `/lib/discord.ts`:

- `sendVodRequestNotification()` - Admin notification format
- `sendReviewReadyNotification()` - User notification format

### Rate Limiting

Discord has rate limits for DMs:
- 5 DMs per 5 seconds to the same user
- This shouldn't be an issue for normal coaching operations

### Multiple Admins

To support multiple admins receiving notifications:

1. Create an array of admin user IDs in your `.env`:
   ```bash
   ADMIN_DISCORD_USER_IDS=123456789012345678,987654321098765432
   ```

2. Modify `sendVodRequestNotification()` to loop through all admin IDs

---

## Migrating from Email

If you're migrating from the old email system:

1. All email-related code has been removed
2. The `EmailLog` database table has been removed
3. The admin UI now shows "Send Discord notification" instead of "Send email notification"
4. Users can optionally provide their Discord ID for notifications

### Key Changes:

- ✅ Instant notifications via Discord DM
- ✅ No email service required (saves costs)
- ✅ Users receive notifications on Discord (where gamers already are)
- ✅ Direct communication channel with users
- ⚠️ Users must provide Discord ID to receive notifications
- ⚠️ Requires initial Discord bot setup

---

## Support

If you encounter issues:

1. Check the application logs for error messages
2. Verify all environment variables are set correctly
3. Ensure the bot is invited to a server you and your users share
4. Test with your own Discord account first

For Discord API documentation, visit: https://discord.com/developers/docs
