import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { BookingStatus } from '@prisma/client';
import { logger } from '@/lib/logger';

// Validation schema for PATCH request body
const updateSchema = z.object({
  status: z.nativeEnum(BookingStatus),
  notes: z.string().optional().or(z.literal('')),
});

/**
 * PATCH /api/admin/bookings/[id]
 *
 * Update a booking's status
 *
 * Request body:
 * - status: BookingStatus (SCHEDULED, COMPLETED, CANCELLED, NO_SHOW) - required
 * - notes: string (optional) - Additional notes about the booking
 *
 * Requires authentication
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    await requireAuth();

    const { id } = params;

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: {
      status: BookingStatus;
      notes?: string | null;
    } = {
      status: validatedData.status,
    };

    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes || null;
    }

    // Update booking in database
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        sessionType: true,
        scheduledAt: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (error) {
    logger.error('Error updating booking', error instanceof Error ? error : new Error(String(error)));

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
          error: 'Invalid request data',
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

/**
 * GET /api/admin/bookings/[id]
 *
 * Fetch a single booking by ID
 *
 * Requires authentication
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    await requireAuth();

    const { id } = params;

    // Fetch booking from database
    const booking = await prisma.booking.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        sessionType: true,
        scheduledAt: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    logger.error('Error fetching booking', error instanceof Error ? error : new Error(String(error)));

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
