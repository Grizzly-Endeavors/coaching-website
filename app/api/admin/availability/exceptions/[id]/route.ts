import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// DELETE /api/admin/availability/exceptions/[id] - Delete availability exception
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params;
    // Check if exception exists
    const existingException = await prisma.availabilityException.findUnique({
      where: { id },
      include: {
        booking: true,
      },
    })

    if (!existingException) {
      return NextResponse.json(
        { error: 'Availability exception not found' },
        { status: 404 }
      )
    }

    // Prevent deletion of booked exceptions (those would need to be cancelled through booking system)
    if (existingException.reason === 'booked' && existingException.booking) {
      return NextResponse.json(
        {
          error: 'Cannot delete booked exception. Cancel the booking instead.',
          bookingId: existingException.booking.id,
        },
        { status: 400 }
      )
    }

    await prisma.availabilityException.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    logger.error('Error deleting availability exception:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: 'Failed to delete availability exception' },
      { status: 500 }
    )
  }
}
