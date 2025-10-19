'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redireciona para a homepage, que agora é o dashboard de mercado
export default function MercadoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">📊</div>
        <p className="text-xl" style={{ color: 'var(--text-primary)' }}>
          Redirecionando para o dashboard...
        </p>
      </div>
    </div>
  );
}
