import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/lib/locales/client';
import { loadAllLocales } from '@/lib/locales/loader';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Overwatch Coaching | Sustainable Improvement',
  description: 'GM1 across all roles. Teaching you how to think, not just what to do. Overwatch coaching focused on sustainable improvement with a playful, results-driven approach.',
  keywords: ['overwatch coaching', 'overwatch 2', 'vod review', 'rank improvement', 'esports coaching', 'sustainable improvement'],
  authors: [{ name: 'Overwatch Coaching' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com',
    title: 'Overwatch Coaching | Sustainable Improvement',
    description: 'GM1 across all roles. Teaching you how to think, not just what to do. Sustainable improvement with a playful approach.',
    siteName: 'Overwatch Coaching',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Overwatch Coaching | Sustainable Improvement',
    description: 'GM1 across all roles. Teaching you how to think, not just what to do. Sustainable improvement with a playful approach.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locales = loadAllLocales();
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <LocaleProvider locales={locales}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
