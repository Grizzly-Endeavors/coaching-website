'use client'

import { useState, useEffect } from 'react'
import { format, addDays, parse } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface TimeSlot {
  datetime: string
  time: string
  date: string
}

interface TimeSlotPickerProps {
  sessionType: 'vod-review' | 'live-coaching'
  onSelectSlot: (datetime: string | null) => void
  selectedSlot: string | null
}

export function TimeSlotPicker({ sessionType, onSelectSlot, selectedSlot }: TimeSlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate min and max dates (today to 14 days from now)
  const today = new Date()
  const maxDate = addDays(today, 14)

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots()
    } else {
      setAvailableSlots([])
    }
  }, [selectedDate, sessionType])

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return

    setLoading(true)
    setError(null)

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const response = await fetch(
        `/api/booking/available-slots?date=${dateStr}&sessionType=${sessionType}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch available slots')
      }

      const data = await response.json()
      setAvailableSlots(data.availableSlots || [])

      // If the currently selected slot is not available anymore, clear it
      if (selectedSlot && !data.availableSlots.some((s: TimeSlot) => s.datetime === selectedSlot)) {
        onSelectSlot(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setAvailableSlots([])
    } finally {
      setLoading(false)
    }
  }

  const handleSlotClick = (datetime: string) => {
    if (selectedSlot === datetime) {
      onSelectSlot(null) // Deselect if clicking the same slot
    } else {
      onSelectSlot(datetime)
    }
  }

  const isSlotSelected = (datetime: string) => {
    return selectedSlot === datetime
  }

  const getSessionTypeLabel = () => {
    return sessionType === 'vod-review' ? 'VOD Review' : 'Live Coaching'
  }

  return (
    <Card className="bg-[#1a1a2e] border-[#2a2a40]">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Select Appointment Time</span>
          <Badge className={sessionType === 'vod-review' ? 'bg-blue-600' : 'bg-purple-600'}>
            {getSessionTypeLabel()}
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-400 mt-2">
          All times are in EST timezone. Available within the next 14 days.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) =>
              date < today || date > maxDate
            }
            className="rounded-md border border-[#2a2a40] bg-[#0f0f23]"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center text-white",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-purple-600 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal text-white hover:bg-[#2a2a40] rounded-md transition-colors",
              day_selected: "bg-purple-600 text-white hover:bg-purple-700",
              day_today: "bg-[#2a2a40] text-white",
              day_outside: "text-gray-600 opacity-50",
              day_disabled: "text-gray-600 opacity-50",
              day_hidden: "invisible",
            }}
          />
        </div>

        {/* Available Time Slots */}
        {selectedDate && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Available times for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                <p className="text-gray-400 mt-2">Loading available times...</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.datetime}
                    variant={isSlotSelected(slot.datetime) ? 'default' : 'outline'}
                    className={
                      isSlotSelected(slot.datetime)
                        ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                        : 'border-[#2a2a40] text-white hover:bg-[#2a2a40] hover:text-white'
                    }
                    onClick={() => handleSlotClick(slot.datetime)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-[#0f0f23] rounded-lg border border-[#2a2a40]">
                <p className="text-gray-400">
                  No available time slots for this date.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Please select a different date.
                </p>
              </div>
            )}
          </div>
        )}

        {!selectedDate && (
          <div className="text-center py-8 bg-[#0f0f23] rounded-lg border border-[#2a2a40]">
            <p className="text-gray-400">
              Select a date from the calendar to see available times
            </p>
          </div>
        )}

        {selectedSlot && (
          <Alert className="bg-green-900 border-green-700">
            <AlertDescription className="text-green-100">
              Selected: {format(new Date(selectedSlot), 'EEEE, MMMM d, yyyy \'at\' h:mm a')} EST
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
