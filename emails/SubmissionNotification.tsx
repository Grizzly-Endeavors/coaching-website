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
import { SubmissionDetails } from '@/lib/email';

interface SubmissionNotificationProps {
  submissionDetails: SubmissionDetails;
}

export default function SubmissionNotification({
  submissionDetails,
}: SubmissionNotificationProps) {
  const formattedDate = new Date(submissionDetails.submittedAt).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  // Create admin dashboard link
  const adminLink = `https://yourdomain.com/admin/submissions/${submissionDetails.id}`;

  return (
    <Html>
      <Head />
      <Preview>
        New replay submission from {submissionDetails.rank} {submissionDetails.role} - {String(submissionDetails.replays.length)} replays
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>🎮 New Replay Submission</Heading>
            <Text style={subtitle}>
              {submissionDetails.rank} {submissionDetails.role} - {submissionDetails.replays.length} {submissionDetails.replays.length === 1 ? 'Replay' : 'Replays'}
            </Text>
          </Section>

          <Section style={content}>
            <Section style={urgentBox}>
              <Text style={urgentText}>
                A new replay code has been submitted and is awaiting review.
              </Text>
            </Section>

            <Section style={infoBox}>
              <Heading as="h2" style={h2}>
                Submission Details
              </Heading>
              <Hr style={divider} />

              <table style={detailsTable}>
                <tbody>
                  <tr>
                    <td style={detailLabel}>Submission ID:</td>
                    <td style={detailValue}>{submissionDetails.id}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Coaching Type:</td>
                    <td style={detailValue}>
                      {submissionDetails.coachingType === 'review-async' && 'Review on My Time'}
                      {submissionDetails.coachingType === 'vod-review' && 'VOD Review'}
                      {submissionDetails.coachingType === 'live-coaching' && 'Live Coaching'}
                    </td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Email:</td>
                    <td style={detailValue}>{submissionDetails.email}</td>
                  </tr>
                  {submissionDetails.discordTag && (
                    <tr>
                      <td style={detailLabel}>Discord:</td>
                      <td style={detailValue}>{submissionDetails.discordTag}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={detailLabel}>Rank:</td>
                    <td style={detailValue}>{submissionDetails.rank}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Role:</td>
                    <td style={detailValue}>{submissionDetails.role}</td>
                  </tr>
                  {submissionDetails.hero && (
                    <tr>
                      <td style={detailLabel}>Hero:</td>
                      <td style={detailValue}>{submissionDetails.hero}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={detailLabel}>Submitted:</td>
                    <td style={detailValue}>{formattedDate}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Section style={infoBox}>
              <Heading as="h2" style={h2}>
                Replay Codes ({submissionDetails.replays.length})
              </Heading>
              <Hr style={divider} />

              {submissionDetails.replays.map((replay, index) => (
                <Section key={index} style={replayItem}>
                  <Heading as="h3" style={h3}>
                    Replay {index + 1}
                  </Heading>
                  <table style={detailsTable}>
                    <tbody>
                      <tr>
                        <td style={detailLabel}>Code:</td>
                        <td style={highlightValue}>{replay.code}</td>
                      </tr>
                      <tr>
                        <td style={detailLabel}>Map:</td>
                        <td style={detailValue}>{replay.mapName}</td>
                      </tr>
                    </tbody>
                  </table>
                  {replay.notes && (
                    <>
                      <Text style={detailLabel}>Player Notes:</Text>
                      <Text style={notesText}>{replay.notes}</Text>
                    </>
                  )}
                </Section>
              ))}
            </Section>

            <Section style={actionSection}>
              <Heading as="h2" style={h2}>
                Next Steps
              </Heading>
              <Text style={paragraph}>
                1. Review the replay code in Overwatch
                <br />
                2. Record your analysis and coaching tips
                <br />
                3. Update the submission status in the admin panel
                <br />
                4. Add the review video URL and notes
                <br />
                5. Mark as completed to notify the player
              </Text>
            </Section>

            <Section style={ctaSection}>
              <Link href={adminLink} style={button}>
                View in Admin Panel
              </Link>
            </Section>

            <Section style={statsBox}>
              <Text style={statsText}>
                💡 Tip: Aim to complete reviews within 3-5 business days for the best client
                experience.
              </Text>
            </Section>
          </Section>

          <Section style={footer}>
            <Hr style={divider} />
            <Text style={footerText}>
              Overwatch Coaching - Admin Notification
              <br />
              <Link href="https://yourdomain.com/admin" style={link}>
                Go to Admin Dashboard
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
};

const h1 = {
  color: '#e5e7eb',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  lineHeight: '1.2',
};

const subtitle = {
  color: '#a78bfa',
  fontSize: '18px',
  fontWeight: '600',
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

const urgentBox = {
  backgroundColor: '#2a2a40',
  borderLeft: '4px solid #8b5cf6',
  borderRadius: '8px',
  padding: '16px 20px',
  margin: '0 0 24px 0',
};

const urgentText = {
  color: '#e5e7eb',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
};

const infoBox = {
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
  width: '140px',
  verticalAlign: 'top',
};

const detailValue = {
  color: '#e5e7eb',
  fontSize: '14px',
  padding: '8px 0',
  fontWeight: '500',
};

const highlightValue = {
  color: '#a78bfa',
  fontSize: '16px',
  padding: '8px 0',
  fontWeight: '700',
  fontFamily: 'monospace',
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

const replayItem = {
  backgroundColor: '#1a1a2e',
  borderRadius: '6px',
  padding: '16px',
  margin: '12px 0',
};

const actionSection = {
  margin: '24px 0',
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

const statsBox = {
  backgroundColor: '#2a2a40',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0 0 0',
};

const statsText = {
  color: '#9ca3af',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.6',
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
