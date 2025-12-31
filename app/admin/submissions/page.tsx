import { loadLocale } from '@/lib/locales/loader';
import SubmissionsClient from './SubmissionsClient';

export default function SubmissionsPage() {
  // Load locale data server-side
  const locale = loadLocale('admin-submissions');

  return <SubmissionsClient locale={locale} />;
}
