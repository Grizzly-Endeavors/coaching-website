'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Badge, Loading } from '@/components/ui';

interface ReplayCode {
  id: string;
  code: string;
  mapName: string;
  notes: string | null;
}

interface Submission {
  id: string;
  email: string;
  discordTag: string | null;
  coachingType: string;
  rank: string;
  role: string;
  hero: string | null;
  status: string;
  reviewNotes: string | null;
  reviewUrl: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  replays: ReplayCode[];
}

export default function SubmissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form fields
  const [status, setStatus] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewUrl, setReviewUrl] = useState('');
  const [sendDiscordNotification, setSendDiscordNotification] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSubmission();
    }
  }, [id]);

  async function fetchSubmission() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/submissions/${id}`);
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
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewNotes,
          reviewUrl,
          sendDiscordNotification,
        }),
      });

      if (!response.ok) throw new Error('Failed to update submission');

      alert('Submission updated successfully!');
      if (sendDiscordNotification) {
        alert('Discord notification sent to the user!');
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
      const response = await fetch(`/api/admin/submissions/${id}`, {
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

  function copySubmissionId() {
    if (submission) {
      navigator.clipboard.writeText(submission.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  }

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

  if (loading) {
    return <Loading size="lg" message="Loading submission details..." />;
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ef4444] text-lg mb-4">Submission not found</p>
        <Link href="/admin/submissions">
          <Button variant="secondary">Back to Submissions</Button>
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
            <div className="flex items-center gap-3">
              <button
                onClick={copySubmissionId}
                className="group flex items-center gap-2 text-[#9ca3af] hover:text-[#8b5cf6] transition-colors"
                title="Click to copy"
              >
                <code className="text-sm font-mono bg-[#0f0f23] px-3 py-1 rounded border border-[#2a2a40] group-hover:border-[#8b5cf6]">
                  ID: {submission.id}
                </code>
                {copiedId ? (
                  <span className="text-xs text-green-400">Copied!</span>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <Badge variant={(submission.status || 'pending').toLowerCase() as any}>
            {submission.status || 'Pending'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
            <h2 className="text-lg font-bold text-[#e5e7eb] mb-4">Submission Info</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#9ca3af] block mb-1">Coaching Type</label>
                <p className="text-[#e5e7eb]">{getCoachingTypeName(submission.coachingType)}</p>
              </div>
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

          {/* Replay Codes */}
          <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
            <h2 className="text-lg font-bold text-[#e5e7eb] mb-4">
              Replay Codes ({submission.replays.length})
            </h2>
            <div className="space-y-4">
              {submission.replays.map((replay, index) => (
                <div key={replay.id} className="bg-[#0f0f23] border border-[#2a2a40] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#9ca3af]">Replay {index + 1}</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-[#9ca3af] block mb-1">Code</label>
                      <code className="block px-3 py-2 bg-[#1a1a2e] rounded text-[#8b5cf6] font-mono text-sm">
                        {replay.code}
                      </code>
                    </div>
                    <div>
                      <label className="text-xs text-[#9ca3af] block mb-1">Map</label>
                      <p className="text-[#e5e7eb] text-sm">{replay.mapName}</p>
                    </div>
                    {replay.notes && (
                      <div>
                        <label className="text-xs text-[#9ca3af] block mb-1">Player Notes</label>
                        <p className="text-[#9ca3af] text-sm whitespace-pre-wrap">{replay.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="lg:col-span-2">
          <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
            <h2 className="text-lg font-bold text-[#e5e7eb] mb-6">Review & Update</h2>
            <div className="space-y-6">
              <div className="w-full">
                <label className="block text-sm font-medium text-[#e5e7eb] mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all appearance-none"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-[#e5e7eb] mb-2">Review Notes</label>
                <textarea
                  placeholder="Enter your coaching notes and feedback..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all resize-vertical min-h-[100px]"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-[#e5e7eb] mb-2">Review Video URL</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={reviewUrl}
                  onChange={(e) => setReviewUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="sendDiscordNotification"
                  checked={sendDiscordNotification}
                  onChange={(e) => setSendDiscordNotification(e.target.checked)}
                  className="w-4 h-4 bg-[#0f0f23] border-[#2a2a40] rounded text-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6] focus:ring-offset-0"
                />
                <label htmlFor="sendDiscordNotification" className="text-sm text-[#e5e7eb] cursor-pointer">
                  Send Discord notification to user
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#2a2a40]">
                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={deleting || saving}
                  className="bg-[#ef4444] text-white hover:bg-[#dc2626] border-0"
                >
                  {deleting ? 'Deleting...' : 'Delete Submission'}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving || deleting}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
