import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { createExceptionSchema } from '@/lib/validations'

// GET /api/admin/availability/exceptions - List all exceptions
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const reason = searchParams.get('reason')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const exceptions = await prisma.availabilityException.findMany({
      where: {
        ...(reason && { reason }),
        ...(startDate && {
          date: {
            gte: new Date(startDate),
          },
        }),
        ...(endDate && {
          endDate: {
            lte: new Date(endDate),
          },
        }),
      },
      include: {
        slot: true,
        booking: {
          include: {
            submission: {
              include: {
                replays: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json({ exceptions })
  } catch (error) {
    logger.error('Error fetching availability exceptions:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: 'Failed to fetch availability exceptions' },
      { status: 500 }
    )
  }
}

// POST /api/admin/availability/exceptions - Create new exception (block time)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createExceptionSchema.parse(body)

    // Validate that endDate is after date
    const startDate = new Date(validatedData.date)
    const endDate = new Date(validatedData.endDate)

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // If slotId is provided, verify it exists
    if (validatedData.slotId) {
      const slot = await prisma.availabilitySlot.findUnique({
        where: { id: validatedData.slotId },
      })

      if (!slot) {
        return NextResponse.json(
          { error: 'Availability slot not found' },
          { status: 404 }
        )
      }
    }

    // Check for conflicting bookings in this time range
    const conflictingBookings = await prisma.availabilityException.findMany({
      where: {
        reason: 'booked',
        date: {
          lt: endDate,
        },
        endDate: {
          gt: startDate,
        },
      },
      include: {
        booking: true,
      },
    })

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot block time with existing bookings',
          conflictingBookings: conflictingBookings.map((e) => ({
            date: e.date,
            email: e.booking?.email,
          })),
        },
        { status: 400 }
      )
    }

    const exception = await prisma.availabilityException.create({
      data: {
        date: startDate,
        endDate: endDate,
        reason: validatedData.reason,
        notes: validatedData.notes,
        ...(validatedData.slotId && { slotId: validatedData.slotId }),
      },
      include: {
        slot: true,
      },
    })

    return NextResponse.json({ exception }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    logger.error('Error creating availability exception:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: 'Failed to create availability exception' },
      { status: 500 }
    )
  }
}
