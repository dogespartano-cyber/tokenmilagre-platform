'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faChartLine, faGlobe, faCoins, faArrowRight, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram, faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons';
import { TokenBTC, TokenETH, TokenSOL } from '@token-icons/react';

const AdvancedChart = dynamic(() => import('@/components/AdvancedChart'), {
  ssr: false,
});

const TechnicalAnalysisWidget = dynamic(() => import('@/components/TechnicalAnalysisWidget'), {
  ssr: false,
});

const CryptoHeatmapWidget = dynamic(() => import('@/components/CryptoHeatmapWidget'), {
  ssr: false,
});

const StockHeatmapWidget = dynamic(() => import('@/components/StockHeatmapWidget'), {
  ssr: false,
});

const ETFMetricsSection = dynamic(() => import('@/components/ETFMetricsSection'), {
  ssr: false,
});

export default function GraficosPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="graficos-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Gráficos e Análises de Mercado Cripto",
          "description": "Acompanhe o mercado de criptomoedas em tempo real com gráficos avançados, análise técnica, indicadores profissionais e dados de ETFs de Bitcoin e Ethereum",
          "url": "https://tokenmilagre.xyz/graficos"
        })}
      </Script>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Main Content */}
          <div className="space-y-12">

          {/* 1. Macro: Mapa de Calor S&P 500 */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2" style={{ color: "var(--text-primary)" }}>
                Mapa de Calor - S&P 500
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Visualize o desempenho das principais ações dos EUA - onde está a maior parte do capital global
              </p>
            </div>

            <StockHeatmapWidget />
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* 2. Caminho do Dinheiro - Explicação */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: "var(--text-primary)" }}>
                Caminho do Dinheiro
              </h1>
              <p className="text-xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Do macro ao micro: acompanhe o fluxo de capital global através dos mercados
              </p>
            </div>

            {/* Desktop: Horizontal Flow */}
            <div className="hidden md:flex items-center justify-start gap-4">
              {/* Step 1: S&P 500 */}
              <div className="flex-1 text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl" style={{
                  background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  color: 'white'
                }}>
                  <FontAwesomeIcon icon={faChartLine} />
                </div>
                <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                  S&P 500
                </h3>
                <span className="inline-block px-2 py-1 text-xs rounded-full font-semibold" style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6'
                }}>
                  Baixo Risco
                </span>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Capital global
                </p>
              </div>

              <FontAwesomeIcon icon={faArrowRight} className="text-2xl flex-shrink-0" style={{ color: "var(--text-secondary)" }} />

              {/* Step 2: Bitcoin */}
              <div className="flex-1 text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl" style={{
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                  color: 'white'
                }}>
                  <FontAwesomeIcon icon={faBitcoin} />
                </div>
                <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                  Bitcoin
                </h3>
                <span className="inline-block px-2 py-1 text-xs rounded-full font-semibold" style={{
                  backgroundColor: 'rgba(251, 191, 36, 0.2)',
                  color: '#fbbf24'
                }}>
                  Risco Médio
                </span>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Porta de entrada
                </p>
              </div>

              <FontAwesomeIcon icon={faArrowRight} className="text-2xl flex-shrink-0" style={{ color: "var(--text-secondary)" }} />

              {/* Step 3: Ethereum */}
              <div className="flex-1 text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl" style={{
                  background: 'linear-gradient(135deg, #f97316, #fb923c)',
                  color: 'white'
                }}>
                  <FontAwesomeIcon icon={faEthereum} />
                </div>
                <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                  Ethereum
                </h3>
                <span className="inline-block px-2 py-1 text-xs rounded-full font-semibold" style={{
                  backgroundColor: 'rgba(251, 146, 60, 0.2)',
                  color: '#fb923c'
                }}>
                  Risco Elevado
                </span>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Inovação
                </p>
              </div>

              <FontAwesomeIcon icon={faArrowRight} className="text-2xl flex-shrink-0" style={{ color: "var(--text-secondary)" }} />

              {/* Step 4: Altcoins */}
              <div className="flex-1 text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl" style={{
                  background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                  color: 'white'
                }}>
                  <FontAwesomeIcon icon={faCoins} />
                </div>
                <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                  Altcoins
                </h3>
                <span className="inline-block px-2 py-1 text-xs rounded-full font-semibold" style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444'
                }}>
                  Alto Risco
                </span>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Alto retorno
                </p>
              </div>
            </div>

            {/* Mobile: Vertical Flow */}
            <div className="md:hidden space-y-4">
              {[
                { icon: faChartLine, title: 'S&P 500', risk: 'Baixo Risco', desc: 'Capital global', gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)', badgeBg: 'rgba(59, 130, 246, 0.2)', badgeColor: '#3b82f6' },
                { icon: faBitcoin, title: 'Bitcoin', risk: 'Risco Médio', desc: 'Porta de entrada', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', badgeBg: 'rgba(251, 191, 36, 0.2)', badgeColor: '#fbbf24' },
                { icon: faEthereum, title: 'Ethereum', risk: 'Risco Elevado', desc: 'Inovação', gradient: 'linear-gradient(135deg, #f97316, #fb923c)', badgeBg: 'rgba(251, 146, 60, 0.2)', badgeColor: '#fb923c' },
                { icon: faCoins, title: 'Altcoins', risk: 'Alto Risco', desc: 'Alto retorno', gradient: 'linear-gradient(135deg, #dc2626, #ef4444)', badgeBg: 'rgba(239, 68, 68, 0.2)', badgeColor: '#ef4444' }
              ].map((step, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-4 p-4 rounded-xl" style={{
                    backgroundColor: 'var(--bg-card)',
                    borderLeft: `4px solid transparent`,
                    borderImage: step.gradient + ' 1'
                  }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0" style={{
                      background: step.gradient,
                      color: 'white'
                    }}>
                      <FontAwesomeIcon icon={step.icon} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
                          {step.title}
                        </h3>
                        <span className="px-2 py-0.5 text-xs rounded-full font-semibold" style={{
                          backgroundColor: step.badgeBg,
                          color: step.badgeColor
                        }}>
                          {step.risk}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  {idx < 3 && (
                    <div className="flex justify-center py-2">
                      <FontAwesomeIcon icon={faArrowRight} className="text-xl rotate-90" style={{ color: "var(--text-secondary)" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* 3. Mercado Cripto Agregado: Mapa de Calor */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2" style={{ color: "var(--text-primary)" }}>
                Mapa de Calor de Criptomoedas
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Entrada de investidores buscando diversificação no mercado cripto
              </p>
            </div>

            <CryptoHeatmapWidget />
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* 4. Mercado Cripto Agregado: Crypto Bubbles */}
          <div className="space-y-6">
            {/* SEO only - hidden visually */}
            <div className="sr-only">
              <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2" style={{ color: "var(--text-primary)" }}>
                Crypto Bubbles - Visualização Interativa
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Explore o mercado cripto em tempo real com visualização interativa de bolhas
              </p>
            </div>

            <div className="backdrop-blur-xl rounded-2xl p-2 border-2 shadow-2xl overflow-hidden" style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-medium)'
            }}>
              <div className="rounded-xl overflow-hidden" style={{
                height: '800px',
                maxHeight: '80vh'
              }}>
                <iframe
                  src="https://cryptobubbles.net"
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  loading="lazy"
                  title="CryptoBubbles - Visualização do Mercado Cripto"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* 5. Análise de Mercado Cripto: BTC, ETH, SOL */}
          <div className="space-y-8">
            {/* Bitcoin - Análise Completa */}
            <div className="space-y-4">
              <AdvancedChart symbol="BTCUSDT" name="Bitcoin (BTC/USDT)" />
            </div>

            {/* Ethereum e Solana - 2 Colunas */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Ethereum */}
              <div>
                <AdvancedChart symbol="ETHUSDT" name="Ethereum (ETH/USDT)" />
              </div>

              {/* Solana */}
              <div>
                <AdvancedChart symbol="SOLUSDT" name="Solana (SOL/USDT)" />
              </div>
            </div>

            {/* Análise Técnica Avançada */}
            <div className="space-y-4">
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                {/* Análise Técnica BTC */}
                <div>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <TokenBTC size={24} variant="branded" />
                    Bitcoin - Sentimento
                  </h4>
                  <TechnicalAnalysisWidget symbol="BINANCE:BTCUSDT" />
                </div>

                {/* Análise Técnica ETH */}
                <div>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <TokenETH size={24} variant="branded" />
                    Ethereum - Sentimento
                  </h4>
                  <TechnicalAnalysisWidget symbol="BINANCE:ETHUSDT" />
                </div>

                {/* Análise Técnica SOL */}
                <div>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <TokenSOL size={24} variant="branded" />
                    Solana - Sentimento
                  </h4>
                  <TechnicalAnalysisWidget symbol="BINANCE:SOLUSDT" />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* 5. ETFs de Bitcoin e Ethereum */}
          <ETFMetricsSection />

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* 6. Token $MILAGRE CTA */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2" style={{ color: 'var(--text-primary)' }}>
                Acompanhe $MILAGRE
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                O token da educação financeira descentralizada. Monitore o mercado e aprenda a investir com sabedoria.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://discord.gg/xk4zrz8j"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #5865F2, #4752C4)',
                  color: 'white'
                }}
              >
                <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
                <span>Discord</span>
              </a>

              <a
                href="https://t.me/+Bop_TVFc_mg3Njlh"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #0088cc, #006699)',
                  color: 'white'
                }}
              >
                <FontAwesomeIcon icon={faTelegram} className="w-5 h-5" />
                <span>Telegram</span>
              </a>
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
