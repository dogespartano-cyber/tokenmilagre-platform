'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignInAlt,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

export default function UserDropdown() {
  const { data: session, status } = useSession();

  // Loading state
  if (status === 'loading') {
    return (
      <div
        className="px-4 py-2 rounded-lg animate-pulse"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="w-20 h-5 rounded" style={{ backgroundColor: 'var(--border-medium)' }} />
      </div>
    );
  }

  // Not authenticated - Show Login button
  if (status === 'unauthenticated' || !session) {
    return (
      <Link
        href="/login"
        className="group flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-300 shadow-theme-sm hover:shadow-theme-md hover:scale-105 font-semibold"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-medium)',
          color: 'var(--text-primary)'
        }}
      >
        <FontAwesomeIcon icon={faSignInAlt} className="w-4 h-4" />
        <span>Login</span>
      </Link>
    );
  }

  // Authenticated - Show Admin button (only for ADMIN)
  const user = session.user;

  if (user.role === 'ADMIN') {
    return (
      <Link
        href="/dashboard"
        className="group flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-300 shadow-theme-sm hover:shadow-theme-md hover:scale-105 font-semibold"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-medium)',
          color: 'var(--text-primary)'
        }}
      >
        <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4" />
        <span className="hidden sm:block">Admin</span>
      </Link>
    );
  }

  // Authenticated but not admin - Show nothing
  return null;
}
