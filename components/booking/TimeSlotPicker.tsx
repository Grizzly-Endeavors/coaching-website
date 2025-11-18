'use client'

import { useState, useEffect } from 'react'
import { format, addDays } from 'date-fns'
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
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate next 14 days for the dropdown
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i)
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEEE, MMMM d, yyyy')
    }
  })

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
      const response = await fetch(
        `/api/booking/available-slots?date=${selectedDate}&sessionType=${sessionType}`
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
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div>
          <label htmlFor="date-select" className="block text-sm font-medium text-gray-300 mb-3">
            Choose a Date
          </label>
          <select
            id="date-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f0f23] border border-[#2a2a40] rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="">Select a date...</option>
            {availableDates.map((date) => (
              <option key={date.value} value={date.value}>
                {date.label}
              </option>
            ))}
          </select>
        </div>

        {/* Available Time Slots */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Available Times
            </label>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                <p className="text-gray-400 mt-3">Loading available times...</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.datetime}
                    type="button"
                    onClick={() => handleSlotClick(slot.datetime)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      isSlotSelected(slot.datetime)
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                        : 'bg-[#0f0f23] text-gray-300 border border-[#2a2a40] hover:border-purple-500 hover:bg-[#1a1a2e]'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#0f0f23] rounded-lg border border-[#2a2a40]">
                <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-400">
                  No available time slots for this date
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Please select a different date
                </p>
              </div>
            )}
          </div>
        )}

        {!selectedDate && (
          <div className="text-center py-12 bg-[#0f0f23] rounded-lg border border-[#2a2a40]">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400">
              Select a date to see available times
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
