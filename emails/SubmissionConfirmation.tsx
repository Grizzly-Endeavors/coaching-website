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

interface SubmissionConfirmationProps {
  submissionDetails: SubmissionDetails;
}

export default function SubmissionConfirmation({
  submissionDetails,
}: SubmissionConfirmationProps) {
  const formattedDate = new Date(submissionDetails.submittedAt).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
    <Html>
      <Head />
      <Preview>Your replay submission has been received - Overwatch Coaching</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Replay Submission Received</Heading>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>
              Thank you for submitting your replay for review! We've received your submission and
              will begin analyzing your gameplay soon.
            </Text>

            <Section style={infoBox}>
              <Heading as="h2" style={h2}>
                Submission Details
              </Heading>
              <Hr style={divider} />

              <table style={detailsTable}>
                <tbody>
                  <tr>
                    <td style={detailLabel}>Replay Code:</td>
                    <td style={detailValue}>{submissionDetails.replayCode}</td>
                  </tr>
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
                  {submissionDetails.discordTag && (
                    <tr>
                      <td style={detailLabel}>Discord:</td>
                      <td style={detailValue}>{submissionDetails.discordTag}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={detailLabel}>Submitted:</td>
                    <td style={detailValue}>{formattedDate}</td>
                  </tr>
                </tbody>
              </table>

              {submissionDetails.notes && (
                <>
                  <Heading as="h3" style={h3}>
                    Your Notes:
                  </Heading>
                  <Text style={notesText}>{submissionDetails.notes}</Text>
                </>
              )}
            </Section>

            <Section style={nextSteps}>
              <Heading as="h2" style={h2}>
                What Happens Next?
              </Heading>
              <Text style={paragraph}>
                1. Your replay will be reviewed within 3-5 business days
                <br />
                2. We'll analyze your gameplay, positioning, and decision-making
                <br />
                3. You'll receive a detailed video review with personalized tips
                <br />
                4. We'll send you an email when your review is ready
              </Text>
            </Section>

            <Text style={paragraph}>
              If you have any questions in the meantime, feel free to reach out!
            </Text>

            <Section style={ctaSection}>
              <Link href="https://yourdomain.com/booking" style={button}>
                Book a Live Session
              </Link>
            </Section>
          </Section>

          <Section style={footer}>
            <Hr style={divider} />
            <Text style={footerText}>
              Overwatch Coaching - Professional coaching to help you rank up
              <br />
              <Link href="https://yourdomain.com" style={link}>
                Visit our website
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
  padding: '32px 24px',
  backgroundColor: '#1a1a2e',
  borderRadius: '12px 12px 0 0',
};

const h1 = {
  color: '#e5e7eb',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
  lineHeight: '1.2',
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
  width: '120px',
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

const nextSteps = {
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
