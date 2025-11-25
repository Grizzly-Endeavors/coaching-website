import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    gaId: process.env.NEXT_PUBLIC_GA_ID || 'NOT_SET',
    isConfigured: !!process.env.NEXT_PUBLIC_GA_ID,
    message: process.env.NEXT_PUBLIC_GA_ID
      ? 'Google Analytics is configured'
      : 'NEXT_PUBLIC_GA_ID environment variable is not set'
  });
}
