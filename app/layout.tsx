import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Overwatch Coaching | Professional Rank Improvement',
  description: 'Professional Overwatch coaching services. Get personalized VOD reviews, one-on-one coaching sessions, and rank up faster with expert guidance.',
  keywords: ['overwatch coaching', 'overwatch 2', 'vod review', 'rank improvement', 'esports coaching'],
  authors: [{ name: 'Overwatch Coaching' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com',
    title: 'Overwatch Coaching | Professional Rank Improvement',
    description: 'Professional Overwatch coaching services. Get personalized VOD reviews and rank up faster.',
    siteName: 'Overwatch Coaching',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Overwatch Coaching | Professional Rank Improvement',
    description: 'Professional Overwatch coaching services. Get personalized VOD reviews and rank up faster.',
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
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
