'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { replaySubmissionSchema, type ReplaySubmissionInput } from '@/lib/validations';
import { rankOptions, roleOptions } from '@/lib/validations/booking';

type ReplaySubmissionData = ReplaySubmissionInput;

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<'booking' | 'replay'>('booking');
  const [formData, setFormData] = useState<ReplaySubmissionData>({
    email: '',
    discordTag: '',
    replayCode: '',
    rank: undefined as any,
    role: undefined as any,
    hero: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ReplaySubmissionData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ReplaySubmissionData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleReplayCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-uppercase replay code
    const value = e.target.value.toUpperCase();
    setFormData((prev) => ({ ...prev, replayCode: value }));
    if (errors.replayCode) {
      setErrors((prev) => ({ ...prev, replayCode: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitStatus('idle');

    // Validate form data
    const result = replaySubmissionSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ReplaySubmissionData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof ReplaySubmissionData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/replay/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit replay code');
      }

      setSubmitStatus('success');
      setFormData({
        email: '',
        discordTag: '',
        replayCode: '',
        rank: undefined as any,
        role: undefined as any,
        hero: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              Book Your Session
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Choose between live coaching sessions or submit a replay code for detailed VOD review
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-[#0f0f23] border-b border-[#2a2a40] sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-4 py-4">
            <button
              onClick={() => setActiveTab('booking')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'booking'
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                  : 'bg-[#2a2a40] text-gray-400 hover:text-gray-200'
              }`}
            >
              Live Coaching
            </button>
            <button
              onClick={() => setActiveTab('replay')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'replay'
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                  : 'bg-[#2a2a40] text-gray-400 hover:text-gray-200'
              }`}
            >
              Submit Replay
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 bg-[#0f0f23] flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Live Coaching Booking */}
          {activeTab === 'booking' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-100 mb-4">Schedule Live Coaching</h2>
                <p className="text-gray-400 leading-relaxed">
                  Book a 1-on-1 live coaching session where we'll analyze your gameplay in real-time, work on specific skills, and answer your questions.
                </p>
              </div>

              <Card variant="surface" padding="lg" className="mb-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-bold text-gray-100 mb-1">60-Minute Sessions</h3>
                      <p className="text-gray-400">Full hour of personalized coaching and Q&A</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-bold text-gray-100 mb-1">Screen Sharing</h3>
                      <p className="text-gray-400">Live gameplay analysis via Discord</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-bold text-gray-100 mb-1">Recording Provided</h3>
                      <p className="text-gray-400">Review the session anytime after</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Google Calendar Embed Placeholder */}
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <CardTitle>Select Your Time Slot</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[800px]">
                    <iframe
                      src={process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL}
                      className="w-full h-full border-0 rounded-lg"
                      frameBorder="0"
                      scrolling="no"
                      title="Book Your Coaching Session"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Replay Code Submission */}
          {activeTab === 'replay' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-100 mb-4">Submit Replay Code</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Submit your Overwatch replay code for a detailed VOD review. I'll analyze your gameplay, positioning, decision-making, and provide actionable feedback.
                </p>
                <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
                  <p className="text-purple-400 font-medium">
                    Expected turnaround: 2-3 business days
                  </p>
                </div>
              </div>

              <Card variant="surface" padding="lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      inputType="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      required
                      placeholder="your.email@example.com"
                      disabled={isSubmitting}
                      helperText="Where should I send the VOD review?"
                    />

                    <Input
                      label="Discord Tag"
                      name="discordTag"
                      type="text"
                      value={formData.discordTag}
                      onChange={handleChange}
                      error={errors.discordTag}
                      placeholder="YourName#1234"
                      disabled={isSubmitting}
                      helperText="Optional - for follow-up questions"
                    />
                  </div>

                  <Input
                    label="Replay Code"
                    name="replayCode"
                    type="text"
                    value={formData.replayCode}
                    onChange={handleReplayCodeChange}
                    error={errors.replayCode}
                    required
                    placeholder="ABC123"
                    disabled={isSubmitting}
                    helperText="6-10 character code from Overwatch (uppercase letters and numbers)"
                    className="font-mono text-lg"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Rank <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="rank"
                        value={formData.rank || ''}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className={`w-full px-4 py-2.5 bg-[#1a1a2e] border rounded-lg text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 ${
                          errors.rank ? 'border-red-500' : 'border-[#2a2a40] hover:border-purple-600/50'
                        }`}
                      >
                        <option value="" disabled>Select your rank</option>
                        {rankOptions.map((rank) => (
                          <option key={rank} value={rank}>{rank}</option>
                        ))}
                      </select>
                      {errors.rank && (
                        <p className="mt-1.5 text-sm text-red-400">{errors.rank}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="role"
                        value={formData.role || ''}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className={`w-full px-4 py-2.5 bg-[#1a1a2e] border rounded-lg text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 ${
                          errors.role ? 'border-red-500' : 'border-[#2a2a40] hover:border-purple-600/50'
                        }`}
                      >
                        <option value="" disabled>Select your role</option>
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      {errors.role && (
                        <p className="mt-1.5 text-sm text-red-400">{errors.role}</p>
                      )}
                    </div>
                  </div>

                  <Input
                    label="Hero Played"
                    name="hero"
                    type="text"
                    value={formData.hero}
                    onChange={handleChange}
                    error={errors.hero}
                    placeholder="e.g., Ana, Reinhardt, Tracer"
                    disabled={isSubmitting}
                    helperText="Optional - helps me provide more specific feedback"
                  />

                  <Input
                    label="Additional Notes"
                    name="notes"
                    inputType="textarea"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                    error={errors.notes}
                    placeholder="What would you like me to focus on? Any specific questions or areas you're struggling with?"
                    disabled={isSubmitting}
                    helperText="Max 500 characters"
                  />

                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 font-medium mb-1">
                        Replay code submitted successfully!
                      </p>
                      <p className="text-green-300 text-sm">
                        You'll receive your VOD review within 2-3 business days at the email provided.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 font-medium">
                        Failed to submit replay code. Please try again or contact me directly.
                      </p>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Replay Code'}
                    </Button>
                  </div>

                  <p className="text-sm text-gray-400 text-center">
                    By submitting, you agree to our terms of service and privacy policy
                  </p>
                </form>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
