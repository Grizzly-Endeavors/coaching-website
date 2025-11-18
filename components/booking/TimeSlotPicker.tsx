'use client'

import { useState, useEffect } from 'react'
import { format, addDays } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/Badge'

interface TimeSlot {
  datetime: string
  time: string
  date: string
}

interface AvailableSlotsResponse {
  availableSlots: TimeSlot[]
  message?: string
  debug?: {
    dayOfWeek: number
    configuredSlotsCount: number
    generatedSlotsCount: number
    exceptionsCount: number
    availableSlotsCount: number
  }
}

interface TimeSlotPickerProps {
  sessionType: 'vod-review' | 'live-coaching'
  onSelectSlot: (datetime: string | null) => void
  selectedSlot: string | null
}

export function TimeSlotPicker({ sessionType, onSelectSlot, selectedSlot }: TimeSlotPickerProps) {
  const [dayOffset, setDayOffset] = useState(0) // Which 3-day group we're viewing (0 = days 1-3, 1 = days 4-6, etc.)
  const [slotsData, setSlotsData] = useState<Record<string, TimeSlot[]>>({}) // Map of date -> slots
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate the 3 days to display
  const threeDays = Array.from({ length: 3 }, (_, i) => {
    const dayIndex = dayOffset * 3 + i + 1 // Start from tomorrow (day 1)
    return {
      date: addDays(new Date(), dayIndex),
      dateString: format(addDays(new Date(), dayIndex), 'yyyy-MM-dd'),
      dayName: format(addDays(new Date(), dayIndex), 'EEE'),
      dayNumber: format(addDays(new Date(), dayIndex), 'd'),
      month: format(addDays(new Date(), dayIndex), 'MMM'),
    }
  })

  useEffect(() => {
    fetchSlotsForDays()
  }, [dayOffset, sessionType])

  const fetchSlotsForDays = async () => {
    setLoading(true)
    setError(null)

    try {
      const newSlotsData: Record<string, TimeSlot[]> = {}

      // Fetch slots for each of the 3 days
      await Promise.all(
        threeDays.map(async (day) => {
          const response = await fetch(
            `/api/booking/available-slots?date=${day.dateString}&sessionType=${sessionType}`
          )

          if (response.ok) {
            const data: AvailableSlotsResponse = await response.json()
            newSlotsData[day.dateString] = data.availableSlots || []
          } else {
            newSlotsData[day.dateString] = []
          }
        })
      )

      setSlotsData(newSlotsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSlotClick = (datetime: string) => {
    if (selectedSlot === datetime) {
      onSelectSlot(null)
    } else {
      onSelectSlot(datetime)
    }
  }

  const isSlotSelected = (datetime: string) => {
    return selectedSlot === datetime
  }

  const goToPreviousWeek = () => {
    if (dayOffset > 0) {
      setDayOffset(dayOffset - 1)
    }
  }

  const goToNextWeek = () => {
    setDayOffset(dayOffset + 1)
  }

  const getSessionTypeLabel = () => {
    return sessionType === 'vod-review' ? 'VOD Review' : 'Live Coaching'
  }

  const hasAnySlots = Object.values(slotsData).some(daySlots => daySlots.length > 0);

  return (
    <Card className="bg-[#1a1a2e] border-[#2a2a40]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-xl">Select Appointment Time</CardTitle>
          <Badge className={sessionType === 'vod-review' ? 'bg-blue-600' : 'bg-purple-600'}>
            {getSessionTypeLabel()}
          </Badge>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          All times shown in EST timezone
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Navigation Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a40] pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousWeek}
            disabled={dayOffset === 0 || loading}
            className="text-gray-400 hover:text-white disabled:opacity-30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>

          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {threeDays.length > 0 && format(threeDays[0].date, 'MMMM yyyy')}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextWeek}
            disabled={loading}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>

        {/* Time Slots Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
            <p className="text-gray-400 mt-3">Loading available times...</p>
          </div>
        ) : hasAnySlots ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {threeDays.map((day) => (
              <div key={day.dateString} className="flex flex-col">
                <div className="text-center mb-4">
                  <div className="text-xs text-gray-500 uppercase">{day.dayName}</div>
                  <div className="text-2xl font-bold text-white">{day.dayNumber}</div>
                  <div className="text-xs text-gray-400">{day.month}</div>
                </div>
                <div className="flex flex-col gap-2">
                  {slotsData[day.dateString] && slotsData[day.dateString].length > 0 ? (
                    slotsData[day.dateString]
                      .sort((a, b) => a.datetime.localeCompare(b.datetime))
                      .map((slot) => (
                        <button
                          key={slot.datetime}
                          type="button"
                          onClick={() => handleSlotClick(slot.datetime)}
                          className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            isSlotSelected(slot.datetime)
                              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                              : 'bg-[#0f0f23] text-gray-300 border border-[#2a2a40] hover:border-purple-500 hover:bg-[#1a1a2e]'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))
                  ) : (
                    <div className="text-center text-gray-500 text-sm h-full flex items-center justify-center border border-dashed border-[#2a2a40] rounded-lg p-4">
                      No slots
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#0f0f23] rounded-lg border border-[#2a2a40]">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 font-medium mb-2">
              No availability for these dates
            </p>
            <p className="text-gray-500 text-sm">
              Try navigating to different dates or check back later
            </p>
          </div>
        )}

        {/* Selected Slot Display */}
        {selectedSlot && (
          <Alert className="bg-purple-900/30 border-purple-700">
            <AlertDescription className="text-purple-100 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>
                <strong>Selected:</strong> {format(new Date(selectedSlot), 'EEEE, MMMM d')} at {format(new Date(selectedSlot), 'h:mm a')} EST
              </span>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
