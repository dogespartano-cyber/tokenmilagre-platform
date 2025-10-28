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
          {/* Cards de Recursos e Educação */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] mb-3" style={{ color: 'var(--text-primary)' }}>
                Recursos Essenciais
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Ferramentas e conhecimento para navegar o mercado cripto com segurança
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Gráficos Avançados */}
              <Link
                href="/graficos"
                className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  minHeight: '180px'
                }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative z-10 h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="inline-block px-2 py-1 rounded-md text-xs font-bold mb-3 bg-white/20 backdrop-blur-sm">
                      Análise
                    </div>
                    <h4 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform origin-left">
                      Gráficos Avançados
                    </h4>
                    <p className="text-sm opacity-90 mb-3">
                      Análise técnica profissional em tempo real
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold opacity-90">TradingView</span>
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Card 2: Exchanges Verificadas */}
              <Link
                href="/recursos?search=exchange"
                className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #F3BA2F 0%, #EAA42D 100%)',
                  minHeight: '180px'
                }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative z-10 h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="inline-block px-2 py-1 rounded-md text-xs font-bold mb-3 bg-white/20 backdrop-blur-sm">
                      Segurança
                    </div>
                    <h4 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform origin-left">
                      Exchanges Verificadas
                    </h4>
                    <p className="text-sm opacity-90 mb-3">
                      Links oficiais de plataformas confiáveis
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold opacity-90">Links seguros</span>
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Card 3: Como Investir */}
              <Link
                href="/educacao/trading-basico-criptomoedas"
                className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  minHeight: '180px'
                }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative z-10 h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="inline-block px-2 py-1 rounded-md text-xs font-bold mb-3 bg-white/20 backdrop-blur-sm">
                      Educação
                    </div>
                    <h4 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform origin-left">
                      Como Investir
                    </h4>
                    <p className="text-sm opacity-90 mb-3">
                      Guia completo para começar a investir
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold opacity-90">Intermediário</span>
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Card 4: Notícias do Mercado */}
              <Link
                href="/dashboard/noticias"
                className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #F7931A 0%, #E67E22 100%)',
                  minHeight: '180px'
                }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative z-10 h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="inline-block px-2 py-1 rounded-md text-xs font-bold mb-3 bg-white/20 backdrop-blur-sm">
                      Atualizado
                    </div>
                    <h4 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform origin-left">
                      Notícias do Mercado
                    </h4>
                    <p className="text-sm opacity-90 mb-3">
                      Últimas atualizações do mundo cripto
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold opacity-90">Tempo real</span>
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

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
