import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { BookingStatus } from '@prisma/client';

// Query parameters validation schema
const querySchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  sort: z.enum(['scheduledAt', 'createdAt', 'updatedAt']).optional().default('scheduledAt'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
  upcoming: z.enum(['true', 'false']).optional(),
});

/**
 * GET /api/admin/bookings
 *
 * Fetch all bookings from database with optional filters
 *
 * Query Parameters:
 * - status: Filter by booking status (SCHEDULED, COMPLETED, CANCELLED, NO_SHOW)
 * - sort: Sort field (scheduledAt, createdAt, updatedAt) - default: scheduledAt
 * - order: Sort order (asc, desc) - default: asc
 * - upcoming: Filter for upcoming bookings only ('true', 'false')
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
      upcoming: searchParams.get('upcoming') || undefined,
    };

    const validatedParams = querySchema.parse(queryParams);

    // Build query filter
    const where: {
      status?: BookingStatus;
      scheduledAt?: { gte: Date };
    } = {};

    if (validatedParams.status) {
      where.status = validatedParams.status;
    }

    // Filter for upcoming bookings only
    if (validatedParams.upcoming === 'true') {
      where.scheduledAt = { gte: new Date() };
    }

    // Fetch bookings from database
    const bookings = await prisma.booking.findMany({
      where,
      orderBy: {
        [validatedParams.sort]: validatedParams.order,
      },
      select: {
        id: true,
        email: true,
        googleEventId: true,
        sessionType: true,
        scheduledAt: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Add computed fields for better UX
    const bookingsWithMeta = bookings.map((booking) => ({
      ...booking,
      isPast: booking.scheduledAt < new Date(),
      isUpcoming: booking.scheduledAt >= new Date(),
    }));

    return NextResponse.json({
      success: true,
      count: bookingsWithMeta.length,
      bookings: bookingsWithMeta,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);

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
