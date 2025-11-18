'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminTable, AdminTableRow, AdminTableCell } from '@/components/admin';
import { Badge, Loading } from '@/components/ui';

type SubmissionStatus = 'ALL' | 'AWAITING_PAYMENT' | 'PAYMENT_RECEIVED' | 'PAYMENT_FAILED' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';

interface ReplayCode {
  id: string;
  code: string;
  mapName: string;
  notes: string | null;
}

interface Submission {
  id: string;
  email: string;
  coachingType: string;
  rank: string;
  role: string;
  hero: string | null;
  status: string;
  submittedAt: string;
  replays: ReplayCode[];
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus>('ALL');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, sortOrder, searchQuery]);

  async function fetchSubmissions() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }
      params.append('order', sortOrder);
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`/api/admin/submissions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch submissions');
      const data = await response.json();
      setSubmissions(data.submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredAndSortedSubmissions = submissions;

  const getCoachingTypeName = (type: string) => {
    switch (type) {
      case 'review-async':
        return 'Review on My Time';
      case 'vod-review':
        return 'VOD Review';
      case 'live-coaching':
        return 'Live Coaching';
      default:
        return type;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e5e7eb] mb-2">Replay Submissions</h1>
        <p className="text-[#9ca3af]">Manage and review replay code submissions</p>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[#e5e7eb] mb-2">Search by ID or Email</label>
            <input
              type="text"
              placeholder="Enter submission ID or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[#e5e7eb] mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus)}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all appearance-none"
            >
              <option value="ALL">All Submissions</option>
              <option value="AWAITING_PAYMENT">Awaiting Payment</option>
              <option value="PAYMENT_RECEIVED">Payment Received</option>
              <option value="PAYMENT_FAILED">Payment Failed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[#e5e7eb] mb-2">Sort by Date</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all appearance-none"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
          <div className="text-[#9ca3af] text-sm">
            {filteredAndSortedSubmissions.length} submission{filteredAndSortedSubmissions.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
        {loading ? (
          <Loading size="lg" message="Loading submissions..." />
        ) : filteredAndSortedSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#9ca3af] text-lg mb-2">No submissions found</p>
            <p className="text-[#6b7280] text-sm">
              {searchQuery
                ? 'No submissions match your search'
                : statusFilter !== 'ALL'
                ? 'Try changing the filter to see more submissions'
                : 'Submissions will appear here when users submit replay codes'}
            </p>
          </div>
        ) : (
          <AdminTable headers={['ID', 'Date', 'Email', 'Coaching Type', 'Rank', 'Role', 'Replays', 'Status', 'Actions']}>
            {filteredAndSortedSubmissions.map((submission) => (
              <AdminTableRow key={submission.id}>
                <AdminTableCell>
                  <code className="text-xs text-[#8b5cf6] font-mono">
                    {submission.id.substring(0, 8)}...
                  </code>
                </AdminTableCell>
                <AdminTableCell>
                  {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </AdminTableCell>
                <AdminTableCell>
                  <div className="max-w-[200px] truncate" title={submission.email}>
                    {submission.email}
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="text-sm">
                    {getCoachingTypeName(submission.coachingType)}
                  </div>
                </AdminTableCell>
                <AdminTableCell>{submission.rank}</AdminTableCell>
                <AdminTableCell>{submission.role}</AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-1 bg-[#8b5cf6]/20 text-[#8b5cf6] rounded text-xs font-medium">
                      {submission.replays.length} {submission.replays.length === 1 ? 'replay' : 'replays'}
                    </span>
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <Badge variant={submission.status.toLowerCase() as any}>
                    {submission.status}
                  </Badge>
                </AdminTableCell>
                <AdminTableCell>
                  <Link
                    href={`/admin/submissions/${submission.id}`}
                    className="text-[#8b5cf6] hover:text-[#a78bfa] font-medium text-sm transition-colors"
                  >
                    View Details →
                  </Link>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </div>
    </div>
  );
}
