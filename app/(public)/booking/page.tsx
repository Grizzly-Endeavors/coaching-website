'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { replaySubmissionSchema, type ReplaySubmissionData, type ReplayCodeData } from '@/lib/validations/booking';
import { rankOptions, roleOptions, coachingTypes } from '@/lib/validations/booking';

type CoachingType = typeof coachingTypes[number];

export default function GetCoachingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get('type') as CoachingType | null;

  const [selectedType, setSelectedType] = useState<CoachingType | null>(null);
  const [formData, setFormData] = useState<Partial<ReplaySubmissionData>>({
    email: '',
    discordTag: '',
    coachingType: undefined,
    rank: undefined,
    role: undefined,
    hero: '',
    replays: [{ code: '', mapName: '', notes: '' }],
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissionId, setSubmissionId] = useState<string>('');

  // Pre-select coaching type from URL parameter
  useEffect(() => {
    if (typeParam && coachingTypes.includes(typeParam)) {
      setSelectedType(typeParam);
      setFormData((prev) => ({ ...prev, coachingType: typeParam }));
    }
  }, [typeParam]);

  const coachingTypesList = [
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
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleReplayChange = (index: number, field: keyof ReplayCodeData, value: string) => {
    const newReplays = [...(formData.replays || [])];
    newReplays[index] = { ...newReplays[index], [field]: field === 'code' ? value.toUpperCase() : value };
    setFormData((prev) => ({ ...prev, replays: newReplays }));

    // Clear error for this replay field
    if (errors.replays?.[index]?.[field]) {
      const newErrors = { ...errors };
      if (newErrors.replays?.[index]) {
        delete newErrors.replays[index][field];
      }
      setErrors(newErrors);
    }
  };

  const addReplay = () => {
    if ((formData.replays?.length || 0) < 5) {
      setFormData((prev) => ({
        ...prev,
        replays: [...(prev.replays || []), { code: '', mapName: '', notes: '' }],
      }));
    }
  };

  const removeReplay = (index: number) => {
    if ((formData.replays?.length || 0) > 1) {
      const newReplays = formData.replays?.filter((_, i) => i !== index) || [];
      setFormData((prev) => ({ ...prev, replays: newReplays }));

      // Clear errors for removed replay
      if (errors.replays?.[index]) {
        const newErrors = { ...errors };
        if (newErrors.replays) {
          newErrors.replays = newErrors.replays.filter((_: any, i: number) => i !== index);
        }
        setErrors(newErrors);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitStatus('idle');

    // Validate form data
    const result = replaySubmissionSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.errors.forEach((error) => {
        const path = error.path;
        if (path.length === 1) {
          fieldErrors[path[0]] = error.message;
        } else if (path.length > 1) {
          // Handle nested errors for replays
          const [field, index, subfield] = path;
          if (!fieldErrors[field]) fieldErrors[field] = [];
          if (!fieldErrors[field][index as number]) fieldErrors[field][index as number] = {};
          fieldErrors[field][index as number][subfield as string] = error.message;
        }
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
        throw new Error('Failed to submit replay codes');
      }

      const data = await response.json();
      setSubmissionId(data.submissionId);
      setSubmitStatus('success');
      setFormData({
        email: '',
        discordTag: '',
        coachingType: selectedType || undefined,
        rank: undefined,
        role: undefined,
        hero: '',
        replays: [{ code: '', mapName: '', notes: '' }],
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
    setFormData((prev) => ({ ...prev, coachingType: type }));
    setSubmitStatus('idle');
  };

  const handleBack = () => {
    setSelectedType(null);
    setSubmitStatus('idle');
    setSubmissionId('');
  };

  const getCoachingTypeDescription = () => {
    switch (selectedType) {
      case 'review-async':
        return 'Submit your Overwatch replay codes for a detailed review. I\'ll analyze your gameplay and send comprehensive notes via Discord or email.';
      case 'vod-review':
        return 'Submit your replay codes and we\'ll review them together live over Discord. Perfect for interactive learning and immediate feedback.';
      case 'live-coaching':
        return 'Submit replay codes from recent games so I can understand your playstyle before our live session where you\'ll stream your gameplay for real-time coaching.';
      default:
        return '';
    }
  };

  const getTurnaroundMessage = () => {
    switch (selectedType) {
      case 'review-async':
        return 'Expected turnaround: 2-3 business days';
      case 'vod-review':
        return 'We\'ll schedule a live session after reviewing your submission';
      case 'live-coaching':
        return 'We\'ll schedule a live session after reviewing your submission';
      default:
        return '';
    }
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
              {selectedType ? 'Submit your replay codes' : 'Choose your coaching style to get started'}
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
                {coachingTypesList.map((type) => (
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
            </div>
          )}

          {/* Replay Submission Form - Applied to all coaching types */}
          {selectedType && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <Button variant="outline" size="sm" onClick={handleBack}>
                  ← Back to Selection
                </Button>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-100 mb-4">Submit Your Replay Codes</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  {getCoachingTypeDescription()}
                </p>
                <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
                  <p className="text-purple-400 font-medium">
                    {getTurnaroundMessage()}
                  </p>
                </div>
              </div>

              <Card variant="surface" padding="lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
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

                  {/* Player Information */}
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

                  {/* Replay Codes Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-100">
                        Replay Codes <span className="text-red-500">*</span>
                      </h3>
                      <span className="text-sm text-gray-400">
                        {formData.replays?.length || 0} / 5 replays
                      </span>
                    </div>

                    {errors.replays && typeof errors.replays === 'string' && (
                      <p className="text-sm text-red-400">{errors.replays}</p>
                    )}

                    {formData.replays?.map((replay, index) => (
                      <Card key={index} variant="surface" className="bg-[#1a1a2e] border border-[#2a2a40]">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-semibold text-gray-200">Replay {index + 1}</h4>
                            {(formData.replays?.length || 0) > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeReplay(index)}
                                disabled={isSubmitting}
                                className="text-red-400 hover:text-red-300 border-red-400/30 hover:border-red-400"
                              >
                                Remove
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Replay Code"
                              name={`replay-code-${index}`}
                              type="text"
                              value={replay.code}
                              onChange={(e) => handleReplayChange(index, 'code', e.target.value)}
                              error={errors.replays?.[index]?.code}
                              required
                              placeholder="ABC123"
                              disabled={isSubmitting}
                              helperText="6-10 character code"
                              className="font-mono text-lg"
                            />

                            <Input
                              label="Map Name"
                              name={`map-name-${index}`}
                              type="text"
                              value={replay.mapName}
                              onChange={(e) => handleReplayChange(index, 'mapName', e.target.value)}
                              error={errors.replays?.[index]?.mapName}
                              required
                              placeholder="e.g., King's Row, Ilios"
                              disabled={isSubmitting}
                            />
                          </div>

                          <Input
                            label="Notes for this Replay"
                            name={`notes-${index}`}
                            inputType="textarea"
                            rows={3}
                            value={replay.notes}
                            onChange={(e) => handleReplayChange(index, 'notes', e.target.value)}
                            error={errors.replays?.[index]?.notes}
                            placeholder="Any specific moments or questions about this game?"
                            disabled={isSubmitting}
                            helperText="Optional - max 500 characters"
                          />
                        </CardContent>
                      </Card>
                    ))}

                    {(formData.replays?.length || 0) < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addReplay}
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        + Add Another Replay
                      </Button>
                    )}
                  </div>

                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 font-medium mb-2">
                        Replay codes submitted successfully!
                      </p>
                      <div className="mb-2">
                        <p className="text-green-300 text-sm mb-1">
                          Your Submission ID:
                        </p>
                        <p className="text-green-100 font-mono text-sm bg-green-900/20 px-3 py-2 rounded border border-green-500/30 inline-block">
                          {submissionId}
                        </p>
                      </div>
                      <p className="text-green-300 text-sm mb-3">
                        {selectedType === 'review-async'
                          ? 'Next step: Complete payment to confirm your booking.'
                          : 'Next step: Pick a time slot below, then complete payment.'}
                      </p>
                      {selectedType === 'review-async' && (
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => router.push(`/checkout?submissionId=${submissionId}`)}
                          className="w-full"
                        >
                          Continue to Payment
                        </Button>
                      )}
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 font-medium">
                        Failed to submit replay codes. Please try again or contact me directly.
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
                      {isSubmitting ? 'Submitting...' : 'Submit Replay Codes'}
                    </Button>
                  </div>

                  <p className="text-sm text-gray-400 text-center">
                    By submitting, you agree to our terms of service and privacy policy
                  </p>
                </form>
              </Card>

              {/* Google Calendar Scheduling - Only for VOD Review and Live Coaching after successful submission */}
              {(selectedType === 'vod-review' || selectedType === 'live-coaching') && submitStatus === 'success' && submissionId && (
                <div className="mt-12">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-100 mb-4">Schedule Your Session</h2>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {selectedType === 'vod-review'
                        ? 'Book a time slot where we\'ll review your replays together over Discord. I\'ll stream the replays and provide live commentary while you can ask questions.'
                        : 'Book a time slot for live coaching where you\'ll stream your gameplay and receive real-time guidance and corrections as you play.'}
                    </p>
                    <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
                      <p className="text-purple-400 font-medium mb-2">
                        📋 Remember to include your Submission ID when booking:
                      </p>
                      <p className="text-purple-200 font-mono text-sm bg-purple-900/20 px-3 py-2 rounded border border-purple-500/30 inline-block">
                        {submissionId}
                      </p>
                    </div>
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

                  <Card variant="elevated" padding="lg">
                    <CardHeader>
                      <CardTitle>Select Your Time Slot</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL ? (
                        <div
                          className="w-full rounded-lg overflow-hidden bg-[#1a1a2e]"
                          style={{ height: '800px' }}
                        >
                          <iframe
                            src={(() => {
                              const baseUrl = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL;
                              const separator = baseUrl.includes('?') ? '&' : '?';
                              // Dark theme colors matching the site design
                              const params = [
                                'bgcolor=%231a1a2e',     // Dark surface background
                                'color=%238b5cf6',       // Purple accent for events
                                'showTitle=0',           // Hide title for cleaner look
                                'showNav=1',             // Show navigation
                                'showPrint=0',           // Hide print
                                'showTabs=0',            // Hide tabs for cleaner look
                                'showCalendars=0',       // Hide calendar list
                                'showTz=0',              // Hide timezone
                                'mode=WEEK',             // Week view by default
                              ].join('&');
                              return `${baseUrl}${separator}${params}`;
                            })()}
                            className="w-full h-full border-0"
                            style={{
                              colorScheme: 'dark',
                              background: 'transparent'
                            }}
                            frameBorder="0"
                            scrolling="yes"
                            title="Book Your Coaching Session"
                          />
                        </div>
                      ) : (
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
                            <li>4. Set NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL in .env</li>
                          </ol>
                          <p className="text-sm text-purple-400 font-mono bg-purple-600/10 px-4 py-2 rounded inline-block">
                            NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Continue to Payment Button */}
                  <div className="mt-8">
                    <Card variant="surface" padding="lg">
                      <div className="text-center">
                        <p className="text-gray-300 mb-4">
                          Once you've selected your preferred time slot, proceed to payment to confirm your booking.
                        </p>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => router.push(`/checkout?submissionId=${submissionId}`)}
                          className="w-full"
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
