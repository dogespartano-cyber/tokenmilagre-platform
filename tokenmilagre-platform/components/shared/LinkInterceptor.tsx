'use client';

import { ReactNode, useEffect, useState, useCallback } from 'react';
import URLWarningModal from './URLWarningModal';

interface LinkInterceptorProps {
  children: ReactNode;
  enabled?: boolean;
  showEducationalTips?: boolean;
  onBlock?: (url: string) => void;
}

interface VerificationResult {
  safe: boolean;
  threat?: {
    level: 'critical' | 'warning' | 'suspicious';
    reasons: string[];
    educationalTip: string;
    similarLegitDomain?: string;
    source: string;
  };
  cached: boolean;
  checkedAt: string;
}

/**
 * LinkInterceptor - Componente reutilizável para interceptar e verificar links externos
 *
 * Uso:
 * <LinkInterceptor>
 *   <ArticleContent content={content} />
 * </LinkInterceptor>
 */
export default function LinkInterceptor({
  children,
  enabled = true,
  showEducationalTips = true,
  onBlock,
}: LinkInterceptorProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string>('');
  const [threat, setThreat] = useState<VerificationResult['threat'] | null>(null);
  const [verifying, setVerifying] = useState(false);

  const checkURL = useCallback(async (url: string): Promise<VerificationResult | null> => {
    try {
      const response = await fetch('/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        console.error('Erro ao verificar URL:', response.statusText);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar URL:', error);
      return null;
    }
  }, []);

  const isExternalLink = (url: string): boolean => {
    try {
      const urlObj = new URL(url, window.location.href);
      const currentDomain = window.location.hostname;

      // Considera externo se não for do mesmo domínio
      return urlObj.hostname !== currentDomain;
    } catch {
      return false;
    }
  };

  const handleLinkClick = useCallback(async (e: MouseEvent) => {
    if (!enabled) return;

    const target = e.target as HTMLElement;
    const link = target.closest('a');

    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignora âncoras e links internos
    if (href.startsWith('#') || href.startsWith('/') || !isExternalLink(href)) {
      return;
    }

    // Previne navegação
    e.preventDefault();
    e.stopPropagation();

    setPendingUrl(href);
    setVerifying(true);

    // Verifica URL
    const result = await checkURL(href);

    setVerifying(false);

    if (!result) {
      // Em caso de erro na API, permite navegação (fail-safe)
      window.open(href, link.target || '_blank', 'noopener,noreferrer');
      return;
    }

    // Se for seguro, permite navegação
    if (result.safe) {
      window.open(href, link.target || '_blank', 'noopener,noreferrer');
      return;
    }

    // Se não for seguro, mostra modal
    if (result.threat) {
      setThreat(result.threat);
      setModalOpen(true);

      // Callback para analytics
      if (onBlock) {
        onBlock(href);
      }
    }
  }, [enabled, checkURL, onBlock]);

  useEffect(() => {
    if (!enabled) return;

    // Adiciona listener global para clicks em links
    document.addEventListener('click', handleLinkClick, true);

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [enabled, handleLinkClick]);

  const handleClose = () => {
    setModalOpen(false);
    setPendingUrl('');
    setThreat(null);
  };

  const handleProceed = () => {
    // Usuário optou por prosseguir
    window.open(pendingUrl, '_blank', 'noopener,noreferrer');
    handleClose();
  };

  return (
    <>
      {children}

      {/* Modal de Aviso */}
      {modalOpen && threat && (
        <URLWarningModal
          isOpen={modalOpen}
          url={pendingUrl}
          threat={threat}
          onClose={handleClose}
          onProceed={handleProceed}
        />
      )}

      {/* Overlay de Verificação (opcional) */}
      {verifying && (
        <div
          className="fixed bottom-4 right-4 z-40 px-4 py-3 rounded-lg shadow-lg border"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-medium)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
            🔍 Verificando segurança do link...
          </p>
        </div>
      )}
    </>
  );
}
