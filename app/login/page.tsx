import { Suspense } from 'react';
import { loadLocale } from '@/lib/locales/loader';
import AdminLoginForm from './AdminLoginForm';

export default function AdminLoginPage() {
  // Load locale data server-side
  const locale = loadLocale('admin-login');

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b5cf6] mx-auto"></div>
            <p className="text-[#9ca3af] mt-4">{locale.loading?.message || 'Loading...'}</p>
          </div>
        </div>
      </div>
    }>
      <AdminLoginForm locale={locale} />
    </Suspense>
  );
}
