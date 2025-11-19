import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { updateSlotSchema } from '@/lib/validations'

// PATCH /api/admin/availability/[id] - Update availability slot
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params;
    const body = await req.json()
    const validatedData = updateSlotSchema.parse(body)

    // Check if slot exists
    const existingSlot = await prisma.availabilitySlot.findUnique({
      where: { id },
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
      where: { id },
      data: validatedData,
      include: {
        exceptions: true,
      },
    })

    return NextResponse.json({ slot })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    logger.error('Error updating availability slot:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: 'Failed to update availability slot' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/availability/[id] - Delete availability slot
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params;
    // Check if slot exists
    const existingSlot = await prisma.availabilitySlot.findUnique({
      where: { id },
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
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    logger.error('Error deleting availability slot:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: 'Failed to delete availability slot' },
      { status: 500 }
    )
  }
}
