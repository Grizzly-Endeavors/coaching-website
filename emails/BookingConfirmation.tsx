import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from '@react-email/components';
import * as React from 'react';
import { BookingDetails } from '@/lib/email';

interface BookingConfirmationProps {
  bookingDetails: BookingDetails;
}

export default function BookingConfirmation({ bookingDetails }: BookingConfirmationProps) {
  const scheduledDate = new Date(bookingDetails.scheduledAt);

  const formattedDate = scheduledDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  // Calculate time until session
  const now = new Date();
  const timeDiff = scheduledDate.getTime() - now.getTime();
  const daysUntil = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursUntil = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  let timeUntilText = '';
  if (daysUntil > 0) {
    timeUntilText = `in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
  } else if (hoursUntil > 0) {
    timeUntilText = `in ${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''}`;
  } else {
    timeUntilText = 'today';
  }

  // Calendar download link (simplified - you'd generate an .ics file in production)
  const calendarLink = `https://yourdomain.com/api/calendar/event/${bookingDetails.id}`;

  return (
    <Html>
      <Head />
      <Preview>
        Your coaching session is confirmed for {formattedDate} at {formattedTime}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>✅ Session Confirmed!</Heading>
            <Text style={subtitle}>We're looking forward to coaching you</Text>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>
              Your Overwatch coaching session has been successfully scheduled. Get ready to level up
              your gameplay!
            </Text>

            <Section style={dateBox}>
              <div style={dateIcon}>📅</div>
              <Heading as="h2" style={h2}>
                {formattedDate}
              </Heading>
              <Text style={timeText}>{formattedTime}</Text>
              <Text style={countdownText}>({timeUntilText})</Text>
            </Section>

            <Section style={detailsBox}>
              <Heading as="h2" style={h2}>
                Session Details
              </Heading>
              <Hr style={divider} />

              <table style={detailsTable}>
                <tbody>
                  <tr>
                    <td style={detailLabel}>Session Type:</td>
                    <td style={detailValue}>{bookingDetails.sessionType}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Booking ID:</td>
                    <td style={detailValue}>{bookingDetails.id}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Email:</td>
                    <td style={detailValue}>{bookingDetails.email}</td>
                  </tr>
                </tbody>
              </table>

              {bookingDetails.notes && (
                <>
                  <Heading as="h3" style={h3}>
                    Your Notes:
                  </Heading>
                  <Text style={notesText}>{bookingDetails.notes}</Text>
                </>
              )}
            </Section>

            <Section style={ctaSection}>
              <Link href={calendarLink} style={button}>
                Add to Calendar
              </Link>
            </Section>

            <Section style={prepBox}>
              <Heading as="h2" style={h2}>
                How to Prepare
              </Heading>
              <Text style={paragraph}>
                To get the most out of your coaching session:
              </Text>
              <Text style={paragraph}>
                ✓ Have specific questions or VODs ready to discuss
                <br />
                ✓ Join Discord 5 minutes early (link will be sent 24hrs before)
                <br />
                ✓ Ensure your screen share is working
                <br />
                ✓ Be ready to take notes during the session
                <br />
                ✓ Have replay codes ready if doing VOD review
              </Text>
            </Section>

            <Section style={infoBox}>
              <Heading as="h2" style={h2}>
                What to Expect
              </Heading>
              <Text style={paragraph}>
                <strong style={strongText}>During the session:</strong>
                <br />
                • Personalized gameplay analysis and tips
                <br />
                • Live VOD review and discussion
                <br />
                • Q&A about your specific questions
                <br />
                • Actionable improvement plan
                <br />
                <br />
                <strong style={strongText}>After the session:</strong>
                <br />
                • Recording available for review
                <br />
                • Written summary of key points
                <br />
                • Follow-up support via Discord
              </Text>
            </Section>

            <Section style={rescheduleBox}>
              <Text style={rescheduleText}>
                <strong style={strongText}>Need to reschedule?</strong>
                <br />
                Please contact us at least 24 hours in advance. You can reschedule through your
                Google Calendar invitation or by replying to this email.
              </Text>
            </Section>

            <Text style={paragraph}>
              If you have any questions before the session, feel free to reach out. We're excited to
              help you improve!
            </Text>
          </Section>

          <Section style={footer}>
            <Hr style={divider} />
            <Text style={footerText}>
              Overwatch Coaching - Professional coaching to help you rank up
              <br />
              <Link href="https://yourdomain.com" style={link}>
                Visit our website
              </Link>
              {' | '}
              <Link href="https://yourdomain.com/contact" style={link}>
                Contact us
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles matching the dark purple design system
const main = {
  backgroundColor: '#0f0f23',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px 24px',
  backgroundColor: '#1a1a2e',
  borderRadius: '12px 12px 0 0',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#e5e7eb',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  lineHeight: '1.2',
};

const subtitle = {
  color: '#a78bfa',
  fontSize: '18px',
  fontWeight: '500',
  margin: '0',
};

const h2 = {
  color: '#e5e7eb',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px 0',
};

const h3 = {
  color: '#e5e7eb',
  fontSize: '16px',
  fontWeight: '600',
  margin: '16px 0 8px 0',
};

const content = {
  backgroundColor: '#1a1a2e',
  padding: '0 24px 32px',
  borderRadius: '0 0 12px 12px',
};

const paragraph = {
  color: '#9ca3af',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const dateBox = {
  backgroundColor: '#2a2a40',
  borderRadius: '8px',
  padding: '32px 20px',
  margin: '32px 0',
  textAlign: 'center' as const,
  border: '2px solid #8b5cf6',
  boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
};

const dateIcon = {
  fontSize: '48px',
  marginBottom: '16px',
};

const timeText = {
  color: '#a78bfa',
  fontSize: '22px',
  fontWeight: '600',
  margin: '8px 0 4px 0',
};

const countdownText = {
  color: '#6b7280',
  fontSize: '16px',
  margin: '0',
};

const detailsBox = {
  backgroundColor: '#2a2a40',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const detailsTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const detailLabel = {
  color: '#9ca3af',
  fontSize: '14px',
  padding: '8px 0',
  width: '130px',
  verticalAlign: 'top',
};

const detailValue = {
  color: '#e5e7eb',
  fontSize: '14px',
  padding: '8px 0',
  fontWeight: '500',
};

const notesText = {
  color: '#e5e7eb',
  fontSize: '14px',
  lineHeight: '1.6',
  backgroundColor: '#1a1a2e',
  padding: '12px',
  borderRadius: '6px',
  margin: '8px 0 0 0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#8b5cf6',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '14px 32px',
  borderRadius: '8px',
  display: 'inline-block',
  boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
};

const prepBox = {
  backgroundColor: '#2a2a40',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const infoBox = {
  backgroundColor: '#2a2a40',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const strongText = {
  color: '#e5e7eb',
  fontWeight: '600',
};

const rescheduleBox = {
  backgroundColor: '#2a2a40',
  borderLeft: '4px solid #f59e0b',
  borderRadius: '8px',
  padding: '16px 20px',
  margin: '24px 0',
};

const rescheduleText = {
  color: '#9ca3af',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
};

const footer = {
  padding: '24px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '0',
  lineHeight: '1.6',
};

const link = {
  color: '#8b5cf6',
  textDecoration: 'none',
};

const divider = {
  borderColor: '#2a2a40',
  margin: '16px 0',
};
