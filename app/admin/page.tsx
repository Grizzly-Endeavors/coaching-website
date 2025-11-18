import { Suspense } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AdminCard, AdminButton, AdminTable, AdminTableRow, AdminTableCell, AdminBadge, AdminLoading } from '@/components/admin';

// Force dynamic rendering since this page needs database access
export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const [
    pendingSubmissions,
    totalSubmissions,
    completedSubmissions,
    recentBookings,
    recentSubmissions,
  ] = await Promise.all([
    prisma.replaySubmission.count({ where: { status: 'AWAITING_PAYMENT' } }),
    prisma.replaySubmission.count(),
    prisma.replaySubmission.count({ where: { status: 'COMPLETED' } }),
    prisma.booking.findMany({
      where: {
        scheduledAt: {
          gte: new Date(),
        },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 5,
    }),
    prisma.replaySubmission.findMany({
      orderBy: { submittedAt: 'desc' },
      take: 10,
    }),
  ]);

  return {
    pendingSubmissions,
    totalSubmissions,
    completedSubmissions,
    recentBookings,
    recentSubmissions,
  };
}

async function DashboardContent() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminCard
          title="Pending Submissions"
          value={data.pendingSubmissions}
          subtitle="Awaiting review"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <AdminCard
          title="Total Submissions"
          value={data.totalSubmissions}
          subtitle="All time"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <AdminCard
          title="Completed Reviews"
          value={data.completedSubmissions}
          subtitle={`${Math.round((data.completedSubmissions / (data.totalSubmissions || 1)) * 100)}% completion rate`}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Quick Links */}
      <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
        <h2 className="text-xl font-bold text-[#e5e7eb] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/submissions?status=AWAITING_PAYMENT">
            <AdminButton variant="primary">
              Review Pending Submissions
            </AdminButton>
          </Link>
          <Link href="/admin/blog/new">
            <AdminButton variant="secondary">
              Create New Blog Post
            </AdminButton>
          </Link>
          <Link href="/admin/schedule">
            <AdminButton variant="secondary">
              View Schedule
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      {data.recentBookings.length > 0 && (
        <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#e5e7eb]">Upcoming Bookings</h2>
            <Link href="/admin/schedule">
              <AdminButton variant="ghost" size="sm">
                View All
              </AdminButton>
            </Link>
          </div>
          <AdminTable headers={['Date & Time', 'Email', 'Session Type', 'Status']}>
            {data.recentBookings.map((booking) => (
              <AdminTableRow key={booking.id}>
                <AdminTableCell>
                  {new Date(booking.scheduledAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </AdminTableCell>
                <AdminTableCell>{booking.email}</AdminTableCell>
                <AdminTableCell>{booking.sessionType}</AdminTableCell>
                <AdminTableCell>
                  <AdminBadge variant={booking.status.toLowerCase() as any}>
                    {booking.status}
                  </AdminBadge>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>
        </div>
      )}

      {/* Recent Submissions */}
      <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#e5e7eb]">Recent Submissions</h2>
          <Link href="/admin/submissions">
            <AdminButton variant="ghost" size="sm">
              View All
            </AdminButton>
          </Link>
        </div>
        <AdminTable headers={['Date', 'Email', 'Rank', 'Role', 'Hero', 'Status']}>
          {data.recentSubmissions.map((submission) => (
            <Link key={submission.id} href={`/admin/submissions/${submission.id}`}>
              <AdminTableRow className="cursor-pointer hover:bg-[#1a1a2e]">
                <AdminTableCell>
                  {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </AdminTableCell>
                <AdminTableCell>{submission.email}</AdminTableCell>
                <AdminTableCell>{submission.rank}</AdminTableCell>
                <AdminTableCell>{submission.role}</AdminTableCell>
                <AdminTableCell>{submission.hero || '-'}</AdminTableCell>
                <AdminTableCell>
                  <AdminBadge variant={submission.status.toLowerCase() as any}>
                    {submission.status}
                  </AdminBadge>
                </AdminTableCell>
              </AdminTableRow>
            </Link>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e5e7eb] mb-2">Dashboard</h1>
        <p className="text-[#9ca3af]">Welcome back! Here's an overview of your coaching business.</p>
      </div>

      <Suspense fallback={<AdminLoading message="Loading dashboard..." />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
