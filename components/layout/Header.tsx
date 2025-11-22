'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';
import { useLocaleFile } from '@/lib/locales/client';

export interface HeaderProps {
  className?: string;
}

/**
 * Main site header with navigation
 * Features:
 * - Sticky header with blur effect on scroll
 * - Mobile hamburger menu
 * - Dark purple theme
 * - Active link highlighting
 */
export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const common = useLocaleFile('common');

  const navLinks = [
    { href: '/', label: common.navigation?.links?.home || 'Home' },
    { href: '/pricing', label: common.navigation?.links?.pricing || 'Pricing' },
    { href: '/blog', label: common.navigation?.links?.blog || 'Blog' },
    { href: '/contact', label: common.navigation?.links?.contact || 'Contact' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Check if link is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled
      ? 'border-b border-border bg-background-primary/80 backdrop-blur-md shadow-lg shadow-cyan-primary/10'
      : 'border-b border-border bg-background-primary/95 backdrop-blur-sm'
      } ${className}`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label={common.aria_labels?.main_navigation || 'Main navigation'}>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-12 w-auto">
                <Image
                  src="/Coaching-Header.png"
                  alt="Overwatch Coaching"
                  width={220}
                  height={48}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6 list-none">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors duration-200 ${isActive(link.href)
                      ? 'text-cyan-400'
                      : 'text-gray-300 hover:text-cyan-400'
                      }`}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link href="/booking">
              <Button variant="primary" size="sm">{common.buttons?.primary?.get_coaching || 'Get Coaching'}</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-primary rounded-lg transition-colors"
            aria-label={isMobileMenuOpen ? (common.navigation?.mobile?.aria_labels?.close_menu || 'Close menu') : (common.navigation?.mobile?.aria_labels?.open_menu || 'Open menu')}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <ul className="flex flex-col gap-2 list-none">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-background-surface rounded-lg transition-colors duration-200 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile CTA Button */}
            <div className="mt-4 px-4">
              <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  {common.navigation?.mobile?.buttons?.get_coaching || 'Get Coaching'}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
