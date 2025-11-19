'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  replaySubmissionSchema,
  type ReplaySubmissionData,
  type ReplayCodeData,
  rankOptions,
  roleOptions,
  coachingTypes
} from '@/lib/validations';
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker';
import { FriendCodeDialog } from '@/components/booking/FriendCodeDialog';
import { logger } from '@/lib/logger';

type CoachingType = typeof coachingTypes[number];

interface ReplayFieldErrors {
  code?: string;
  mapName?: string;
  notes?: string;
}

interface FormErrors {
  email?: string;
  discordTag?: string;
  coachingType?: string;
  rank?: string;
  role?: string;
  hero?: string;
  replays?: Array<ReplayFieldErrors> | string;
  timeSlot?: string;
}

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get('type') as CoachingType | null;
  const formRef = useRef<HTMLFormElement>(null);

  const [selectedType, setSelectedType] = useState<CoachingType | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ReplaySubmissionData>>({
    email: '',
    discordTag: '',
    coachingType: undefined,
    rank: undefined,
    role: undefined,
    hero: '',
    replays: [
      { code: '', mapName: '', notes: '' },
      { code: '', mapName: '', notes: '' },
      { code: '', mapName: '', notes: '' },
    ],
  });
  const [generalNotes, setGeneralNotes] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [friendCodeDialogOpen, setFriendCodeDialogOpen] = useState(false);

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
    const errorKey = name as keyof FormErrors;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
    }
  };

  const handleReplayChange = (index: number, field: keyof ReplayCodeData, value: string) => {
    const newReplays = [...(formData.replays || [])];
    newReplays[index] = { ...newReplays[index], [field]: field === 'code' ? value.toUpperCase() : value };
    setFormData((prev) => ({ ...prev, replays: newReplays }));

    // Clear error for this replay field
    if (Array.isArray(errors.replays) && errors.replays[index]?.[field]) {
      const newErrors = { ...errors };
      if (Array.isArray(newErrors.replays) && newErrors.replays[index]) {
        delete newErrors.replays[index][field as keyof ReplayFieldErrors];
      }
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitStatus('idle');

    // For VOD Review and Live Coaching, require time slot selection
    if ((selectedType === 'vod-review' || selectedType === 'live-coaching') && !selectedTimeSlot) {
      setErrors({ timeSlot: 'Please select an appointment time' });
      // Scroll to time picker
      document.getElementById('time-slot-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Filter out empty replays (only include replays that have a code)
    const filledReplays = (formData.replays || []).filter(replay => replay.code.trim() !== '');

    // Add general notes to the first replay if it exists
    if (filledReplays.length > 0 && generalNotes.trim()) {
      filledReplays[0].notes = generalNotes.trim();
    }

    const dataToValidate = {
      ...formData,
      replays: filledReplays,
    };

    // Validate form data
    const result = replaySubmissionSchema.safeParse(dataToValidate);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((error) => {
        const path = error.path;
        if (path.length === 1) {
          const field = path[0] as keyof FormErrors;
          if (field !== 'replays') {
            (fieldErrors[field] as string | undefined) = error.message;
          }
        } else if (path.length > 1) {
          // Handle nested errors for replays
          const [field, index, subfield] = path;
          if (field === 'replays') {
            if (!Array.isArray(fieldErrors.replays)) {
              fieldErrors.replays = [];
            }
            if (!fieldErrors.replays[index as number]) {
              fieldErrors.replays[index as number] = {};
            }
            fieldErrors.replays[index as number][subfield as keyof ReplayFieldErrors] = error.message;
          }
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
        body: JSON.stringify({
          ...dataToValidate,
          scheduledAt: selectedTimeSlot || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit replay codes');
      }

      const data = await response.json();

      // Redirect directly to payment with submission ID
      router.push(`/checkout?submissionId=${data.submissionId}`);
    } catch (error) {
      logger.error('Error submitting form:', error instanceof Error ? error : new Error(String(error)));
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  const handleTypeSelection = (type: CoachingType) => {
    setSelectedType(type);
    setFormData((prev) => ({ ...prev, coachingType: type }));
    setSubmitStatus('idle');
    setSelectedTimeSlot(null); // Reset time slot when changing type
  };

  const handleBack = () => {
    setSelectedType(null);
    setSubmitStatus('idle');
    setSelectedTimeSlot(null);
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
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <Button variant="outline" size="sm" onClick={handleBack}>
                  ← Back to Selection
                </Button>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-100 mb-4">
                  {selectedType === 'review-async' ? 'Submit Your Replay Codes' : 'Submit Codes & Schedule Session'}
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  {getCoachingTypeDescription()}
                </p>
                <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
                  <p className="text-purple-400 font-medium">
                    {getTurnaroundMessage()}
                  </p>
                </div>
              </div>

              {/* For VOD Review and Live Coaching: Show form and time picker side-by-side */}
              {(selectedType === 'vod-review' || selectedType === 'live-coaching') ? (
                <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Left column: Form */}
                  <div>
                    <Card variant="surface" padding="lg">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                        className={`w-full px-4 py-2.5 bg-[#1a1a2e] border rounded-lg text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 ${errors.rank ? 'border-red-500' : 'border-[#2a2a40] hover:border-purple-600/50'}`}
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
                        className={`w-full px-4 py-2.5 bg-[#1a1a2e] border rounded-lg text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 ${errors.role ? 'border-red-500' : 'border-[#2a2a40] hover:border-purple-600/50'}`}
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
                    <h3 className="text-lg font-semibold text-gray-100">
                      Replay Codes <span className="text-red-500">*</span>
                    </h3>

                    {errors.replays && typeof errors.replays === 'string' && (
                      <p className="text-sm text-red-400">{errors.replays}</p>
                    )}

                    <div className="space-y-3">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            label={index === 0 ? "Replay Code" : `Replay Code ${index + 1} (optional)`}
                            name={`replay-code-${index}`}
                            type="text"
                            value={formData.replays?.[index]?.code || ''}
                            onChange={(e) => handleReplayChange(index, 'code', e.target.value)}
                            error={Array.isArray(errors.replays) ? errors.replays?.[index]?.code : undefined}
                            required={index === 0}
                            placeholder="ABC123"
                            disabled={isSubmitting}
                            className="font-mono"
                          />

                          <Input
                            label={index === 0 ? "Map Name" : `Map Name ${index + 1} (optional)`}
                            name={`map-name-${index}`}
                            type="text"
                            value={formData.replays?.[index]?.mapName || ''}
                            onChange={(e) => handleReplayChange(index, 'mapName', e.target.value)}
                            error={Array.isArray(errors.replays) ? errors.replays?.[index]?.mapName : undefined}
                            required={index === 0}
                            placeholder="e.g., King's Row, Ilios"
                            disabled={isSubmitting}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* General Notes Section */}
                  <div>
                    <Input
                      label="Notes for Coach"
                      name="general-notes"
                      inputType="textarea"
                      rows={3}
                      value={generalNotes}
                      onChange={(e) => setGeneralNotes(e.target.value)}
                      placeholder="Any specific moments or questions about your replays? What would you like to focus on?"
                      disabled={isSubmitting}
                      helperText="Optional - help me understand what you'd like to work on"
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 font-medium">
                        Failed to submit. Please try again or contact me directly.
                      </p>
                    </div>
                  )}

                </form>
              </Card>
            </div>

            {/* Right column: Time Slot Picker */}
            <div id="time-slot-picker" className="lg:sticky lg:top-4 lg:self-start">
              <TimeSlotPicker
                sessionType={selectedType}
                onSelectSlot={setSelectedTimeSlot}
                selectedSlot={selectedTimeSlot}
              />
            </div>
          </div>

          {/* Error and Submit Section - Below both columns */}
          <div className="max-w-2xl mx-auto space-y-4">
            {submitStatus === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                <p className="text-red-400 font-medium">
                  Failed to submit. Please try again or contact me directly.
                </p>
              </div>
            )}

            {errors.timeSlot && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                <p className="text-red-400 font-medium">
                  {errors.timeSlot}
                </p>
              </div>
            )}

            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={() => formRef.current?.requestSubmit()}
            >
              {isSubmitting ? 'Processing...' : 'Continue to Payment'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setFriendCodeDialogOpen(true)}
                className="text-xs text-gray-500 hover:text-gray-400 underline transition-colors"
              >
                or use a code
              </button>
            </div>

            <p className="text-sm text-gray-400 text-center">
              By submitting, you agree to our terms of service and privacy policy
            </p>
          </div>
        </>
        ) : (
          /* For Review Async: Show only the form */
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
                    className={`w-full px-4 py-2.5 bg-[#1a1a2e] border rounded-lg text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 ${errors.rank ? 'border-red-500' : 'border-[#2a2a40] hover:border-purple-600/50'}`}
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
                    className={`w-full px-4 py-2.5 bg-[#1a1a2e] border rounded-lg text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 ${errors.role ? 'border-red-500' : 'border-[#2a2a40] hover:border-purple-600/50'}`}
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
                <h3 className="text-lg font-semibold text-gray-100">
                  Replay Codes <span className="text-red-500">*</span>
                </h3>

                {errors.replays && typeof errors.replays === 'string' && (
                  <p className="text-sm text-red-400">{errors.replays}</p>
                )}

                <div className="space-y-3">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        label={index === 0 ? "Replay Code" : `Replay Code ${index + 1} (optional)`}
                        name={`replay-code-${index}`}
                        type="text"
                        value={formData.replays?.[index]?.code || ''}
                        onChange={(e) => handleReplayChange(index, 'code', e.target.value)}
                        error={Array.isArray(errors.replays) ? errors.replays?.[index]?.code : undefined}
                        required={index === 0}
                        placeholder="ABC123"
                        disabled={isSubmitting}
                        className="font-mono"
                      />

                      <Input
                        label={index === 0 ? "Map Name" : `Map Name ${index + 1} (optional)`}
                        name={`map-name-${index}`}
                        type="text"
                        value={formData.replays?.[index]?.mapName || ''}
                        onChange={(e) => handleReplayChange(index, 'mapName', e.target.value)}
                        error={Array.isArray(errors.replays) ? errors.replays?.[index]?.mapName : undefined}
                        required={index === 0}
                        placeholder="e.g., King's Row, Ilios"
                        disabled={isSubmitting}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* General Notes Section */}
              <div>
                <Input
                  label="Notes for Coach"
                  name="general-notes"
                  inputType="textarea"
                  rows={3}
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  placeholder="Any specific moments or questions about your replays? What would you like to focus on?"
                  disabled={isSubmitting}
                  helperText="Optional - help me understand what you'd like to work on"
                />
              </div>

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 font-medium">
                    Failed to submit. Please try again or contact me directly.
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
                  {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setFriendCodeDialogOpen(true)}
                  className="text-xs text-gray-500 hover:text-gray-400 underline transition-colors"
                >
                  or use a code
                </button>
              </div>

              <p className="text-sm text-gray-400 text-center">
                By submitting, you agree to our terms of service and privacy policy
              </p>
            </form>
          </Card>
        )}
            </div>
          )}
        </div>
      </section>

      {/* Friend Code Dialog */}
      {selectedType && (
        <FriendCodeDialog
          open={friendCodeDialogOpen}
          onOpenChange={setFriendCodeDialogOpen}
          submissionData={{
            email: formData.email,
            discordTag: formData.discordTag,
            coachingType: formData.coachingType,
            rank: formData.rank,
            role: formData.role,
            hero: formData.hero,
            replays: (formData.replays || []).filter(replay => replay.code.trim() !== '').map(replay => ({
              ...replay,
              notes: replay === formData.replays?.[0] && generalNotes.trim() ? generalNotes.trim() : replay.notes
            })),
          }}
          selectedTimeSlot={selectedTimeSlot}
        />
      )}
    </div>
  );
}

export default function GetCoachingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f23] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full"></div></div>}>
      <BookingContent />
    </Suspense>
  );
}