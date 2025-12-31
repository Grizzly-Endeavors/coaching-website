import { loadLocale } from '@/lib/locales';
import ContactFormClient from './ContactFormClient';
import type { Metadata } from 'next';

const contactLocale = loadLocale('contact');
const metadataLocale = loadLocale('metadata');

export const metadata: Metadata = {
  title: metadataLocale.contact?.title as string || 'Contact Us',
  description: metadataLocale.contact?.description as string || 'Get in touch with us',
};

export default function ContactPage() {
  return <ContactFormClient locale={contactLocale} />;
}
