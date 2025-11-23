'use client';

import { useState, useEffect } from 'react';
import {
  AdminTable,
  AdminTableRow,
  AdminTableCell,
} from '@/components/admin';
import { Badge, Button, Loading, getStatusBadgeVariant } from '@/components/ui';
import type { Booking, BookingStatus } from '@/lib/types';
import { logger } from '@/lib/logger';

export default function SchedulePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BookingStatus>('ALL');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/bookings');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      logger.error('Error fetching bookings:', error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  }

  async function updateBookingStatus(id: string, newStatus: string) {
    if (!confirm(`Mark this booking as ${newStatus}?`)) {
      return;
    }

    try {
      setUpdating(id);
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update booking');

      alert(`Booking marked as ${newStatus}`);
      fetchBookings();
    } catch (error) {
      logger.error('Error updating booking:', error instanceof Error ? error : new Error(String(error)));
      alert('Failed to update booking');
    } finally {
      setUpdating(null);
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === 'ALL') return true;
    return booking.status === statusFilter;
  });

  // Separate into upcoming and past bookings
  const now = new Date();
  const upcomingBookings = filteredBookings
    .filter((b) => new Date(b.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const pastBookings = filteredBookings
    .filter((b) => new Date(b.scheduledAt) < now)
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e5e7eb] mb-2">Schedule & Bookings</h1>
        <p className="text-[#9ca3af]">Manage your coaching session bookings</p>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[#e5e7eb] mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus)}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all appearance-none"
            >
              <option value="ALL">All Bookings</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
            </select>
          </div>
          <div className="text-[#9ca3af] text-sm">
            {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
          </div>
          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto"
          >
            <Button variant="secondary" size="sm">
              Open Google Calendar →
            </Button>
          </a>
        </div>
      </div>

      {loading ? (
        <Loading size="lg" message="Loading bookings..." />
      ) : (
        <div className="space-y-6">
          {/* Upcoming Bookings */}
          <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#e5e7eb] mb-4">
              Upcoming Sessions ({upcomingBookings.length})
            </h2>
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#9ca3af]">No upcoming sessions</p>
              </div>
            ) : (
              <AdminTable headers={['Date & Time', 'Email', 'Session Type', 'Status', 'Notes', 'Actions']}>
                {upcomingBookings.map((booking) => (
                  <AdminTableRow key={booking.id}>
                    <AdminTableCell>
                      <div>
                        <div className="font-medium text-[#e5e7eb]">
                          {new Date(booking.scheduledAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: 'America/New_York',
                          })}
                        </div>
                        <div className="text-sm text-[#9ca3af]">
                          {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            timeZone: 'America/New_York',
                          })}
                        </div>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>
                      <div className="max-w-[200px] truncate" title={booking.email}>
                        {booking.email}
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>{booking.sessionType}</AdminTableCell>
                    <AdminTableCell>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </AdminTableCell>
                    <AdminTableCell>
                      <div className="max-w-[150px] truncate text-[#9ca3af] text-sm">
                        {booking.notes || '-'}
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>
                      <div className="flex items-center space-x-2">
                        {booking.status === 'SCHEDULED' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                              disabled={updating === booking.id}
                              className="text-[#10b981] hover:text-[#34d399] font-medium text-sm transition-colors disabled:opacity-50"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'NO_SHOW')}
                              disabled={updating === booking.id}
                              className="text-[#ef4444] hover:text-[#f87171] font-medium text-sm transition-colors disabled:opacity-50"
                            >
                              No Show
                            </button>
                          </>
                        )}
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTable>
            )}
          </div>

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
              <h2 className="text-xl font-bold text-[#e5e7eb] mb-4">
                Past Sessions ({pastBookings.length})
              </h2>
              <AdminTable headers={['Date & Time', 'Email', 'Session Type', 'Status', 'Notes', 'Actions']}>
                {pastBookings.map((booking) => (
                  <AdminTableRow key={booking.id}>
                    <AdminTableCell>
                      <div>
                        <div className="font-medium text-[#e5e7eb]">
                          {new Date(booking.scheduledAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: 'America/New_York',
                          })}
                        </div>
                        <div className="text-sm text-[#9ca3af]">
                          {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            timeZone: 'America/New_York',
                          })}
                        </div>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>
                      <div className="max-w-[200px] truncate" title={booking.email}>
                        {booking.email}
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>{booking.sessionType}</AdminTableCell>
                    <AdminTableCell>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </AdminTableCell>
                    <AdminTableCell>
                      <div className="max-w-[150px] truncate text-[#9ca3af] text-sm">
                        {booking.notes || '-'}
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>
                      {booking.status === 'SCHEDULED' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                            disabled={updating === booking.id}
                            className="text-[#10b981] hover:text-[#34d399] font-medium text-sm transition-colors disabled:opacity-50"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'NO_SHOW')}
                            disabled={updating === booking.id}
                            className="text-[#ef4444] hover:text-[#f87171] font-medium text-sm transition-colors disabled:opacity-50"
                          >
                            No Show
                          </button>
                        </div>
                      )}
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTable>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
