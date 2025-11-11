'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';
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

          {/* Crypto Bubbles - Visualização Interativa */}
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

          {/* Análise de Mercado Cripto */}
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

          {/* Mapa de Calor S&P 500 */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2" style={{ color: "var(--text-primary)" }}>
                Mapa de Calor - S&P 500
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Visualize o desempenho das principais ações dos EUA em tempo real
              </p>
            </div>

            <StockHeatmapWidget />
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Mapa de Calor Cripto */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2" style={{ color: "var(--text-primary)" }}>
                Mapa de Calor de Criptomoedas
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Visualize o desempenho do mercado cripto em tempo real
              </p>
            </div>

            <CryptoHeatmapWidget />
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* ETFs de Bitcoin e Ethereum */}
          <ETFMetricsSection />

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Token $MILAGRE CTA */}
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
