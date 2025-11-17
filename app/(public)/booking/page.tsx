'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { replaySubmissionSchema, type ReplaySubmissionInput } from '@/lib/validations';
import { rankOptions, roleOptions } from '@/lib/validations/booking';

type CoachingType = 'review-async' | 'vod-review' | 'live-coaching' | null;
type ReplaySubmissionData = ReplaySubmissionInput;

export default function GetCoachingPage() {
  const [selectedType, setSelectedType] = useState<CoachingType>(null);
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

  const coachingTypes = [
    {
      id: 'review-async' as CoachingType,
      name: 'Review on My Time',
      description: 'I review your replay and send detailed notes via Discord/email',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'vod-review' as CoachingType,
      name: 'VOD Review',
      description: 'I stream your replay over Discord and review it with you live',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'live-coaching' as CoachingType,
      name: 'Live Coaching',
      description: 'You stream your game and I make corrections on the fly',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

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

  const handleTypeSelection = (type: CoachingType) => {
    setSelectedType(type);
    setSubmitStatus('idle');
  };

  const handleBack = () => {
    setSelectedType(null);
    setSubmitStatus('idle');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              Get Coaching
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {selectedType ? 'Complete your booking' : 'Choose your coaching style to get started'}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-[#0f0f23] flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Coaching Type Selection */}
          {!selectedType && (
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-100 mb-4">Select Your Coaching Style</h2>
                <p className="text-gray-400 leading-relaxed">
                  Not sure which one to choose? <a href="/pricing" className="text-purple-400 hover:text-purple-300 underline">View detailed pricing and comparisons</a>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coachingTypes.map((type) => (
                  <Card
                    key={type.id}
                    variant="surface"
                    hover
                    className="cursor-pointer transition-all duration-200 hover:border-purple-500"
                    onClick={() => handleTypeSelection(type.id)}
                  >
                    <CardContent className="text-center py-8">
                      <div className="flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-lg mx-auto mb-4">
                        <div className="text-purple-400">{type.icon}</div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-100 mb-3">{type.name}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {type.description}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Select
                      </Button>
                    </CardContent>
                  </Card>
                ))}
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

          {/* Review on My Time - Replay Submission Form */}
          {selectedType === 'review-async' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <Button variant="outline" size="sm" onClick={handleBack}>
                  ← Back to Selection
                </Button>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-100 mb-4">Submit Your Replay Code</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Submit your Overwatch replay code for a detailed review. I'll analyze your gameplay and send comprehensive notes via Discord or email.
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
                      helperText="Where should I send the review?"
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
                        You'll receive your review within 2-3 business days at the email provided.
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

          {/* VOD Review or Live Coaching - Schedule Session */}
          {(selectedType === 'vod-review' || selectedType === 'live-coaching') && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <Button variant="outline" size="sm" onClick={handleBack}>
                  ← Back to Selection
                </Button>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-100 mb-4">
                  {selectedType === 'vod-review' ? 'Schedule VOD Review Session' : 'Schedule Live Coaching Session'}
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {selectedType === 'vod-review'
                    ? 'Book a time slot where we\'ll review your replay together over Discord. I\'ll stream the replay and provide live commentary while you can ask questions.'
                    : 'Book a time slot for live coaching where you\'ll stream your gameplay and receive real-time guidance and corrections as you play.'}
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
                      <h3 className="font-bold text-gray-100 mb-1">Discord Screen Sharing</h3>
                      <p className="text-gray-400">
                        {selectedType === 'vod-review'
                          ? 'I\'ll stream the replay analysis'
                          : 'You stream your live gameplay'}
                      </p>
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

              {/* Google Calendar Embed */}
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <CardTitle>Select Your Time Slot</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-[#1a1a2e] border-2 border-dashed border-purple-600/30 rounded-lg p-12 text-center">
                    <svg className="w-16 h-16 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-100 mb-2">Google Calendar Integration</h3>
                    <p className="text-gray-400 mb-4 max-w-md mx-auto">
                      Embed your Google Calendar appointment scheduler here. Instructions for setup:
                    </p>
                    <ol className="text-left text-sm text-gray-400 max-w-xl mx-auto space-y-2 mb-6">
                      <li>1. Create an Appointment Schedule in Google Calendar</li>
                      <li>2. Get the embed code from Calendar settings</li>
                      <li>3. Add the embed URL to your environment variables</li>
                      <li>4. Replace this placeholder with the actual iframe embed</li>
                    </ol>
                    <p className="text-sm text-purple-400 font-mono bg-purple-600/10 px-4 py-2 rounded inline-block">
                      GOOGLE_CALENDAR_EMBED_URL
                    </p>
                  </div>

                  {/* Example of how to embed when ready */}
                  {/*
                  <div className="w-full h-[600px]">
                    <iframe
                      src={process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL}
                      className="w-full h-full border-0"
                      frameBorder="0"
                      scrolling="no"
                    />
                  </div>
                  */}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
