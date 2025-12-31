'use client';

import { useEffect, useState } from 'react';

interface ClientDateProps {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
  className?: string;
}

export function ClientDate({ date, options, className }: ClientDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    // Format on client side to match user's locale and timezone
    setFormattedDate(new Date(date).toLocaleString('en-US', options));
  }, [date, options]);

  // Render a placeholder that maintains roughly the same width
  // or return null if layout shift isn't a concern.
  // Using a non-breaking space to keep line height.
  if (!formattedDate) {
    return <span className={className} aria-hidden="true">&nbsp;</span>;
  }

  return <span className={className}>{formattedDate}</span>;
}
