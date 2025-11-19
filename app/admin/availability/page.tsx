'use client'

import { useState, useEffect } from 'react'
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { logger } from '@/lib/logger'

interface AvailabilitySlot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  slotDuration: number
  isActive: boolean
  sessionType: string
  exceptions?: Array<{
    id: string
    date: string
    endDate: string
    reason: string
  }>
}

interface AvailabilityException {
  id: string
  date: string
  endDate: string
  reason: string
  notes?: string
  slot?: AvailabilitySlot
}

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const SESSION_TYPES = [
  { value: 'vod-review', label: 'VOD Review ($40)' },
  { value: 'live-coaching', label: 'Live Coaching ($50)' },
]

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showAddSlotDialog, setShowAddSlotDialog] = useState(false)
  const [showBlockTimeDialog, setShowBlockTimeDialog] = useState(false)

  // New slot form state
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:00',
    sessionType: 'vod-review',
    slotDuration: 60,
  })

  // Block time form state
  const [blockTime, setBlockTime] = useState({
    date: '',
    time: '09:00',
    duration: 60,
    reason: 'blocked' as 'blocked' | 'holiday',
    notes: '',
  })

  const [selectedSessionType, setSelectedSessionType] = useState<string>('all')

  useEffect(() => {
    fetchSlots()
    fetchExceptions()
  }, [])

  const fetchSlots = async () => {
    try {
      const response = await fetch('/api/admin/availability')
      if (!response.ok) throw new Error('Failed to fetch availability slots')
      const data = await response.json()
      setSlots(data.slots)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchExceptions = async () => {
    try {
      const response = await fetch('/api/admin/availability/exceptions')
      if (!response.ok) throw new Error('Failed to fetch exceptions')
      const data = await response.json()
      setExceptions(data.exceptions)
    } catch (err) {
      logger.error('Failed to fetch exceptions:', err instanceof Error ? err : new Error(String(err)))
    }
  }

  const handleAddSlot = async () => {
    try {
      setError(null)
      const response = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSlot),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create slot')
      }

      setSuccess('Availability slot created successfully')
      setShowAddSlotDialog(false)
      fetchSlots()

      // Reset form
      setNewSlot({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '10:00',
        sessionType: 'vod-review',
        slotDuration: 60,
      })

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleBlockTime = async () => {
    try {
      setError(null)

      // Combine date and time into ISO datetime
      const startDateTime = new Date(`${blockTime.date}T${blockTime.time}:00`)
      const endDateTime = new Date(startDateTime.getTime() + blockTime.duration * 60000)

      const response = await fetch('/api/admin/availability/exceptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          reason: blockTime.reason,
          notes: blockTime.notes || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to block time')
      }

      setSuccess('Time blocked successfully')
      setShowBlockTimeDialog(false)
      fetchExceptions()

      // Reset form
      setBlockTime({
        date: '',
        time: '09:00',
        duration: 60,
        reason: 'blocked',
        notes: '',
      })

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleToggleSlot = async (slotId: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/admin/availability/${slotId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentState }),
      })

      if (!response.ok) throw new Error('Failed to update slot')

      setSuccess(`Slot ${!currentState ? 'enabled' : 'disabled'}`)
      fetchSlots()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this slot?')) return

    try {
      const response = await fetch(`/api/admin/availability/${slotId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete slot')
      }

      setSuccess('Slot deleted successfully')
      fetchSlots()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDeleteException = async (exceptionId: string) => {
    if (!confirm('Are you sure you want to unblock this time?')) return

    try {
      const response = await fetch(`/api/admin/availability/exceptions/${exceptionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete exception')
      }

      setSuccess('Time unblocked successfully')
      fetchExceptions()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const filteredSlots = selectedSessionType === 'all'
    ? slots
    : slots.filter(s => s.sessionType === selectedSessionType)

  const groupedSlots = filteredSlots.reduce((acc, slot) => {
    if (!acc[slot.dayOfWeek]) acc[slot.dayOfWeek] = []
    acc[slot.dayOfWeek].push(slot)
    return acc
  }, {} as Record<number, AvailabilitySlot[]>)

  if (loading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Availability Manager</h1>
          <p className="text-gray-400 mt-1">
            Manage your weekly schedule and block specific dates
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-900 border-green-700">
          <AlertDescription className="text-green-100">{success}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Dialog open={showAddSlotDialog} onOpenChange={setShowAddSlotDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Add Availability Slot
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a2e] text-white border-[#2a2a40]">
            <DialogHeader>
              <DialogTitle>Add Availability Slot</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add recurring weekly availability for coaching sessions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="dayOfWeek">Day of Week</Label>
                <Select
                  value={newSlot.dayOfWeek.toString()}
                  onValueChange={(value) => setNewSlot({ ...newSlot, dayOfWeek: parseInt(value) })}
                >
                  <SelectTrigger className="bg-[#0f0f23] border-[#2a2a40]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-[#2a2a40]">
                    {DAYS_OF_WEEK.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time (EST)</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="bg-[#0f0f23] border-[#2a2a40]"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time (EST)</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="bg-[#0f0f23] border-[#2a2a40]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sessionType">Session Type</Label>
                <Select
                  value={newSlot.sessionType}
                  onValueChange={(value) => setNewSlot({ ...newSlot, sessionType: value })}
                >
                  <SelectTrigger className="bg-[#0f0f23] border-[#2a2a40]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-[#2a2a40]">
                    {SESSION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddSlot} className="w-full bg-purple-600 hover:bg-purple-700">
                Create Slot
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showBlockTimeDialog} onOpenChange={setShowBlockTimeDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-[#2a2a40] hover:bg-[#2a2a40]">
              Block Time
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a2e] text-white border-[#2a2a40]">
            <DialogHeader>
              <DialogTitle>Block Time</DialogTitle>
              <DialogDescription className="text-gray-400">
                Block a specific date and time (e.g., holiday, personal time)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="blockDate">Date</Label>
                <Input
                  id="blockDate"
                  type="date"
                  value={blockTime.date}
                  onChange={(e) => setBlockTime({ ...blockTime, date: e.target.value })}
                  className="bg-[#0f0f23] border-[#2a2a40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="blockTime">Start Time (EST)</Label>
                  <Input
                    id="blockTime"
                    type="time"
                    value={blockTime.time}
                    onChange={(e) => setBlockTime({ ...blockTime, time: e.target.value })}
                    className="bg-[#0f0f23] border-[#2a2a40]"
                  />
                </div>
                <div>
                  <Label htmlFor="blockDuration">Duration (minutes)</Label>
                  <Input
                    id="blockDuration"
                    type="number"
                    value={blockTime.duration}
                    onChange={(e) => setBlockTime({ ...blockTime, duration: parseInt(e.target.value) })}
                    className="bg-[#0f0f23] border-[#2a2a40]"
                    min="30"
                    step="30"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="blockReason">Reason</Label>
                <Select
                  value={blockTime.reason}
                  onValueChange={(value: 'blocked' | 'holiday') => setBlockTime({ ...blockTime, reason: value })}
                >
                  <SelectTrigger className="bg-[#0f0f23] border-[#2a2a40]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-[#2a2a40]">
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="blockNotes">Notes (optional)</Label>
                <Input
                  id="blockNotes"
                  value={blockTime.notes}
                  onChange={(e) => setBlockTime({ ...blockTime, notes: e.target.value })}
                  placeholder="e.g., Thanksgiving"
                  className="bg-[#0f0f23] border-[#2a2a40]"
                />
              </div>

              <Button onClick={handleBlockTime} className="w-full bg-purple-600 hover:bg-purple-700">
                Block Time
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Label htmlFor="sessionTypeFilter" className="text-white">Filter by Session Type:</Label>
        <Select value={selectedSessionType} onValueChange={setSelectedSessionType}>
          <SelectTrigger className="w-[200px] bg-[#1a1a2e] border-[#2a2a40] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-[#2a2a40]">
            <SelectItem value="all">All Types</SelectItem>
            {SESSION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Weekly Schedule */}
      <Card className="bg-[#1a1a2e] border-[#2a2a40]">
        <CardHeader>
          <CardTitle className="text-white">Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {DAYS_OF_WEEK.map((day, dayIndex) => (
            <div key={dayIndex} className="mb-6 last:mb-0">
              <h3 className="text-lg font-semibold text-white mb-3">{day}</h3>
              <div className="space-y-2">
                {groupedSlots[dayIndex]?.length > 0 ? (
                  groupedSlots[dayIndex].map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-lg border ${
                        slot.isActive
                          ? 'bg-[#0f0f23] border-[#2a2a40]'
                          : 'bg-gray-800 border-gray-700 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-white font-medium">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <Badge
                            className={
                              slot.sessionType === 'vod-review'
                                ? 'bg-blue-600'
                                : 'bg-purple-600'
                            }
                          >
                            {slot.sessionType === 'vod-review' ? 'VOD Review' : 'Live Coaching'}
                          </Badge>
                          <span className="text-gray-400 text-sm">
                            {slot.slotDuration} min slots
                          </span>
                          {!slot.isActive && (
                            <Badge variant="outline" className="border-gray-600 text-gray-400">
                              Disabled
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleSlot(slot.id, slot.isActive)}
                            className="text-gray-400 hover:text-white"
                          >
                            {slot.isActive ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No availability on this day</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Blocked Times */}
      {exceptions.filter(e => e.reason !== 'booked' && new Date(e.date) >= new Date()).length > 0 && (
        <Card className="bg-[#1a1a2e] border-[#2a2a40]">
          <CardHeader>
            <CardTitle className="text-white">Blocked Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exceptions
                .filter(e => e.reason !== 'booked' && new Date(e.date) >= new Date())
                .map((exception) => (
                  <div
                    key={exception.id}
                    className="p-4 rounded-lg bg-[#0f0f23] border border-[#2a2a40] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">
                          {new Date(exception.date).toLocaleDateString()} at{' '}
                          {new Date(exception.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <Badge className={exception.reason === 'holiday' ? 'bg-orange-600' : 'bg-gray-600'}>
                          {exception.reason}
                        </Badge>
                      </div>
                      {exception.notes && (
                        <p className="text-gray-400 text-sm mt-1">{exception.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteException(exception.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-[#1a1a2e] border-[#2a2a40]">
        <CardHeader>
          <CardTitle className="text-white">How it works</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-400 space-y-2">
          <p>• Add weekly availability slots for VOD Review and Live Coaching sessions</p>
          <p>• All times are in EST timezone</p>
          <p>• Slots are automatically divided into {newSlot.slotDuration}-minute appointments</p>
          <p>• Block specific dates/times for holidays or personal time</p>
          <p>• Disable slots temporarily without deleting them</p>
          <p>• Once a user books a time, it will automatically be blocked</p>
        </CardContent>
      </Card>
    </div>
  )
}
