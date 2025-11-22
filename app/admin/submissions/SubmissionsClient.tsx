'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminTable, AdminTableRow, AdminTableCell } from '@/components/admin';
import { Badge, Loading, getStatusBadgeVariant } from '@/components/ui';
import type { Submission, SubmissionStatus } from '@/lib/types';
import type { LocaleData } from '@/lib/locales/types';
import { logger } from '@/lib/logger';

interface SubmissionsClientProps {
  locale: LocaleData;
}

export default function SubmissionsClient({ locale }: SubmissionsClientProps) {
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
      logger.error('Error fetching submissions:', error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  }

  const filteredAndSortedSubmissions = submissions;

  // Helper function to get coaching type name
  const getCoachingTypeName = (type: string): string => {
    const typeMap: Record<string, string> = {
      'review-async': locale.coaching_types?.review_async || 'Async VOD Review',
      'vod-review': locale.coaching_types?.vod_review || 'Live VOD Review',
      'live-coaching': locale.coaching_types?.live_coaching || 'Live Coaching',
    };
    return typeMap[type] || type;
  };

  // Helper to format results counter
  const getResultsText = (count: number) => {
    const plural = count !== 1 ? 's' : '';
    return locale.filters?.results
      ?.replace('{count}', count.toString())
      ?.replace('{plural}', plural) || `${count} submission${plural}`;
  };

  // Helper to format replay count
  const getReplayCountText = (count: number) => {
    if (count === 1) {
      return locale.table?.replay_count?.singular?.replace('{count}', '1') || '1 replay';
    }
    return locale.table?.replay_count?.plural?.replace('{count}', count.toString()) || `${count} replays`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e5e7eb] mb-2">
          {locale.header?.title || 'Replay Submissions'}
        </h1>
        <p className="text-[#9ca3af]">
          {locale.header?.subtitle || 'Manage and review replay code submissions'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[#e5e7eb] mb-2">
              {locale.filters?.search?.label || 'Search by ID or Email'}
            </label>
            <input
              type="text"
              placeholder={locale.filters?.search?.placeholder || 'Enter submission ID or email...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[#e5e7eb] mb-2">
              {locale.filters?.status?.label || 'Filter by Status'}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus)}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all appearance-none"
            >
              <option value="ALL">{locale.filters?.status?.options?.all || 'All Submissions'}</option>
              <option value="AWAITING_PAYMENT">{locale.filters?.status?.options?.awaiting_payment || 'Awaiting Payment'}</option>
              <option value="PAYMENT_RECEIVED">{locale.filters?.status?.options?.payment_received || 'Payment Received'}</option>
              <option value="PAYMENT_FAILED">{locale.filters?.status?.options?.payment_failed || 'Payment Failed'}</option>
              <option value="IN_PROGRESS">{locale.filters?.status?.options?.in_progress || 'In Progress'}</option>
              <option value="COMPLETED">{locale.filters?.status?.options?.completed || 'Completed'}</option>
              <option value="ARCHIVED">{locale.filters?.status?.options?.archived || 'Archived'}</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[#e5e7eb] mb-2">
              {locale.filters?.sort?.label || 'Sort by Date'}
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all appearance-none"
            >
              <option value="desc">{locale.filters?.sort?.options?.newest || 'Newest First'}</option>
              <option value="asc">{locale.filters?.sort?.options?.oldest || 'Oldest First'}</option>
            </select>
          </div>
          <div className="text-[#9ca3af] text-sm">
            {getResultsText(filteredAndSortedSubmissions.length)}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
        {loading ? (
          <Loading size="lg" message={locale.loading?.submissions || 'Loading submissions...'} />
        ) : filteredAndSortedSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#9ca3af] text-lg mb-2">
              {locale.empty_states?.no_submissions?.title || 'No submissions found'}
            </p>
            <p className="text-[#6b7280] text-sm">
              {searchQuery
                ? (locale.empty_states?.no_submissions?.search || 'No submissions match your search')
                : statusFilter !== 'ALL'
                  ? (locale.empty_states?.no_submissions?.filter || 'Try changing the filter to see more submissions')
                  : (locale.empty_states?.no_submissions?.default || 'Submissions will appear here when users submit replay codes')}
            </p>
          </div>
        ) : (
          <AdminTable headers={[
            locale.table?.headers?.id || 'ID',
            locale.table?.headers?.date || 'Date',
            locale.table?.headers?.email || 'Email',
            locale.table?.headers?.coaching_type || 'Coaching Type',
            locale.table?.headers?.rank || 'Rank',
            locale.table?.headers?.role || 'Role',
            locale.table?.headers?.replays || 'Replays',
            locale.table?.headers?.status || 'Status',
            locale.table?.headers?.actions || 'Actions'
          ]}>
            {filteredAndSortedSubmissions.map((submission) => (
              <AdminTableRow key={submission.id}>
                <AdminTableCell>
                  <code className="text-xs text-brand-primary font-mono">
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
                    <span className="px-2 py-1 bg-brand-primary/20 text-brand-primary rounded text-xs font-medium">
                      {getReplayCountText(submission.replays.length)}
                    </span>
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <Badge variant={getStatusBadgeVariant(submission.status)}>
                    {submission.status}
                  </Badge>
                </AdminTableCell>
                <AdminTableCell>
                  <Link
                    href={`/admin/submissions/${submission.id}`}
                    className="text-brand-primary hover:text-brand-hover font-medium text-sm transition-colors"
                  >
                    {locale.table?.actions?.view_details || 'View Details →'}
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
