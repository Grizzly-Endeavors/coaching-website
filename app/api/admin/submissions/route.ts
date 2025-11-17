import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { SubmissionStatus } from '@prisma/client';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Query parameters validation schema
const querySchema = z.object({
  status: z.nativeEnum(SubmissionStatus).optional(),
  sort: z.enum(['submittedAt', 'reviewedAt', 'status']).optional().default('submittedAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * GET /api/admin/submissions
 *
 * Fetch all replay submissions with optional filters
 *
 * Query Parameters:
 * - status: Filter by submission status (PENDING, IN_PROGRESS, COMPLETED, ARCHIVED)
 * - sort: Sort field (submittedAt, reviewedAt, status) - default: submittedAt
 * - order: Sort order (asc, desc) - default: desc
 *
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    await requireAuth();

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      status: searchParams.get('status') || undefined,
      sort: searchParams.get('sort') || undefined,
      order: searchParams.get('order') || undefined,
    };

    const validatedParams = querySchema.parse(queryParams);

    // Build query filter
    const where: { status?: SubmissionStatus } = {};
    if (validatedParams.status) {
      where.status = validatedParams.status;
    }

    // Fetch submissions from database
    const submissions = await prisma.replaySubmission.findMany({
      where,
      orderBy: {
        [validatedParams.sort]: validatedParams.order,
      },
      select: {
        id: true,
        email: true,
        discordTag: true,
        replayCode: true,
        rank: true,
        role: true,
        hero: true,
        notes: true,
        status: true,
        reviewNotes: true,
        reviewUrl: true,
        submittedAt: true,
        reviewedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
