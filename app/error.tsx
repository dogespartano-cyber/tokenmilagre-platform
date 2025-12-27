'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 useEffect(() => {
  // Log do erro no Sentry
  Sentry.captureException(error);
 }, [error]);

 return (
  <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
   <div className="max-w-md w-full rounded-2xl p-8 border-2 shadow-xl text-center" style={{
    backgroundColor: 'var(--bg-elevated)',
    borderColor: 'var(--border-medium)'
   }}>
    <div className="text-6xl mb-4">⚠️</div>

<h2 className="title-newtab text-2xl mb-4" style={{ color: 'var(--text-primary)' }}>
     Algo deu errado
    </h2>

    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
     Desculpe, ocorreu um erro inesperado. Nossa equipe já foi notificada automaticamente.
    </p>

    {process.env.NODE_ENV === 'development' && error.message && (
     <div className="mb-6 p-4 rounded-lg text-left text-sm font-mono" style={{
      backgroundColor: 'var(--bg-secondary)',
      color: '#EF4444',
      maxHeight: '200px',
      overflow: 'auto'
     }}>
      <strong>Erro:</strong> {error.message}
      {error.digest && (
       <div className="mt-2">
        <strong>Digest:</strong> {error.digest}
       </div>
      )}
     </div>
    )}

    <div className="flex gap-3 justify-center">
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

     <button
      onClick={() => window.location.href = '/'}
      className="px-6 py-3 rounded-lg font-semibold border-2 transition-all hover:opacity-80"
      style={{
       borderColor: 'var(--border-medium)',
       color: 'var(--text-primary)'
      }}
     >
      Voltar ao início
     </button>
    </div>

    <p className="mt-6 text-xs" style={{ color: 'var(--text-tertiary)' }}>
     Se o problema persistir, entre em contato pelo Discord
    </p>
   </div>
  </div>
 );
}
