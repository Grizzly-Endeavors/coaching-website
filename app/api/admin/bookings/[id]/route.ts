import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { BookingStatus } from '@prisma/client';
import { handleApiError } from '@/lib/api-error-handler';
import { adminBookingUpdateSchema } from '@/lib/validations';

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    await requireAuth();

    const { id } = await params;

    // Parse and validate request body
    const body = await request.json();
    const validatedData = adminBookingUpdateSchema.parse(body);

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
    return handleApiError(error, 'updating booking');
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    await requireAuth();

    const { id } = await params;

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
    return handleApiError(error, 'fetching booking');
  }
}
