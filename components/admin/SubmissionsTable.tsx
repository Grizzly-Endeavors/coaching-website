/**
 * SubmissionsTable Component
 *
 * Reusable table component for displaying replay submissions
 * with proper formatting and responsive design
 */

import Link from 'next/link';
import { StatusBadge } from './StatusBadge';

interface Submission {
  id: string;
  email: string;
  replayCode: string;
  rank: string;
  role: string;
  hero: string | null;
  status: string;
  submittedAt: string | Date;
}

interface SubmissionsTableProps {
  submissions: Submission[];
  emptyMessage?: string;
  className?: string;
}

/**
 * Displays a table of replay submissions with formatted data
 * @param submissions - Array of submission objects
 * @param emptyMessage - Custom message to display when no submissions exist
 * @param className - Optional additional CSS classes
 */
export function SubmissionsTable({
  submissions,
  emptyMessage = 'No submissions found',
  className = '',
}: SubmissionsTableProps) {
  // Handle empty state
  if (submissions.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-[#9ca3af] text-lg mb-2">{emptyMessage}</p>
        <p className="text-[#6b7280] text-sm">
          Submissions will appear here when users submit replay codes
        </p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2a2a40]">
            <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
              Rank
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
              Role
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
              Hero
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
              Replay Code
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a40]">
          {submissions.map((submission) => (
            <tr
              key={submission.id}
              className="hover:bg-[#1a1a2e] transition-colors"
            >
              {/* Date */}
              <td className="px-4 py-4 text-sm text-[#e5e7eb]">
                {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>

              {/* Email */}
              <td className="px-4 py-4 text-sm text-[#e5e7eb]">
                <div className="max-w-[200px] truncate" title={submission.email}>
                  {submission.email}
                </div>
              </td>

              {/* Rank */}
              <td className="px-4 py-4 text-sm text-[#e5e7eb]">
                {submission.rank}
              </td>

              {/* Role */}
              <td className="px-4 py-4 text-sm text-[#e5e7eb]">
                {submission.role}
              </td>

              {/* Hero */}
              <td className="px-4 py-4 text-sm text-[#e5e7eb]">
                {submission.hero || '-'}
              </td>

              {/* Replay Code */}
              <td className="px-4 py-4 text-sm">
                <code className="px-2 py-1 bg-[#0f0f23] rounded text-[#8b5cf6] font-mono text-sm">
                  {submission.replayCode}
                </code>
              </td>

              {/* Status */}
              <td className="px-4 py-4 text-sm">
                <StatusBadge status={submission.status} />
              </td>

              {/* Actions */}
              <td className="px-4 py-4 text-sm">
                <Link
                  href={`/admin/submissions/${submission.id}`}
                  className="text-[#8b5cf6] hover:text-[#a78bfa] font-medium transition-colors"
                >
                  View Details →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
