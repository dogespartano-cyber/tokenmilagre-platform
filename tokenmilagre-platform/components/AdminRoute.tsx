'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faLock } from '@fortawesome/free-solid-svg-icons';

interface AdminRouteProps {
  children: React.ReactNode;
  allowEditor?: boolean; // Se true, permite EDITOR e ADMIN. Se false, apenas ADMIN
}

/**
 * Componente de proteção de rota para páginas administrativas
 * Verifica autenticação e role do usuário
 */
export default function AdminRoute({ children, allowEditor = false }: AdminRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    // Se não está autenticado, redireciona para login
    if (status === 'unauthenticated') {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // Se está autenticado, verifica role
    if (session?.user) {
      const userRole = session.user.role;

      // Se permite editor, aceita ADMIN e EDITOR
      if (allowEditor) {
        if (userRole !== 'ADMIN' && userRole !== 'EDITOR') {
          router.push('/dashboard/noticias');
        }
      } else {
        // Se não permite editor, aceita apenas ADMIN
        if (userRole !== 'ADMIN') {
          router.push('/dashboard/noticias');
        }
      }
    }
  }, [session, status, router, allowEditor]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="w-12 h-12 mb-4 animate-spin"
            style={{ color: 'var(--brand-primary)' }}
          />
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Verificando permissões...
          </p>
        </div>
      </div>
    );
  }

  // Unauthenticated state
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
        <div className="text-center">
          <FontAwesomeIcon
            icon={faLock}
            className="w-12 h-12 mb-4"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Redirecionando para login...
          </p>
        </div>
      </div>
    );
  }

  // Insufficient permissions
  if (session?.user) {
    const userRole = session.user.role;
    const hasPermission = allowEditor
      ? (userRole === 'ADMIN' || userRole === 'EDITOR')
      : (userRole === 'ADMIN');

    if (!hasPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
          <div className="text-center max-w-md px-4">
            <FontAwesomeIcon
              icon={faLock}
              className="w-16 h-16 mb-4"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Acesso Negado
            </h1>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Você não tem permissão para acessar esta página.
              {allowEditor ? ' Apenas administradores e editores.' : ' Apenas administradores.'}
            </p>
            <button
              onClick={() => router.push('/dashboard/noticias')}
              className="px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                color: 'var(--text-inverse)'
              }}
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      );
    }
  }

  // Authorized - render children
  return <>{children}</>;
}
