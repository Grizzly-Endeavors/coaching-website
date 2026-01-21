import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  // Require authentication to access debug endpoint
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    gaId: process.env.NEXT_PUBLIC_GA_ID || 'NOT_SET',
    isConfigured: !!process.env.NEXT_PUBLIC_GA_ID,
    message: process.env.NEXT_PUBLIC_GA_ID
      ? 'Google Analytics is configured'
      : 'NEXT_PUBLIC_GA_ID environment variable is not set'
  });
}
