'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminTable, AdminTableRow, AdminTableCell, AdminBadge, AdminSelect, AdminLoading } from '@/components/admin';

type SubmissionStatus = 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';

interface Submission {
  id: string;
  email: string;
  replayCode: string;
  rank: string;
  role: string;
  hero: string | null;
  status: string;
  submittedAt: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus>('ALL');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, sortOrder]);

  async function fetchSubmissions() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }
      params.append('sort', sortOrder);

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
            <AdminSelect
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus)}
              options={[
                { value: 'ALL', label: 'All Submissions' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <AdminSelect
              label="Sort by Date"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              options={[
                { value: 'desc', label: 'Newest First' },
                { value: 'asc', label: 'Oldest First' },
              ]}
            />
          </div>
          <div className="text-[#9ca3af] text-sm">
            {filteredAndSortedSubmissions.length} submission{filteredAndSortedSubmissions.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
        {loading ? (
          <AdminLoading message="Loading submissions..." />
        ) : filteredAndSortedSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#9ca3af] text-lg mb-2">No submissions found</p>
            <p className="text-[#6b7280] text-sm">
              {statusFilter !== 'ALL'
                ? 'Try changing the filter to see more submissions'
                : 'Submissions will appear here when users submit replay codes'}
            </p>
          </div>
        ) : (
          <AdminTable headers={['Date', 'Email', 'Rank', 'Role', 'Hero', 'Replay Code', 'Status', 'Actions']}>
            {filteredAndSortedSubmissions.map((submission) => (
              <AdminTableRow key={submission.id}>
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
                <AdminTableCell>{submission.rank}</AdminTableCell>
                <AdminTableCell>{submission.role}</AdminTableCell>
                <AdminTableCell>{submission.hero || '-'}</AdminTableCell>
                <AdminTableCell>
                  <code className="px-2 py-1 bg-[#0f0f23] rounded text-[#8b5cf6] font-mono text-sm">
                    {submission.replayCode}
                  </code>
                </AdminTableCell>
                <AdminTableCell>
                  <AdminBadge variant={submission.status.toLowerCase() as any}>
                    {submission.status}
                  </AdminBadge>
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
