'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import CustomCryptoScreener from '@/components/CustomCryptoScreener';

export default function CriptomoedasPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Forçar scroll para o topo ao montar (fix para bug de scroll)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Mostrar/ocultar botão de scroll to top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-16">
          {/* Rastreador de Mercado */}
          <div className="space-y-8">
          <div
            className="rounded-2xl overflow-hidden shadow-lg border"
            style={{
              borderColor: 'var(--border-light)',
              backgroundColor: 'var(--bg-elevated)',
            }}
          >
            <CustomCryptoScreener />
          </div>

          {/* Informações Adicionais */}
          <div
            className="rounded-2xl p-6 border shadow-md"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-light)',
            }}
          >
            <h2
              className="text-2xl font-bold mb-4 font-[family-name:var(--font-poppins)]"
              style={{ color: 'var(--text-primary)' }}
            >
              Sobre o Rastreador de Mercado
            </h2>
            <div className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
              <p>
                Acompanhe as principais criptomoedas do mercado em tempo real. O rastreador exibe
                informações essenciais como preço, capitalização de mercado, volume de negociação e
                variação percentual.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Dados atualizados em tempo real</li>
                <li>Visualização completa do market cap e volume</li>
                <li>Gráficos de 7 dias para análise rápida</li>
                <li>Ordenação e filtragem personalizável</li>
              </ul>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2"
          style={{
            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
            borderColor: 'var(--brand-primary)',
            color: 'var(--text-inverse)'
          }}
          aria-label="Voltar ao topo"
        >
          <FontAwesomeIcon icon={faArrowUp} className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
