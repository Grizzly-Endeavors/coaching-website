# Discord Authentication Setup for Admin Panel

To enable Discord authentication for the Admin Panel, you must update your Discord Application settings in the [Discord Developer Portal](https://discord.com/developers/applications).

## ⚠️ Crucial: You need TWO Redirect URIs

To avoid confusion between the Booking system and the Admin Panel, we use a distinct URL for Admin Login.

You must have **BOTH** of these URLs in your Discord Developer Portal > OAuth2 > Redirects:

1.  **Booking/Submission URL** (For users):
    ```
    http://localhost:3001/api/auth/discord/callback
    ```

2.  **Admin Login URL** (For admins):
    ```
    http://localhost:3001/api/auth/callback/discord-admin
    ```
    *(Note the path ends in `discord-admin`)*

### Comparison

| Feature | Path | Purpose |
| :--- | :--- | :--- |
| Booking Page | `.../api/auth/discord/callback` | Public user submissions |
| **Admin Panel** | `.../api/auth/callback/discord-admin` | Admin Dashboard Access |

## Troubleshooting "Invalid OAuth2 redirect_uri"

If you see the "Invalid OAuth2 redirect_uri" error:

1.  Look at the URL in the error popup or address bar.
2.  Find the `redirect_uri` parameter.
3.  Decode it. It should look like:
    `http://localhost:3001/api/auth/callback/discord-admin`
4.  **Copy that EXACT URL** and add it to the Discord Developer Portal.
5.  **Save Changes.**

**Note:** If you deploy to production, you will need to add the production versions of both URLs as well.
