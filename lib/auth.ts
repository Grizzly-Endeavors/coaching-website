import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Discord from 'next-auth/providers/discord';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';
import { loginRateLimiter } from './rate-limiter';
import { logger } from './logger';
import { loginSchema } from './validations';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Discord({
      id: 'discord-admin',
      name: 'Discord Admin',
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, request) {
        try {
          // Validate input
          const { email, password } = loginSchema.parse(credentials);

          // Rate limiting check
          // Note: In NextAuth v5, we use the email as identifier for rate limiting
          // For IP-based limiting, this would need to be implemented at the API route level
          const normalizedEmail = email.toLowerCase();
          const { isLimited, remaining } = loginRateLimiter.check(normalizedEmail);

          if (isLimited) {
            logger.warn('Login rate limit exceeded', {
              email: normalizedEmail,
            });
            return null;
          }

          // Find admin user
          const admin = await prisma.admin.findUnique({
            where: { email: normalizedEmail },
          });

          if (!admin) {
            // Failed login attempt - don't leak user existence
            return null;
          }

          // Verify password
          const passwordMatch = await compare(password, admin.password);

          if (!passwordMatch) {
            // Failed login attempt
            return null;
          }

          // Successful login - reset rate limit for this email
          loginRateLimiter.reset(normalizedEmail);

          // Return user object
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
          };
        } catch (error) {
          logger.error('Authorization error', error instanceof Error ? error : new Error(String(error)));
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'discord-admin') {
        if (!user.email) return false;

        try {
          const admin = await prisma.admin.findUnique({
            where: { email: user.email.toLowerCase() },
          });
          return !!admin;
        } catch (error) {
          logger.error('Error checking admin status for Discord login', error instanceof Error ? error : new Error(String(error)));
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;

        // If logging in with Discord, map to the Admin ID
        if (account?.provider === 'discord-admin' && user.email) {
          try {
            const admin = await prisma.admin.findUnique({
              where: { email: user.email.toLowerCase() },
            });
            if (admin) {
              token.id = admin.id;
            }
          } catch (error) {
            logger.error('Error mapping Discord user to Admin ID', error instanceof Error ? error : new Error(String(error)));
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

/**
 * Helper function to check if user is authenticated
 * Use this in API routes to protect endpoints
 */
export async function getAuthSession() {
  return await auth();
}

/**
 * Helper function to require authentication
 * Throws error if not authenticated
 */
export async function requireAuth() {
  const session = await getAuthSession();

  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  return session;
}
