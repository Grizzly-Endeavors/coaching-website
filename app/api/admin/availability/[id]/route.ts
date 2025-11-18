import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6).optional(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  sessionType: z.enum(['vod-review', 'live-coaching']).optional(),
  slotDuration: z.number().optional(),
  isActive: z.boolean().optional(),
})

// PATCH /api/admin/availability/[id] - Update availability slot
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = updateSlotSchema.parse(body)

    // Check if slot exists
    const existingSlot = await prisma.availabilitySlot.findUnique({
      where: { id: params.id },
    })

    if (!existingSlot) {
      return NextResponse.json(
        { error: 'Availability slot not found' },
        { status: 404 }
      )
    }

    // If updating time, validate that end time is after start time
    const startTime = validatedData.startTime || existingSlot.startTime
    const endTime = validatedData.endTime || existingSlot.endTime

    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    if (endMinutes <= startMinutes) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      )
    }

    const slot = await prisma.availabilitySlot.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        exceptions: true,
      },
    })

    return NextResponse.json({ slot })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating availability slot:', error)
    return NextResponse.json(
      { error: 'Failed to update availability slot' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/availability/[id] - Delete availability slot
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if slot exists
    const existingSlot = await prisma.availabilitySlot.findUnique({
      where: { id: params.id },
      include: {
        exceptions: {
          where: {
            reason: 'booked',
            date: {
              gte: new Date(), // Only future bookings
            },
          },
        },
      },
    })

    if (!existingSlot) {
      return NextResponse.json(
        { error: 'Availability slot not found' },
        { status: 404 }
      )
    }

    // Check if there are future bookings
    if (existingSlot.exceptions.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete slot with future bookings',
          futureBookings: existingSlot.exceptions.length,
        },
        { status: 400 }
      )
    }

    await prisma.availabilitySlot.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting availability slot:', error)
    return NextResponse.json(
      { error: 'Failed to delete availability slot' },
      { status: 500 }
    )
  }
}
