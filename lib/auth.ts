import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';
import { z } from 'zod';
import { loginRateLimiter } from './rate-limit';

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

// Validation schema for login credentials
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
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
            console.warn(`Rate limit exceeded for email: ${normalizedEmail}`);
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
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
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
