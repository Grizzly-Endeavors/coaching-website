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
import { ContactDetails } from '@/lib/email';

interface ContactFormProps {
  contactDetails: ContactDetails;
}

export default function ContactForm({ contactDetails }: ContactFormProps) {
  const formattedDate = new Date(contactDetails.submittedAt).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {contactDetails.name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>📬 New Contact Form Submission</Heading>
          </Section>

          <Section style={content}>
            <Section style={urgentBox}>
              <Text style={urgentText}>
                A new message has been submitted through the contact form.
              </Text>
            </Section>

            <Section style={senderBox}>
              <Heading as="h2" style={h2}>
                From
              </Heading>
              <Hr style={divider} />

              <table style={detailsTable}>
                <tbody>
                  <tr>
                    <td style={detailLabel}>Name:</td>
                    <td style={detailValue}>{contactDetails.name}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Email:</td>
                    <td style={emailValue}>
                      <Link href={`mailto:${contactDetails.email}`} style={emailLink}>
                        {contactDetails.email}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Submitted:</td>
                    <td style={detailValue}>{formattedDate}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Section style={messageBox}>
              <Heading as="h2" style={h2}>
                Message
              </Heading>
              <Hr style={divider} />
              <Text style={messageText}>{contactDetails.message}</Text>
            </Section>

            <Section style={actionBox}>
              <Heading as="h2" style={h2}>
                Recommended Actions
              </Heading>
              <Text style={paragraph}>
                ✓ Reply to this email (reply-to is set to sender's email)
                <br />
                ✓ Respond within 24 hours for best customer experience
                <br />
                ✓ Check if this is a potential client or existing customer
                <br />
                ✓ Consider sending relevant service information
              </Text>
            </Section>

            <Section style={ctaSection}>
              <Link href={`mailto:${contactDetails.email}`} style={button}>
                Reply to {contactDetails.name}
              </Link>
            </Section>

            <Section style={tipsBox}>
              <Text style={tipsText}>
                💡 <strong style={strongText}>Quick Tip:</strong> Personalize your response and
                mention specific details from their message to show you've read it carefully. Fast,
                thoughtful responses convert inquiries into bookings!
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

const senderBox = {
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
  width: '100px',
  verticalAlign: 'top',
};

const detailValue = {
  color: '#e5e7eb',
  fontSize: '14px',
  padding: '8px 0',
  fontWeight: '500',
};

const emailValue = {
  padding: '8px 0',
};

const emailLink = {
  color: '#a78bfa',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
};

const messageBox = {
  backgroundColor: '#2a2a40',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  border: '2px solid #8b5cf6',
};

const messageText = {
  color: '#e5e7eb',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
  backgroundColor: '#1a1a2e',
  padding: '16px',
  borderRadius: '6px',
};

const actionBox = {
  backgroundColor: '#2a2a40',
  borderRadius: '8px',
  padding: '20px',
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

const tipsBox = {
  backgroundColor: '#2a2a40',
  borderRadius: '8px',
  padding: '16px 20px',
  margin: '24px 0 0 0',
};

const tipsText = {
  color: '#9ca3af',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
};

const strongText = {
  color: '#e5e7eb',
  fontWeight: '600',
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
