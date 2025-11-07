/**
 * Global Error Handler para Next.js App Router
 *
 * Captura erros não tratados em toda a aplicação
 */

'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error:', error);
    }
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
          <div className="max-w-md w-full bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 mx-auto text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Erro crítico
              </h2>

              <p className="text-gray-400 mb-6">
                Ocorreu um erro crítico na aplicação.
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Tentar novamente
                </button>

                <button
                  onClick={() => (window.location.href = '/')}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700"
                >
                  Voltar ao início
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
