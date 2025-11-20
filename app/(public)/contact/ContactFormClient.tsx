'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { contactFormSchema, type ContactFormInput } from '@/lib/validations';
import { useFormState } from '@/hooks';
import { logger } from '@/lib/logger';
import type { LocaleData } from '@/lib/locales/types';

type ContactFormData = ContactFormInput;

interface ContactFormClientProps {
  locale: LocaleData;
}

export default function ContactFormClient({ locale }: ContactFormClientProps) {
  const {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    handleChange,
    validate,
    setIsSubmitting,
    setSubmitStatus,
    reset,
  } = useFormState<ContactFormData>({
    initialData: {
      name: '',
      email: '',
      message: '',
    },
    schema: contactFormSchema,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');
      reset();
    } catch (error) {
      logger.error('Error submitting form:', error instanceof Error ? error : new Error(String(error)));
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              {locale.hero?.title}
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {locale.hero?.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-[#0f0f23] flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-100 mb-6">{locale.form?.section_title}</h2>
                <Card variant="surface" padding="lg">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      label={locale.form?.fields?.name?.label || 'Name'}
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      required
                      placeholder={locale.form?.fields?.name?.placeholder}
                      disabled={isSubmitting}
                    />

                    <Input
                      label={locale.form?.fields?.email?.label || 'Email'}
                      name="email"
                      type="email"
                      inputType="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      required
                      placeholder={locale.form?.fields?.email?.placeholder}
                      disabled={isSubmitting}
                    />

                    <Input
                      label={locale.form?.fields?.message?.label || 'Message'}
                      name="message"
                      inputType="textarea"
                      rows={locale.form?.fields?.message?.rows || 6}
                      value={formData.message}
                      onChange={handleChange}
                      error={errors.message}
                      required
                      placeholder={locale.form?.fields?.message?.placeholder}
                      disabled={isSubmitting}
                    />

                    {submitStatus === 'success' && (
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-green-400 font-medium">
                          {locale.form?.states?.success?.title}
                        </p>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 font-medium">
                          {locale.form?.states?.error?.title}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? locale.form?.submit?.loading : locale.form?.submit?.default}
                    </Button>
                  </form>
                </Card>

                <div className="mt-6">
                  <p className="text-sm text-gray-400">
                    {locale.form?.privacy_note}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-gray-100 mb-6">{locale.contact_info?.section_title}</h2>

                <div className="space-y-6">
                  <Card variant="surface" padding="lg">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-600/20 rounded-lg mr-4 flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-100 text-lg mb-2">{locale.contact_info?.email?.title}</h3>
                        <p className="text-gray-400">
                          <a href={`mailto:${locale.contact_info?.email?.address}`} className="hover:text-purple-400 transition-colors">
                            {locale.contact_info?.email?.address}
                          </a>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {locale.contact_info?.email?.note}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card variant="surface" padding="lg">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-600/20 rounded-lg mr-4 flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0a12.64 12.64 0 00-.617-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028a14.09 14.09 0 001.226-1.994a.076.076 0 00-.041-.106a13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.128a10.2 10.2 0 00.372-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127a12.299 12.299 0 01-1.873.892a.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028a19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-100 text-lg mb-2">{locale.contact_info?.discord?.title}</h3>
                        <p className="text-gray-400">
                          <span className="font-mono">{locale.contact_info?.discord?.tag}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {locale.contact_info?.discord?.note}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card variant="surface" padding="lg">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-600/20 rounded-lg mr-4 flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-100 text-lg mb-2">{locale.contact_info?.response_time?.title}</h3>
                        <p className="text-gray-400">
                          {locale.contact_info?.response_time?.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {locale.contact_info?.response_time?.note}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card variant="surface" padding="lg" className="bg-purple-600/10 border-purple-600/30">
                    <h3 className="font-bold text-gray-100 text-lg mb-3">{locale.contact_info?.booking_card?.title}</h3>
                    <p className="text-gray-300 mb-4">
                      {locale.contact_info?.booking_card?.description}
                    </p>
                    <a href="/booking" className="block">
                      <Button variant="primary" size="md" className="w-full">
                        {locale.contact_info?.booking_card?.button}
                      </Button>
                    </a>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
