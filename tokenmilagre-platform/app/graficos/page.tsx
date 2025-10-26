'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

interface FearGreedData {
  value: string;
  value_classification: string;
}

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

const TickerTapeWidget = dynamic(() => import('@/components/TickerTapeWidget'), {
  ssr: false,
});

export default function GraficosPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
  const [gaugeValue, setGaugeValue] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Buscar Fear & Greed Index
  const fetchFearGreed = useCallback(async () => {
    try {
      const response = await fetch('/api/fear-greed');
      const result = await response.json();

      if (result.success && result.data) {
        setFearGreed(result.data);
      } else {
        console.error('Erro ao buscar Fear & Greed Index:', result.error);
      }
    } catch (error) {
      console.error('Erro ao buscar Fear & Greed Index:', error);
    }
  }, []);

  useEffect(() => {
    fetchFearGreed();
  }, [fetchFearGreed]);

  // Animação do ponteiro do velocímetro
  useEffect(() => {
    if (fearGreed) {
      const targetValue = parseInt(fearGreed.value);
      const duration = 2500;
      const steps = 60;
      const stepValue = targetValue / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      setGaugeValue(0);

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          const progress = currentStep / steps;
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          setGaugeValue(Math.round(targetValue * easedProgress));
        } else {
          setGaugeValue(targetValue);
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [fearGreed]);

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
          "description": "Acompanhe o mercado de criptomoedas em tempo real com gráficos avançados, análise técnica e indicadores profissionais",
          "url": "https://tokenmilagre.xyz/graficos"
        })}
      </Script>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Velocímetro Fear & Greed */}
              {fearGreed && (
                <div className="hidden lg:flex items-center">
                  {/* Velocímetro SVG */}
                  <div className="relative flex items-center justify-center" style={{ width: '240px', height: '160px' }}>
                    <svg viewBox="-20 -30 320 250" className="w-full h-full" style={{ overflow: 'visible' }}>
                      <defs>
                        {/* Gradiente arco-íris */}
                        <linearGradient id="rainbowGradientGraficos" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#DC2626" />
                          <stop offset="20%" stopColor="#EA580C" />
                          <stop offset="40%" stopColor="#F59E0B" />
                          <stop offset="60%" stopColor="#84CC16" />
                          <stop offset="80%" stopColor="#22C55E" />
                          <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>

                        {/* Filtros */}
                        <filter id="softShadowGraficos" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                          <feOffset dx="0" dy="2" result="offsetblur"/>
                          <feComponentTransfer>
                            <feFuncA type="linear" slope="0.3"/>
                          </feComponentTransfer>
                          <feMerge>
                            <feMergeNode/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>

                        <filter id="intensiveGlowGraficos" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Arco de fundo */}
                      <path
                        d="M 50 170 A 90 90 0 0 1 230 170"
                        fill="none"
                        stroke="var(--border-medium)"
                        strokeWidth="26"
                        strokeLinecap="butt"
                        opacity="0.2"
                      />

                      {/* Arco colorido */}
                      <path
                        d="M 50 170 A 90 90 0 0 1 230 170"
                        fill="none"
                        stroke="url(#rainbowGradientGraficos)"
                        strokeWidth="26"
                        strokeLinecap="butt"
                        filter="url(#intensiveGlowGraficos)"
                      />

                      {/* Marcações principais */}
                      {[
                        { value: 0, label: '0', color: '#DC2626' },
                        { value: 25, label: '25', color: '#F59E0B' },
                        { value: 50, label: '50', color: '#84CC16' },
                        { value: 75, label: '75', color: '#22C55E' },
                        { value: 100, label: '100', color: '#10B981' }
                      ].map((mark, idx) => {
                        const angle = -180 + (mark.value * 1.8);
                        const radian = (angle * Math.PI) / 180;
                        const innerRadius = 76;
                        const outerRadius = 87;
                        const labelRadius = 105;

                        const x1 = 140 + innerRadius * Math.cos(radian);
                        const y1 = 170 + innerRadius * Math.sin(radian);
                        const x2 = 140 + outerRadius * Math.cos(radian);
                        const y2 = 170 + outerRadius * Math.sin(radian);
                        const labelX = 140 + labelRadius * Math.cos(radian);
                        const labelY = 170 + labelRadius * Math.sin(radian);

                        return (
                          <g key={idx}>
                            <line
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke={mark.color}
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            <text
                              x={labelX}
                              y={labelY}
                              fill="var(--text-primary)"
                              fontSize="13"
                              fontWeight="700"
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              {mark.label}
                            </text>
                          </g>
                        );
                      })}

                      {/* Marcações secundárias */}
                      {[10, 20, 30, 40, 60, 70, 80, 90].map((val, idx) => {
                        const angle = -180 + (val * 1.8);
                        const radian = (angle * Math.PI) / 180;
                        const x1 = 140 + 81 * Math.cos(radian);
                        const y1 = 170 + 81 * Math.sin(radian);
                        const x2 = 140 + 87 * Math.cos(radian);
                        const y2 = 170 + 87 * Math.sin(radian);

                        return (
                          <line
                            key={idx}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="var(--text-tertiary)"
                            strokeWidth="2"
                            opacity="0.4"
                            strokeLinecap="round"
                          />
                        );
                      })}

                      {/* Ponteiro */}
                      <g
                        style={{
                          transform: `rotate(${(gaugeValue * 1.8) - 90}deg)`,
                          transformOrigin: '140px 170px',
                          transition: 'transform 0.05s linear'
                        }}
                      >
                        <path
                          d="M 140 170 L 135 165 L 138 90 L 140 85 L 142 90 L 145 165 Z"
                          fill="#000000"
                          opacity="0.15"
                          transform="translate(2, 3)"
                        />
                        <path
                          d="M 140 170 L 135 165 L 138 90 L 140 85 L 142 90 L 145 165 Z"
                          fill={
                            gaugeValue <= 20 ? '#DC2626' :
                            gaugeValue <= 40 ? '#F59E0B' :
                            gaugeValue <= 60 ? '#84CC16' :
                            gaugeValue <= 80 ? '#22C55E' : '#10B981'
                          }
                          filter="url(#softShadowGraficos)"
                        />
                      </g>

                      {/* Base do ponteiro */}
                      <circle
                        cx="140"
                        cy="170"
                        r="18"
                        fill="var(--bg-elevated)"
                        stroke="var(--border-medium)"
                        strokeWidth="2"
                      />
                      <circle
                        cx="140"
                        cy="170"
                        r="11"
                        fill={
                          gaugeValue <= 20 ? '#DC2626' :
                          gaugeValue <= 40 ? '#F59E0B' :
                          gaugeValue <= 60 ? '#84CC16' :
                          gaugeValue <= 80 ? '#22C55E' : '#10B981'
                        }
                        filter="url(#intensiveGlowGraficos)"
                      />

                      {/* Valor numérico */}
                      <text
                        x="140"
                        y="145"
                        fill="var(--text-primary)"
                        fontSize="32"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {gaugeValue}
                      </text>
                    </svg>
                  </div>
                </div>
              )}

              <div>
                <h1 className="text-4xl font-bold mb-1 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Gráficos e Análises de Mercado
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                  Acompanhe o mercado em tempo real com gráficos avançados, análise técnica e indicadores profissionais
                </p>
              </div>
            </div>

            {/* Community Buttons */}
            <div className="flex gap-3">
              <a
                href="https://discord.gg/skaX8bFY"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #5865F2, #4752C4)',
                  color: 'white'
                }}
              >
                <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
                <span>Discord</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>

              <a
                href="https://t.me/+Bop_TVFc_mg3Njlh"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #0088cc, #006699)',
                  color: 'white'
                }}
              >
                <FontAwesomeIcon icon={faTelegram} className="w-5 h-5" />
                <span>Telegram</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>

          {/* Ticker Tape */}
          <div
            className="rounded-2xl overflow-hidden shadow-md border"
            style={{
              borderColor: 'var(--border-light)',
              backgroundColor: 'var(--bg-elevated)'
            }}>
            <TickerTapeWidget />
          </div>

          {/* Main Content */}
          <div className="space-y-12">
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
                  <h4 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    Bitcoin - Sentimento
                  </h4>
                  <TechnicalAnalysisWidget symbol="BINANCE:BTCUSDT" />
                </div>

                {/* Análise Técnica ETH */}
                <div>
                  <h4 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    Ethereum - Sentimento
                  </h4>
                  <TechnicalAnalysisWidget symbol="BINANCE:ETHUSDT" />
                </div>

                {/* Análise Técnica SOL */}
                <div>
                  <h4 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
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

          {/* Mapa de Calor & Rastreador */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2" style={{ color: "var(--text-primary)" }}>
                Mapa de Mercado de Criptomoedas
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Visualize o mercado completo e filtre oportunidades
              </p>
            </div>

            <div className="space-y-8">
              {/* Mapa de Calor Cripto */}
              <div>
                <CryptoHeatmapWidget />
              </div>

              {/* CryptoBubbles */}
              <div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-poppins)] mb-3" style={{ color: "var(--text-primary)" }}>
                  Crypto Bubbles - Visualização Interativa
                </h3>
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
            </div>
          </div>

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
                href="https://discord.gg/skaX8bFY"
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
