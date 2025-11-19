import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { availabilitySlotSchema } from '@/lib/validations'

// GET /api/admin/availability - List all availability slots
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated as admin
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const sessionType = searchParams.get('sessionType')
    const isActive = searchParams.get('isActive')

    const slots = await prisma.availabilitySlot.findMany({
      where: {
        ...(sessionType && { sessionType }),
        ...(isActive !== null && { isActive: isActive === 'true' }),
      },
      include: {
        exceptions: {
          where: {
            date: {
              gte: new Date(), // Only future exceptions
            },
          },
          orderBy: {
            date: 'asc',
          },
        },
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    })

    return NextResponse.json({ slots })
  } catch (error) {
    logger.error('Error fetching availability slots:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: 'Failed to fetch availability slots' },
      { status: 500 }
    )
  }
}

// POST /api/admin/availability - Create new availability slot
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated as admin
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = availabilitySlotSchema.parse(body)

    // Validate that end time is after start time
    const [startHour, startMin] = validatedData.startTime.split(':').map(Number)
    const [endHour, endMin] = validatedData.endTime.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    if (endMinutes <= startMinutes) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      )
    }

    // Check for overlapping slots on the same day and session type
    const existingSlots = await prisma.availabilitySlot.findMany({
      where: {
        dayOfWeek: validatedData.dayOfWeek,
        sessionType: validatedData.sessionType,
        isActive: true,
      },
    })

    for (const slot of existingSlots) {
      const [slotStartHour, slotStartMin] = slot.startTime.split(':').map(Number)
      const [slotEndHour, slotEndMin] = slot.endTime.split(':').map(Number)
      const slotStartMinutes = slotStartHour * 60 + slotStartMin
      const slotEndMinutes = slotEndHour * 60 + slotEndMin

      // Check for overlap
      if (
        (startMinutes >= slotStartMinutes && startMinutes < slotEndMinutes) ||
        (endMinutes > slotStartMinutes && endMinutes <= slotEndMinutes) ||
        (startMinutes <= slotStartMinutes && endMinutes >= slotEndMinutes)
      ) {
        return NextResponse.json(
          { error: 'This time slot overlaps with an existing slot' },
          { status: 400 }
        )
      }
    }

    const slot = await prisma.availabilitySlot.create({
      data: validatedData,
    })

    return NextResponse.json({ slot }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    logger.error('Error creating availability slot:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: 'Failed to create availability slot' },
      { status: 500 }
    )
  }
}
