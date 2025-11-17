'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminBadge,
  AdminLoading,
} from '@/components/admin';

interface Submission {
  id: string;
  email: string;
  discordTag: string | null;
  replayCode: string;
  rank: string;
  role: string;
  hero: string | null;
  notes: string | null;
  status: string;
  reviewNotes: string | null;
  reviewUrl: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form fields
  const [status, setStatus] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewUrl, setReviewUrl] = useState('');
  const [sendEmail, setSendEmail] = useState(false);

  useEffect(() => {
    fetchSubmission();
  }, [params.id]);

  async function fetchSubmission() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/submissions/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch submission');
      const data = await response.json();
      setSubmission(data.submission);
      setStatus(data.submission.status);
      setReviewNotes(data.submission.reviewNotes || '');
      setReviewUrl(data.submission.reviewUrl || '');
    } catch (error) {
      console.error('Error fetching submission:', error);
      alert('Failed to load submission');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!submission) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/submissions/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewNotes,
          reviewUrl,
          sendEmail,
        }),
      });

      if (!response.ok) throw new Error('Failed to update submission');

      alert('Submission updated successfully!');
      if (sendEmail) {
        alert('Review email sent to the user!');
      }
      fetchSubmission();
    } catch (error) {
      console.error('Error updating submission:', error);
      alert('Failed to update submission');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!submission) return;
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/submissions/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete submission');

      alert('Submission deleted successfully');
      router.push('/admin/submissions');
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Failed to delete submission');
      setDeleting(false);
    }
  }

  if (loading) {
    return <AdminLoading message="Loading submission details..." />;
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ef4444] text-lg mb-4">Submission not found</p>
        <Link href="/admin/submissions">
          <AdminButton variant="secondary">Back to Submissions</AdminButton>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/submissions" className="text-[#8b5cf6] hover:text-[#a78bfa] text-sm mb-2 inline-block">
          ← Back to Submissions
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#e5e7eb] mb-2">Submission Details</h1>
            <p className="text-[#9ca3af]">Review and manage replay submission</p>
          </div>
          <AdminBadge variant={(submission.status || 'pending').toLowerCase() as any}>
            {submission.status || 'Pending'}
          </AdminBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
            <h2 className="text-lg font-bold text-[#e5e7eb] mb-4">Submission Info</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#9ca3af] block mb-1">Email</label>
                <p className="text-[#e5e7eb] break-words">{submission.email}</p>
              </div>
              {submission.discordTag && (
                <div>
                  <label className="text-sm text-[#9ca3af] block mb-1">Discord Tag</label>
                  <p className="text-[#e5e7eb]">{submission.discordTag}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-[#9ca3af] block mb-1">Replay Code</label>
                <code className="block px-3 py-2 bg-[#0f0f23] rounded text-[#8b5cf6] font-mono">
                  {submission.replayCode}
                </code>
              </div>
              <div>
                <label className="text-sm text-[#9ca3af] block mb-1">Rank</label>
                <p className="text-[#e5e7eb]">{submission.rank}</p>
              </div>
              <div>
                <label className="text-sm text-[#9ca3af] block mb-1">Role</label>
                <p className="text-[#e5e7eb]">{submission.role}</p>
              </div>
              {submission.hero && (
                <div>
                  <label className="text-sm text-[#9ca3af] block mb-1">Hero</label>
                  <p className="text-[#e5e7eb]">{submission.hero}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-[#9ca3af] block mb-1">Submitted</label>
                <p className="text-[#e5e7eb]">
                  {new Date(submission.submittedAt).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {submission.reviewedAt && (
                <div>
                  <label className="text-sm text-[#9ca3af] block mb-1">Reviewed</label>
                  <p className="text-[#e5e7eb]">
                    {new Date(submission.reviewedAt).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {submission.notes && (
            <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
              <h2 className="text-lg font-bold text-[#e5e7eb] mb-4">Player Notes</h2>
              <p className="text-[#9ca3af] whitespace-pre-wrap">{submission.notes}</p>
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="lg:col-span-2">
          <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
            <h2 className="text-lg font-bold text-[#e5e7eb] mb-6">Review & Update</h2>
            <div className="space-y-6">
              <AdminSelect
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'IN_PROGRESS', label: 'In Progress' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'ARCHIVED', label: 'Archived' },
                ]}
              />

              <AdminTextarea
                label="Review Notes"
                placeholder="Enter your coaching notes and feedback..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={8}
              />

              <AdminInput
                label="Review Video URL"
                placeholder="https://youtube.com/watch?v=..."
                type="url"
                value={reviewUrl}
                onChange={(e) => setReviewUrl(e.target.value)}
              />

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="w-4 h-4 bg-[#0f0f23] border-[#2a2a40] rounded text-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6] focus:ring-offset-0"
                />
                <label htmlFor="sendEmail" className="text-sm text-[#e5e7eb] cursor-pointer">
                  Send email notification to user
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#2a2a40]">
                <AdminButton
                  variant="danger"
                  onClick={handleDelete}
                  disabled={deleting || saving}
                >
                  {deleting ? 'Deleting...' : 'Delete Submission'}
                </AdminButton>
                <AdminButton
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving || deleting}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
