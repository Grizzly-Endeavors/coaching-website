'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userEmail: string | null | undefined;
}

export function AdminLayoutClient({ children, userEmail }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#0f0f23]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1a1a2e] border-b border-[#2a2a40] px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#8b5cf6]">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-[#e5e7eb] hover:bg-[#2a2a40] transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[#1a1a2e] border-r border-[#2a2a40] flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-[#2a2a40]">
          <h1 className="text-2xl font-bold text-[#8b5cf6]">Admin Panel</h1>
          <p className="text-sm text-[#6b7280] mt-1">Overwatch Coaching</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            href="/admin"
            icon="📊"
            active={isActive('/admin')}
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            href="/admin/submissions"
            icon="🎮"
            active={isActive('/admin/submissions')}
            onClick={() => setSidebarOpen(false)}
          >
            Submissions
          </NavLink>
          <NavLink
            href="/admin/blog"
            icon="📝"
            active={isActive('/admin/blog')}
            onClick={() => setSidebarOpen(false)}
          >
            Blog Posts
          </NavLink>
          <NavLink
            href="/admin/schedule"
            icon="📅"
            active={isActive('/admin/schedule')}
            onClick={() => setSidebarOpen(false)}
          >
            Schedule
          </NavLink>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-[#2a2a40]">
          <div className="mb-3">
            <p className="text-sm text-[#9ca3af]">Logged in as</p>
            <p className="text-sm text-[#e5e7eb] font-medium truncate" title={userEmail || ''}>
              {userEmail}
            </p>
          </div>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#2a2a40] text-[#e5e7eb] rounded-lg hover:bg-[#3a3a50] transition-colors text-sm font-medium"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
  active,
  onClick,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${
        active
          ? 'bg-[#8b5cf6] text-white'
          : 'text-[#9ca3af] hover:bg-[#2a2a40] hover:text-[#e5e7eb]'
      }`}
    >
      <span className="text-lg group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  );
}
