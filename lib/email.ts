import { Resend } from 'resend';
import { prisma } from './prisma';
import { EmailType, EmailStatus } from '@prisma/client';
import SubmissionConfirmation from '@/emails/SubmissionConfirmation';
import SubmissionNotification from '@/emails/SubmissionNotification';
import ReviewReady from '@/emails/ReviewReady';
import BookingConfirmation from '@/emails/BookingConfirmation';
import ContactForm from '@/emails/ContactForm';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration
const FROM_EMAIL = 'coaching@yourdomain.com'; // Update with your verified domain
const FROM_NAME = 'Overwatch Coaching';

// Types for email function parameters
export interface SubmissionDetails {
  id: string;
  email: string;
  discordTag?: string | null;
  replayCode: string;
  rank: string;
  role: string;
  hero?: string | null;
  notes?: string | null;
  submittedAt: Date;
}

export interface ReviewDetails {
  id: string;
  email: string;
  replayCode: string;
  rank: string;
  role: string;
  hero?: string | null;
  reviewNotes?: string | null;
  reviewUrl?: string | null;
  reviewedAt?: Date | null;
}

export interface BookingDetails {
  id: string;
  email: string;
  sessionType: string;
  scheduledAt: Date;
  notes?: string | null;
}

export interface ContactDetails {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
}

/**
 * Log email sent to the database
 */
async function logEmailSent(
  to: string,
  subject: string,
  type: EmailType,
  status: EmailStatus,
  error?: string
): Promise<void> {
  try {
    await prisma.emailLog.create({
      data: {
        to,
        subject,
        type,
        status,
        error: error || null,
      },
    });
  } catch (err) {
    console.error('Failed to log email:', err);
    // Don't throw - logging failure shouldn't break email sending
  }
}

/**
 * Send confirmation email to user when they submit a replay
 */
export async function sendSubmissionConfirmation(
  to: string,
  submissionDetails: SubmissionDetails
): Promise<{ success: boolean; error?: string }> {
  const subject = 'Replay Submission Received - Overwatch Coaching';

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject,
      react: SubmissionConfirmation({ submissionDetails }),
    });

    if (error) {
      console.error('Failed to send submission confirmation:', error);
      await logEmailSent(to, subject, EmailType.SUBMISSION_RECEIVED, EmailStatus.FAILED, error.message);
      return { success: false, error: error.message };
    }

    await logEmailSent(to, subject, EmailType.SUBMISSION_RECEIVED, EmailStatus.SENT);
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to send submission confirmation:', err);
    await logEmailSent(to, subject, EmailType.SUBMISSION_RECEIVED, EmailStatus.FAILED, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send notification to admin when a new replay is submitted
 */
export async function sendSubmissionNotification(
  adminEmail: string,
  submissionDetails: SubmissionDetails
): Promise<{ success: boolean; error?: string }> {
  const subject = `New Replay Submission - ${submissionDetails.rank} ${submissionDetails.role}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [adminEmail],
      subject,
      react: SubmissionNotification({ submissionDetails }),
    });

    if (error) {
      console.error('Failed to send submission notification:', error);
      await logEmailSent(adminEmail, subject, EmailType.SUBMISSION_RECEIVED, EmailStatus.FAILED, error.message);
      return { success: false, error: error.message };
    }

    await logEmailSent(adminEmail, subject, EmailType.SUBMISSION_RECEIVED, EmailStatus.SENT);
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to send submission notification:', err);
    await logEmailSent(adminEmail, subject, EmailType.SUBMISSION_RECEIVED, EmailStatus.FAILED, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send email to user when their review is ready
 */
export async function sendReviewReady(
  to: string,
  reviewDetails: ReviewDetails
): Promise<{ success: boolean; error?: string }> {
  const subject = 'Your Replay Review is Ready! - Overwatch Coaching';

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject,
      react: ReviewReady({ reviewDetails }),
    });

    if (error) {
      console.error('Failed to send review ready email:', error);
      await logEmailSent(to, subject, EmailType.REVIEW_READY, EmailStatus.FAILED, error.message);
      return { success: false, error: error.message };
    }

    await logEmailSent(to, subject, EmailType.REVIEW_READY, EmailStatus.SENT);
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to send review ready email:', err);
    await logEmailSent(to, subject, EmailType.REVIEW_READY, EmailStatus.FAILED, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send confirmation email when a booking is created
 */
export async function sendBookingConfirmation(
  to: string,
  bookingDetails: BookingDetails
): Promise<{ success: boolean; error?: string }> {
  const subject = 'Coaching Session Confirmed - Overwatch Coaching';

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject,
      react: BookingConfirmation({ bookingDetails }),
    });

    if (error) {
      console.error('Failed to send booking confirmation:', error);
      await logEmailSent(to, subject, EmailType.BOOKING_CONFIRMED, EmailStatus.FAILED, error.message);
      return { success: false, error: error.message };
    }

    await logEmailSent(to, subject, EmailType.BOOKING_CONFIRMED, EmailStatus.SENT);
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to send booking confirmation:', err);
    await logEmailSent(to, subject, EmailType.BOOKING_CONFIRMED, EmailStatus.FAILED, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send contact form submission to admin
 */
export async function sendContactFormEmail(
  adminEmail: string,
  contactDetails: ContactDetails
): Promise<{ success: boolean; error?: string }> {
  const subject = `New Contact Form Submission - ${contactDetails.name}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [adminEmail],
      subject,
      react: ContactForm({ contactDetails }),
      // Set reply-to as the contact's email for easy responses
      reply_to: contactDetails.email,
    });

    if (error) {
      console.error('Failed to send contact form email:', error);
      // Note: Contact form doesn't have a dedicated EmailType, using SUBMISSION_RECEIVED
      await logEmailSent(adminEmail, subject, EmailType.SUBMISSION_RECEIVED, EmailStatus.FAILED, error.message);
      return { success: false, error: error.message };
    }

    await logEmailSent(adminEmail, subject, EmailType.SUBMISSION_RECEIVED, EmailStatus.SENT);
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to send contact form email:', err);
    await logEmailSent(adminEmail, subject, EmailType.SUBMISSION_RECEIVED, EmailStatus.FAILED, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Exported function to manually log emails if needed
 */
export { logEmailSent };
