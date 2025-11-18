import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addMinutes, format, parse, startOfDay, endOfDay, isBefore, isAfter } from 'date-fns'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'

const TIMEZONE = 'America/New_York' // EST

// GET /api/booking/available-slots?date=YYYY-MM-DD&sessionType=vod-review
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get('date')
    const sessionType = searchParams.get('sessionType')

    if (!dateParam) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    if (!sessionType || !['vod-review', 'live-coaching'].includes(sessionType)) {
      return NextResponse.json(
        { error: 'Valid sessionType parameter is required (vod-review or live-coaching)' },
        { status: 400 }
      )
    }

    // Parse the date string as YYYY-MM-DD in EST timezone
    // This ensures we're working with the correct day in EST
    const dateParts = dateParam.split('-').map(Number)
    const dateInEST = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 0, 0, 0)
    const dayOfWeek = dateInEST.getDay() // 0 = Sunday, 6 = Saturday

    // Get all active availability slots for this day of week (both session types)
    const availabilitySlots = await prisma.availabilitySlot.findMany({
      where: {
        dayOfWeek,
        isActive: true,
      },
    })

    if (availabilitySlots.length === 0) {
      return NextResponse.json({
        availableSlots: [],
        message: 'No availability configured for this day and session type',
        date: dateParam,
        dayOfWeek,
        sessionType,
        timezone: TIMEZONE,
      })
    }

    // Generate all possible time slots from availability
    const possibleSlots: Date[] = []

    for (const slot of availabilitySlots) {
      const [startHour, startMin] = slot.startTime.split(':').map(Number)
      const [endHour, endMin] = slot.endTime.split(':').map(Number)

      // Create datetime objects for this specific date in EST
      let currentSlot = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], startHour, startMin, 0)
      const endTime = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], endHour, endMin, 0)

      // Generate slots until we reach the end time
      while (currentSlot < endTime) {
        possibleSlots.push(new Date(currentSlot))
        currentSlot = addMinutes(currentSlot, slot.slotDuration)
      }
    }

    // Get all exceptions (blocked times and bookings) for this date
    // Create date range that covers the full day in EST
    const dayStart = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 0, 0, 0)
    const dayEnd = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 23, 59, 59)

    const exceptions = await prisma.availabilityException.findMany({
      where: {
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    })

    // Filter out slots that are:
    // 1. In the past
    // 2. Blocked by exceptions
    const now = new Date()
    const availableSlots = possibleSlots.filter((slot) => {
      // Skip past slots (with a 15-minute buffer to prevent booking slots that are starting soon)
      const slotWithBuffer = addMinutes(slot, -15)
      if (isBefore(slotWithBuffer, now)) {
        return false
      }

      // Check if this slot conflicts with any exception
      const slotEnd = addMinutes(slot, 60) // Assuming 60-minute sessions

      for (const exception of exceptions) {
        const exceptionStart = new Date(exception.date)
        const exceptionEnd = new Date(exception.endDate)

        // Check for overlap: slot starts before exception ends AND slot ends after exception starts
        if (isBefore(slot, exceptionEnd) && isAfter(slotEnd, exceptionStart)) {
          return false // This slot is blocked
        }
      }

      return true
    })

    // Format the slots for the response
    const formattedSlots = availableSlots.map((slot) => ({
      datetime: slot.toISOString(),
      time: format(slot, 'h:mm a'),
      date: format(slot, 'yyyy-MM-dd'),
    }))

    return NextResponse.json({
      availableSlots: formattedSlots,
      date: dateParam,
      sessionType,
      timezone: TIMEZONE,
      debug: {
        dayOfWeek,
        configuredSlotsCount: availabilitySlots.length,
        generatedSlotsCount: possibleSlots.length,
        exceptionsCount: exceptions.length,
        availableSlotsCount: formattedSlots.length,
      }
    })
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available slots', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
