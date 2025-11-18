import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE /api/admin/availability/exceptions/[id] - Delete availability exception
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if exception exists
    const existingException = await prisma.availabilityException.findUnique({
      where: { id: params.id },
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
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting availability exception:', error)
    return NextResponse.json(
      { error: 'Failed to delete availability exception' },
      { status: 500 }
    )
  }
}
