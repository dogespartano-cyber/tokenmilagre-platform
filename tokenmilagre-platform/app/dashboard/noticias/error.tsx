'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

export default function NoticiasError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: {
        section: 'noticias',
      },
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-lg w-full rounded-2xl p-8 border-2 shadow-xl text-center" style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-medium)'
      }}>
        <div className="text-6xl mb-4">📰</div>

        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Erro ao carregar notícia
        </h2>

        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          Desculpe, não foi possível carregar a notícia neste momento.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-4 rounded-lg text-left text-sm font-mono" style={{
            backgroundColor: 'var(--bg-secondary)',
            color: '#EF4444',
            maxHeight: '150px',
            overflow: 'auto'
          }}>
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--brand-primary)',
              color: 'white'
            }}
          >
            Tentar novamente
          </button>

          <Link
            href="/dashboard/noticias"
            className="px-6 py-3 rounded-lg font-semibold border-2 transition-all hover:opacity-80"
            style={{
              borderColor: 'var(--border-medium)',
              color: 'var(--text-primary)'
            }}
          >
            Ver todas as notícias
          </Link>
        </div>
      </div>
    </div>
  );
}
