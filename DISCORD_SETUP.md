# Discord Integration Setup Guide

This guide will walk you through setting up Discord integration for your coaching website. The integration uses **two methods** for maximum flexibility:

1. **Discord Bot** - For admin notifications when VODs are requested
2. **Discord OAuth** - For user notifications without requiring a shared server (RECOMMENDED for users)

## Why Two Methods?

- **Bot Method**: Simple, reliable for admin notifications. Requires users to be in a shared server.
- **OAuth Method**: Better user experience! Users click "Connect Discord" and receive notifications without joining any server.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Part 1: Discord Application & Bot Setup](#part-1-discord-application--bot-setup)
- [Part 2: OAuth Configuration](#part-2-oauth-configuration)
- [Part 3: Environment Variables](#part-3-environment-variables)
- [Part 4: Database Migration](#part-4-database-migration)
- [Part 5: Frontend Integration](#part-5-frontend-integration)
- [Part 6: Testing](#part-6-testing)
- [Troubleshooting](#troubleshooting)
- [How It Works](#how-it-works)

---

## Prerequisites

- A Discord account
- Access to the [Discord Developer Portal](https://discord.com/developers/applications)
- Admin access to your coaching website server
- Node.js and npm installed

---

## Part 1: Discord Application & Bot Setup

### Step 1.1: Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"** in the top right
3. Give your application a name (e.g., "Overwatch Coaching Bot")
4. Click **"Create"**

### Step 1.2: Create a Discord Bot

1. In your application dashboard, click **"Bot"** in the left sidebar
2. Click **"Add Bot"**
3. Confirm by clicking **"Yes, do it!"**

### Step 1.3: Get Your Bot Token

1. Under the bot's username, you'll see a **"TOKEN"** section
2. Click **"Reset Token"** (if it's your first time) or **"Copy"** if visible
3. **IMPORTANT:** Save this token securely - you'll need it for `DISCORD_BOT_TOKEN`
4. ⚠️ **Never share this token publicly or commit it to version control**

### Step 1.4: Get Your Discord User ID

To receive DMs when VOD requests come in:

1. Open Discord
2. Click the ⚙️ gear icon (User Settings) at the bottom left
3. Go to **"Advanced"** (under "App Settings")
4. Enable **"Developer Mode"**
5. Close settings, right-click your username/avatar anywhere in Discord
6. Click **"Copy User ID"**
7. Save this ID - you'll need it for `ADMIN_DISCORD_USER_ID`

### Step 1.5: Invite Bot to Your Server (Optional)

This is optional but recommended for admin notifications:

1. In the Developer Portal, go to **"OAuth2"** → **"URL Generator"**
2. Under **"SCOPES"**, select:
   - `bot`
3. Under **"BOT PERMISSIONS"**, select:
   - Send Messages
4. Copy the generated URL at the bottom
5. Paste the URL in your browser
6. Select your server and click **"Authorize"**

---

## Part 2: OAuth Configuration

OAuth allows users to connect their Discord account without joining any server. They just click "Connect Discord" on your website!

### Step 2.1: Enable OAuth2

1. In your Discord application dashboard, click **"OAuth2"** → **"General"** in the left sidebar
2. Note your **Client ID** - you'll need this for `DISCORD_CLIENT_ID`
3. Click **"Reset Secret"** to generate a **Client Secret**
4. **IMPORTANT:** Copy and save this secret - you'll need it for `DISCORD_CLIENT_SECRET`
5. ⚠️ **Never share this secret publicly**

### Step 2.2: Add Redirect URLs

1. Still in **"OAuth2"** → **"General"**, scroll to **"Redirects"**
2. Add the following redirect URLs:
   - Development: `http://localhost:3000/api/auth/discord/callback`
   - Production: `https://yourdomain.com/api/auth/discord/callback`
3. Click **"Save Changes"**

---

## Part 3: Environment Variables

Add the following to your `.env` file:

```bash
# Discord Bot Integration
DISCORD_BOT_TOKEN=your_bot_token_from_step_1.3
ADMIN_DISCORD_USER_ID=your_user_id_from_step_1.4

# Discord OAuth (for user notifications without server requirement)
DISCORD_CLIENT_ID=your_client_id_from_step_2.1
DISCORD_CLIENT_SECRET=your_client_secret_from_step_2.1

# Redirect URI (update for production)
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord/callback
```

### Example:

```bash
# Discord Bot Integration
DISCORD_BOT_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.GhOsT.FaKeToKeN1234567890aBcDeFgHiJkLmNoPqRsTuVwXyZ
ADMIN_DISCORD_USER_ID=123456789012345678

# Discord OAuth
DISCORD_CLIENT_ID=1234567890123456789
DISCORD_CLIENT_SECRET=aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord/callback
```

⚠️ **Security Note:** Never commit your actual `.env` file to version control.

---

## Part 4: Database Migration

The OAuth feature requires new database fields to store Discord tokens.

### Step 4.1: Run the Migration

```bash
npx prisma migrate dev --name add_discord_oauth
```

This will add the following fields to `ReplaySubmission`:
- `discordId` - User's Discord ID from OAuth
- `discordUsername` - Discord username for display
- `discordAccessToken` - OAuth access token (auto-refreshed)
- `discordRefreshToken` - OAuth refresh token
- `discordTokenExpiry` - When the access token expires

### Step 4.2: Generate Prisma Client

```bash
npx prisma generate
```

---

## Part 5: Frontend Integration

### Step 5.1: Import the Component

The `DiscordConnect` component is already created at `components/DiscordConnect.tsx`.

### Step 5.2: Use in Your Forms

Add the Discord connection component to your replay submission form:

```tsx
import DiscordConnect from '@/components/DiscordConnect';

export default function ReplaySubmissionForm() {
  return (
    <form>
      {/* Your other form fields */}

      {/* Add Discord connection */}
      <DiscordConnect
        returnTo="/submit-replay"
        className="mb-6"
      />

      {/* Submit button */}
    </form>
  );
}
```

The component handles everything automatically:
- Checks connection status
- Initiates OAuth flow
- Shows connected username
- Allows disconnection

---

## Part 6: Testing

### Test Admin Notifications (Bot Method)

1. Make sure your `.env` file has `DISCORD_BOT_TOKEN` and `ADMIN_DISCORD_USER_ID`
2. Restart your application
3. Submit a test replay through your website
4. You should receive a DM from your bot with submission details

### Test User Notifications (OAuth Method)

1. Visit your replay submission page
2. Click "Connect Discord"
3. Authorize the application
4. Submit a replay (you'll be logged in via OAuth)
5. Go to admin panel and mark the submission as "COMPLETED"
6. Check "Send Discord notification"
7. Save - you should receive a DM!

**No shared server required!** 🎉

---

## Troubleshooting

### Bot Can't Send DMs

**Problem:** Bot fails to send DMs to admin

**Solutions:**
1. Verify `DISCORD_BOT_TOKEN` is correct
2. Ensure `ADMIN_DISCORD_USER_ID` is your actual user ID (not username)
3. Check bot is online in Developer Portal

### OAuth: Invalid Redirect URI

**Problem:** "redirect_uri_mismatch" error during OAuth

**Solutions:**
1. Verify redirect URI in `.env` matches exactly what's in Developer Portal
2. For production, update `DISCORD_REDIRECT_URI` to your domain
3. Make sure you added the redirect URI in **OAuth2** → **General** → **Redirects**

### OAuth: User Can't Receive Notifications

**Problem:** OAuth connected but notifications not received

**Solutions:**
1. Check user's Discord privacy settings allow DMs
2. Verify token hasn't expired (auto-refreshed, but check logs)
3. User may have DMs disabled - ask them to enable in Privacy Settings

### Token Refresh Failed

**Problem:** "Token refresh failed" in logs

**Solutions:**
1. Verify `DISCORD_CLIENT_SECRET` is correct
2. Check if user revoked app authorization in Discord settings
3. User may need to reconnect Discord

---

## How It Works

### Architecture

```
┌─────────────────┐
│  User submits   │
│  replay         │
└────────┬────────┘
         │
         ├─────> Admin DM (via Bot)
         │
         └─────> Save OAuth tokens to DB
                 (if user connected Discord)

┌─────────────────┐
│  Admin marks    │
│  review ready   │
└────────┬────────┘
         │
         ├─────> Check if user has OAuth tokens
         │
         ├─────> Try OAuth DM (no server needed!)
         │       ├─> Success! ✓
         │       └─> Failed? Fall back to bot method
         │
         └─────> Fallback: Bot DM (requires shared server)
```

### Token Management

**Access Token Lifecycle:**
1. User connects Discord → Receive access token (valid ~7 days)
2. Token saved to database with expiry time
3. When sending notification:
   - Check if token expired
   - If expired → Auto-refresh using refresh token
   - Update database with new tokens
   - Send DM with fresh token

**Benefits:**
- Users never need to reconnect
- Tokens refresh automatically
- No manual token management

### Notification Priority

When sending user notifications:

1. **PRIORITY 1:** OAuth method (if user connected)
   - No server requirement
   - Always works
   - Automatic token refresh

2. **PRIORITY 2:** Bot method (fallback)
   - Requires shared server
   - Uses Discord bot
   - More restrictive

---

## Advanced Configuration

### Custom Messages

Edit `/lib/discord.ts` to customize message formats:

```typescript
// Admin notification (line ~151)
const message = `🎮 **New VOD Review Request**
...

// User notification (line ~305)
const message = `🎉 **Your Review is Ready!**
...
```

### Rate Limiting

Discord API limits:
- **DMs**: 5 per 5 seconds to same user
- **OAuth requests**: 1000 per 10 minutes

Normal coaching operations won't hit these limits.

### Multiple Admins

To support multiple admins:

```bash
# In .env, comma-separated IDs
ADMIN_DISCORD_USER_IDS=123456789012345678,987654321098765432
```

Then update `sendVodRequestNotification()` to loop through IDs.

### Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` to git
   - Use different tokens for dev/prod
   - Rotate tokens periodically

2. **Token Storage:**
   - Tokens are stored in database (consider encryption)
   - Cookies are HTTP-only and secure in production
   - OAuth state prevents CSRF attacks

3. **User Privacy:**
   - Only collect Discord ID & username
   - Clear cookies on disconnect
   - Users can revoke in Discord settings

---

## Migration from Email

### Key Changes:

✅ **Before:** Users provided email, received email notifications
✅ **After:** Users connect Discord, receive Discord DMs

### Data:

- `discordTag` field still exists for backward compatibility
- New OAuth fields are optional
- Old submissions without OAuth use bot method

### Benefits:

- 💰 **Free:** No email service costs
- 🚀 **Instant:** DMs are immediate
- 🎮 **Native:** Gamers already use Discord
- 🔧 **Simple:** No email server configuration
- 🌐 **Universal:** Works without shared servers (OAuth)

---

## FAQ

**Q: Do users need to join a Discord server?**
A: Not with OAuth! They just click "Connect Discord" on your website.

**Q: What if a user doesn't connect Discord?**
A: They won't receive notifications. Consider keeping email as an option or making Discord connection required.

**Q: Can I use both bot and OAuth?**
A: Yes! The system automatically uses OAuth (preferred) and falls back to bot method if needed.

**Q: How long do OAuth tokens last?**
A: Access tokens expire after ~7 days but are automatically refreshed using the refresh token.

**Q: What happens if a user revokes access?**
A: They'll need to reconnect Discord. The system will gracefully fail and log the error.

**Q: Is this secure?**
A: Yes! Tokens are stored securely, cookies are HTTP-only, and OAuth flow uses CSRF protection (state parameter).

---

## Support

For Discord API documentation: https://discord.com/developers/docs

For Discord OAuth documentation: https://discord.com/developers/docs/topics/oauth2

If you encounter issues:
1. Check application logs for error messages
2. Verify all environment variables are set correctly
3. Test with your own Discord account first
4. Check Discord Developer Portal for application status

---

**Congratulations!** Your Discord integration with OAuth is now set up. Users can connect their Discord with one click and receive notifications without joining any server! 🎉
