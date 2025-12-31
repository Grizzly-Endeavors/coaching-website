import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminLayoutClient } from './AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  return <AdminLayoutClient userEmail={session.user?.email}>{children}</AdminLayoutClient>;
}
