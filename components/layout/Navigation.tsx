'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocaleFile } from '@/lib/locales/client';

export interface NavigationProps {
  className?: string;
}

export interface NavLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const common = useLocaleFile('common');

  const navLinks: NavLink[] = [
    { href: '/', label: common.navigation?.links?.home || 'Home' },
    { href: '/pricing', label: common.navigation?.links?.pricing || 'Pricing' },
    { href: '/blog', label: common.navigation?.links?.blog || 'Blog' },
    { href: '/contact', label: common.navigation?.links?.contact || 'Contact' },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const isActivePath = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`hidden md:block ${className}`} aria-label={common.aria_labels?.main_navigation || 'Main navigation'}>
        <ul className="flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActivePath(link.href)
                    ? 'text-purple-400'
                    : 'text-gray-300 hover:text-purple-400'
                }`}
                aria-current={isActivePath(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navigation Trigger */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 text-gray-300 hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg transition-colors"
        aria-label={isMobileMenuOpen ? (common.navigation?.mobile?.aria_labels?.close_menu || 'Close menu') : (common.navigation?.mobile?.aria_labels?.open_menu || 'Open menu')}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div
            className="fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-full max-w-sm bg-background-surface border-l border-border shadow-[0_0_50px_rgba(139,92,246,0.2)] md:hidden overflow-y-auto"
            role="dialog"
            aria-label={common.navigation?.mobile?.aria_labels?.mobile_navigation || 'Mobile navigation'}
          >
            <nav className="p-6" aria-label={common.navigation?.mobile?.aria_labels?.mobile_navigation || 'Mobile navigation'}>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActivePath(link.href)
                          ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30'
                          : 'text-gray-300 hover:text-purple-400 hover:bg-background-elevated'
                      }`}
                      aria-current={isActivePath(link.href) ? 'page' : undefined}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.icon && <span className="w-5 h-5">{link.icon}</span>}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile Menu Actions */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="space-y-3">
                  <Link
                    href="/pricing"
                    className="block w-full px-4 py-3 text-center text-sm font-medium text-purple-400 bg-transparent border border-purple-600/30 rounded-lg hover:bg-purple-600/10 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {common.navigation?.mobile?.buttons?.pricing || 'Pricing'}
                  </Link>
                  <Link
                    href="/booking"
                    className="block w-full px-4 py-3 text-center text-sm font-medium text-white bg-purple-600 rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:bg-purple-500 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {common.navigation?.mobile?.buttons?.get_coaching || 'Get Coaching'}
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
};
