'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy redirect page
 *
 * This route was deprecated - /dashboard/admin was merged into /dashboard
 * This page ensures backwards compatibility by redirecting old URLs
 *
 * @see docs-local/LOG.md - Dashboard restructure (line 24-37)
 */
export default function DashboardAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Immediate redirect to new dashboard location
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2" style={{ borderColor: 'var(--brand-primary)' }}></div>
        <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Redirecionando para o painel administrativo...
        </p>
      </div>
    </div>
  );
}
