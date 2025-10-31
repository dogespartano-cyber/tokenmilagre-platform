'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faSignInAlt,
  faSignOutAlt,
  faChevronDown,
  faCog,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

export default function UserDropdown() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
    setIsOpen(false);
  };

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

  // Authenticated - Show user dropdown
  const user = session.user;
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 px-4 py-2 rounded-lg border-2 transition-all duration-300 shadow-theme-sm hover:shadow-theme-md hover:scale-105"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-medium)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
          style={{
            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
            color: 'white'
          }}
        >
          {initials}
        </div>

        {/* Name (hidden on mobile) */}
        <span className="hidden sm:block font-semibold">{user.name || user.email}</span>

        {/* Chevron */}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl border-2 shadow-2xl overflow-hidden z-50"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-medium)'
          }}
        >
          {/* User Info */}
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: 'var(--border-medium)' }}
          >
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {user.name || 'Usuário'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
              {user.email}
            </p>
            <div className="mt-2">
              <span
                className="inline-block px-2 py-1 rounded text-xs font-bold"
                style={{
                  backgroundColor: user.role === 'ADMIN' ? '#22c55e' : '#eab308',
                  color: 'white'
                }}
              >
                {user.role}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Admin Link (only for ADMIN) */}
            {user.role === 'ADMIN' && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-3 px-4 py-2 transition-all duration-200 hover:translate-x-1"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4" />
                <span className="font-semibold">Painel Admin</span>
              </Link>
            )}

            {/* Profile Link */}
            <Link
              href="/dashboard/perfil"
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-3 px-4 py-2 transition-all duration-200 hover:translate-x-1"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
              <span>Perfil</span>
            </Link>

            {/* Settings Link (future) */}
            <Link
              href="/dashboard/configuracoes"
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-3 px-4 py-2 transition-all duration-200 hover:translate-x-1"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
              <span>Configurações</span>
            </Link>
          </div>

          {/* Logout */}
          <div
            className="border-t pt-2 pb-2"
            style={{ borderColor: 'var(--border-medium)' }}
          >
            <button
              onClick={handleSignOut}
              className="group w-full flex items-center gap-3 px-4 py-2 transition-all duration-200 hover:translate-x-1"
              style={{ color: '#ef4444' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
              <span className="font-semibold">Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
