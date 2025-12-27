'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
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
  <html lang="pt-BR">
   <body>
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
     <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-xl text-center">
      <div className="text-6xl mb-4">💥</div>

<h2 className="title-newtab text-2xl mb-4">
       Erro Crítico
      </h2>

      <p className="mb-6 text-gray-600 dark:text-gray-300">
       Ocorreu um erro crítico no aplicativo. Nossa equipe já foi notificada.
      </p>

      {process.env.NODE_ENV === 'development' && error.message && (
       <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-left text-sm font-mono max-h-48 overflow-auto">
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
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
       >
        Tentar novamente
       </button>

       <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
       >
        Recarregar página
       </button>
      </div>

      <p className="mt-6 text-xs text-gray-400">
       Error ID: {error.digest || 'N/A'}
      </p>
     </div>
    </div>
   </body>
  </html>
 );
}
