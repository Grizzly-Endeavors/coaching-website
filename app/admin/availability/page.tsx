import { loadLocale } from '@/lib/locales/loader';
import AvailabilityClient from './AvailabilityClient';

export default function AvailabilityPage() {
  // Load locale data server-side
  const locale = loadLocale('admin-availability');

  return <AvailabilityClient locale={locale} />;
}
