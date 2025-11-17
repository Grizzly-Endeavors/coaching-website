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
import { ReviewDetails } from '@/lib/email';

interface ReviewReadyProps {
  reviewDetails: ReviewDetails;
}

export default function ReviewReady({ reviewDetails }: ReviewReadyProps) {
  const formattedDate = reviewDetails.reviewedAt
    ? new Date(reviewDetails.reviewedAt).toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    : 'Recently';

  return (
    <Html>
      <Head />
      <Preview>Your Overwatch replay review is ready to watch!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>🎉 Your Review is Ready!</Heading>
            <Text style={subtitle}>Your personalized coaching analysis is complete</Text>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>
              Great news! We've finished analyzing your gameplay and your detailed video review is
              now available.
            </Text>

            <Section style={highlightBox}>
              <Heading as="h2" style={h2}>
                Review Information
              </Heading>
              <Hr style={divider} />

              <table style={detailsTable}>
                <tbody>
                  <tr>
                    <td style={detailLabel}>Replay Code:</td>
                    <td style={highlightValue}>{reviewDetails.replayCode}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Rank:</td>
                    <td style={detailValue}>{reviewDetails.rank}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Role:</td>
                    <td style={detailValue}>{reviewDetails.role}</td>
                  </tr>
                  {reviewDetails.hero && (
                    <tr>
                      <td style={detailLabel}>Hero:</td>
                      <td style={detailValue}>{reviewDetails.hero}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={detailLabel}>Reviewed:</td>
                    <td style={detailValue}>{formattedDate}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {reviewDetails.reviewNotes && (
              <Section style={notesBox}>
                <Heading as="h2" style={h2}>
                  Coach's Summary
                </Heading>
                <Text style={notesText}>{reviewDetails.reviewNotes}</Text>
              </Section>
            )}

            {reviewDetails.reviewUrl && (
              <Section style={videoSection}>
                <Heading as="h2" style={h2}>
                  Watch Your Review
                </Heading>
                <Text style={paragraph}>
                  Click the button below to watch your personalized coaching video. We've analyzed
                  your positioning, decision-making, and overall gameplay to help you improve.
                </Text>

                <Section style={ctaSection}>
                  <Link href={reviewDetails.reviewUrl} style={button}>
                    Watch Review Video
                  </Link>
                </Section>

                <Text style={linkText}>
                  Or copy this link: <br />
                  <Link href={reviewDetails.reviewUrl} style={link}>
                    {reviewDetails.reviewUrl}
                  </Link>
                </Text>
              </Section>
            )}

            <Section style={tipsBox}>
              <Heading as="h2" style={h2}>
                Getting the Most From Your Review
              </Heading>
              <Text style={paragraph}>
                ✓ Watch the full review from start to finish
                <br />
                ✓ Take notes on key improvement areas
                <br />
                ✓ Focus on one or two areas to practice first
                <br />
                ✓ Apply the feedback in your next games
                <br />
                ✓ Submit another replay in 1-2 weeks to track progress
              </Text>
            </Section>

            <Section style={nextStepsBox}>
              <Heading as="h2" style={h2}>
                Ready to Take It Further?
              </Heading>
              <Text style={paragraph}>
                If you'd like more personalized coaching or have questions about the review, book a
                live 1-on-1 session where we can work together in real-time.
              </Text>

              <Section style={ctaSection}>
                <Link href="https://yourdomain.com/booking" style={secondaryButton}>
                  Book a Live Session
                </Link>
              </Section>
            </Section>

            <Text style={paragraph}>
              Thank you for trusting us with your coaching! We're excited to see your improvement.
            </Text>
          </Section>

          <Section style={footer}>
            <Hr style={divider} />
            <Text style={footerText}>
              Overwatch Coaching - Helping you rank up faster
              <br />
              <Link href="https://yourdomain.com" style={link}>
                Visit our website
              </Link>
              {' | '}
              <Link href="https://yourdomain.com/booking" style={link}>
                Submit another replay
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

const highlightBox = {
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

const highlightValue = {
  color: '#a78bfa',
  fontSize: '16px',
  padding: '8px 0',
  fontWeight: '700',
  fontFamily: 'monospace',
};

const notesBox = {
  backgroundColor: '#2a2a40',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  borderLeft: '4px solid #8b5cf6',
};

const notesText = {
  color: '#e5e7eb',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const videoSection = {
  margin: '32px 0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const button = {
  backgroundColor: '#8b5cf6',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '700',
  textDecoration: 'none',
  padding: '16px 40px',
  borderRadius: '8px',
  display: 'inline-block',
  boxShadow: '0 0 24px rgba(139, 92, 246, 0.4)',
};

const secondaryButton = {
  backgroundColor: 'transparent',
  border: '2px solid #8b5cf6',
  color: '#8b5cf6',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 32px',
  borderRadius: '8px',
  display: 'inline-block',
};

const linkText = {
  color: '#6b7280',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '16px 0 0 0',
  lineHeight: '1.6',
};

const tipsBox = {
  backgroundColor: '#2a2a40',
  borderRadius: '8px',
  padding: '20px',
  margin: '32px 0',
};

const nextStepsBox = {
  backgroundColor: '#2a2a40',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
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
