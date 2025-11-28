'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faChartLine, faGlobe, faCoins, faArrowRight, faShieldAlt, faDollarSign } from '@fortawesome/free-solid-svg-icons';
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
                  Investidores direcionam lucros das grandes ações (S&P 500) para projetos de maior risco e retorno, como Bitcoin. Com os lucros do BTC, diversificam para Ethereum e, finalmente, para altcoins de alto risco/retorno. Este é o caminho natural do capital em busca de maiores oportunidades.
                </p>
              </div>

              {/* Desktop: Horizontal Flow */}
              <div className="hidden md:flex items-center justify-start gap-8">
                {/* Step 1: S&P 500 */}
                <div className="flex-1 max-w-[240px] text-center space-y-3 p-6 rounded-2xl border-2 transition-all hover:scale-105" style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-light)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl" style={{
                    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                    color: 'white',
                    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)'
                  }}>
                    <FontAwesomeIcon icon={faChartLine} />
                  </div>
                  <h3 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                    S&P 500
                  </h3>
                  <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold" style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6'
                  }}>
                    Baixo Risco
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Capital global
                  </p>
                </div>

                <FontAwesomeIcon icon={faArrowRight} className="text-3xl flex-shrink-0" style={{ color: "var(--text-secondary)", opacity: 0.5 }} />

                {/* Step 2: Bitcoin */}
                <div className="flex-1 max-w-[240px] text-center space-y-3 p-6 rounded-2xl border-2 transition-all hover:scale-105" style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-light)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl" style={{
                    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                    color: 'white',
                    boxShadow: '0 6px 16px rgba(251, 191, 36, 0.4)'
                  }}>
                    <FontAwesomeIcon icon={faBitcoin} />
                  </div>
                  <h3 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                    Bitcoin
                  </h3>
                  <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold" style={{
                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                    color: '#fbbf24'
                  }}>
                    Risco Médio
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Porta de entrada
                  </p>
                </div>

                <FontAwesomeIcon icon={faArrowRight} className="text-3xl flex-shrink-0" style={{ color: "var(--text-secondary)", opacity: 0.5 }} />

                {/* Step 3: Ethereum */}
                <div className="flex-1 max-w-[240px] text-center space-y-3 p-6 rounded-2xl border-2 transition-all hover:scale-105" style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-light)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl" style={{
                    background: 'linear-gradient(135deg, #f97316, #fb923c)',
                    color: 'white',
                    boxShadow: '0 6px 16px rgba(251, 146, 60, 0.4)'
                  }}>
                    <FontAwesomeIcon icon={faEthereum} />
                  </div>
                  <h3 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                    Ethereum
                  </h3>
                  <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold" style={{
                    backgroundColor: 'rgba(251, 146, 60, 0.2)',
                    color: '#fb923c'
                  }}>
                    Risco Elevado
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Inovação
                  </p>
                </div>

                <FontAwesomeIcon icon={faArrowRight} className="text-3xl flex-shrink-0" style={{ color: "var(--text-secondary)", opacity: 0.5 }} />

                {/* Step 4: Altcoins */}
                <div className="flex-1 max-w-[240px] text-center space-y-3 p-6 rounded-2xl border-2 transition-all hover:scale-105" style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-light)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl" style={{
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                    color: 'white',
                    boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)'
                  }}>
                    <FontAwesomeIcon icon={faCoins} />
                  </div>
                  <h3 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                    Altcoins
                  </h3>
                  <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold" style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444'
                  }}>
                    Alto Risco
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Alto retorno
                  </p>
                </div>
              </div>

              {/* Mobile: Vertical Flow */}
              <div className="md:hidden space-y-6">
                {[
                  { icon: faChartLine, title: 'S&P 500', risk: 'Baixo Risco', desc: 'Capital global', gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)', badgeBg: 'rgba(59, 130, 246, 0.2)', badgeColor: '#3b82f6', shadowColor: 'rgba(59, 130, 246, 0.4)' },
                  { icon: faBitcoin, title: 'Bitcoin', risk: 'Risco Médio', desc: 'Porta de entrada', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', badgeBg: 'rgba(251, 191, 36, 0.2)', badgeColor: '#fbbf24', shadowColor: 'rgba(251, 191, 36, 0.4)' },
                  { icon: faEthereum, title: 'Ethereum', risk: 'Risco Elevado', desc: 'Inovação', gradient: 'linear-gradient(135deg, #f97316, #fb923c)', badgeBg: 'rgba(251, 146, 60, 0.2)', badgeColor: '#fb923c', shadowColor: 'rgba(251, 146, 60, 0.4)' },
                  { icon: faCoins, title: 'Altcoins', risk: 'Alto Risco', desc: 'Alto retorno', gradient: 'linear-gradient(135deg, #dc2626, #ef4444)', badgeBg: 'rgba(239, 68, 68, 0.2)', badgeColor: '#ef4444', shadowColor: 'rgba(239, 68, 68, 0.4)' }
                ].map((step, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-5 p-5 rounded-2xl border-2" style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-light)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                    }}>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{
                        background: step.gradient,
                        color: 'white',
                        boxShadow: `0 6px 16px ${step.shadowColor}`
                      }}>
                        <FontAwesomeIcon icon={step.icon} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                          {step.title}
                        </h3>
                        <span className="inline-block px-3 py-1 text-xs rounded-full font-semibold" style={{
                          backgroundColor: step.badgeBg,
                          color: step.badgeColor
                        }}>
                          {step.risk}
                        </span>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                    {idx < 3 && (
                      <div className="flex justify-center py-3">
                        <FontAwesomeIcon icon={faArrowRight} className="text-2xl rotate-90" style={{ color: "var(--text-secondary)", opacity: 0.5 }} />
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

            {/* Fluxo de Capital no Mercado Cripto */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: "var(--text-primary)" }}>
                  Fluxo de Capital no Mercado Cripto
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Dentro do mercado cripto, o capital segue um padrão: lucros realizados no Bitcoin são alocados em Ethereum, que por sua vez são diversificados em altcoins de menor capitalização e maior potencial de retorno. Os lucros das altcoins de alto risco retornam para BTC e Stablecoins, aguardando novas oportunidades. Este ciclo se repete a cada movimento de alta do mercado.
                </p>
              </div>

              {/* Desktop: Horizontal Flow */}
              <div className="hidden md:flex items-center justify-start gap-8 flex-wrap">
                {/* BTC */}
                <div className="flex-1 min-w-[220px] max-w-[260px] text-center space-y-3 p-6 rounded-2xl border-2 transition-all hover:scale-105" style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-light)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl" style={{
                    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                    color: 'white',
                    boxShadow: '0 6px 16px rgba(251, 191, 36, 0.4)'
                  }}>
                    <FontAwesomeIcon icon={faBitcoin} />
                  </div>
                  <h3 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                    Bitcoin
                  </h3>
                  <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold" style={{
                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                    color: '#fbbf24'
                  }}>
                    Reserva de Valor
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Lucros realizados
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <FontAwesomeIcon icon={faArrowRight} className="text-3xl" style={{ color: "var(--text-secondary)", opacity: 0.5 }} />
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{
                    color: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}>
                    Rotação
                  </span>
                </div>

                {/* ETH */}
                <div className="flex-1 min-w-[220px] max-w-[260px] text-center space-y-3 p-6 rounded-2xl border-2 transition-all hover:scale-105" style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-light)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl" style={{
                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                    color: 'white',
                    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)'
                  }}>
                    <FontAwesomeIcon icon={faEthereum} />
                  </div>
                  <h3 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                    Ethereum
                  </h3>
                  <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold" style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    color: '#818cf8'
                  }}>
                    DeFi & NFTs
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Ecossistema consolidado
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <FontAwesomeIcon icon={faArrowRight} className="text-3xl" style={{ color: "var(--text-secondary)", opacity: 0.5 }} />
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{
                    color: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}>
                    Diversificação
                  </span>
                </div>

                {/* Altcoins */}
                <div className="flex-1 min-w-[220px] max-w-[260px] text-center space-y-3 p-6 rounded-2xl border-2 transition-all hover:scale-105" style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-light)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl" style={{
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                    color: 'white',
                    boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)'
                  }}>
                    <FontAwesomeIcon icon={faCoins} />
                  </div>
                  <h3 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                    Altcoins
                  </h3>
                  <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold" style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444'
                  }}>
                    Alto Risco/Retorno
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Oportunidades emergentes
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <FontAwesomeIcon icon={faArrowRight} className="text-3xl" style={{ color: "var(--text-secondary)", opacity: 0.5 }} />
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{
                    color: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}>
                    Lucros
                  </span>
                </div>

                {/* BTC + Stablecoin */}
                <div className="flex-1 min-w-[220px] max-w-[260px] text-center space-y-3 p-6 rounded-2xl border-2 transition-all hover:scale-105" style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-light)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{
                      background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
                    }}>
                      <FontAwesomeIcon icon={faBitcoin} />
                    </div>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{
                      background: 'linear-gradient(135deg, #10b981, #34d399)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(52, 211, 153, 0.4)'
                    }}>
                      <FontAwesomeIcon icon={faDollarSign} />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                    BTC + Stables
                  </h3>
                  <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold" style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981'
                  }}>
                    Segurança
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Aguardando oportunidades
                  </p>
                </div>
              </div>

              {/* Mobile: Vertical Flow */}
              <div className="md:hidden space-y-6">
                {[
                  {
                    icon: faBitcoin,
                    title: 'Bitcoin',
                    badge: 'Reserva de Valor',
                    desc: 'Lucros realizados',
                    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                    badgeBg: 'rgba(251, 191, 36, 0.2)',
                    badgeColor: '#fbbf24',
                    shadowColor: 'rgba(251, 191, 36, 0.4)',
                    arrow: 'Rotação',
                    arrowColor: '#22c55e',
                    arrowBg: 'rgba(34, 197, 94, 0.15)'
                  },
                  {
                    icon: faEthereum,
                    title: 'Ethereum',
                    badge: 'DeFi & NFTs',
                    desc: 'Ecossistema consolidado',
                    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
                    badgeBg: 'rgba(99, 102, 241, 0.2)',
                    badgeColor: '#818cf8',
                    shadowColor: 'rgba(99, 102, 241, 0.4)',
                    arrow: 'Diversificação',
                    arrowColor: '#22c55e',
                    arrowBg: 'rgba(34, 197, 94, 0.15)'
                  },
                  {
                    icon: faCoins,
                    title: 'Altcoins',
                    badge: 'Alto Risco/Retorno',
                    desc: 'Oportunidades emergentes',
                    gradient: 'linear-gradient(135deg, #dc2626, #ef4444)',
                    badgeBg: 'rgba(239, 68, 68, 0.2)',
                    badgeColor: '#ef4444',
                    shadowColor: 'rgba(239, 68, 68, 0.4)',
                    arrow: 'Lucros',
                    arrowColor: '#f59e0b',
                    arrowBg: 'rgba(245, 158, 11, 0.15)'
                  },
                  {
                    icon: faDollarSign,
                    title: 'BTC + Stables',
                    badge: 'Segurança',
                    desc: 'Aguardando oportunidades',
                    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
                    badgeBg: 'rgba(16, 185, 129, 0.2)',
                    badgeColor: '#10b981',
                    shadowColor: 'rgba(52, 211, 153, 0.4)'
                  }
                ].map((step, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-5 p-5 rounded-2xl border-2" style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-light)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                    }}>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{
                        background: step.gradient,
                        color: 'white',
                        boxShadow: `0 6px 16px ${step.shadowColor}`
                      }}>
                        <FontAwesomeIcon icon={step.icon} />
                      </div>

                      <div className="flex-1 space-y-2">
                        <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                          {step.title}
                        </h3>
                        <span className="inline-block px-3 py-1 text-xs rounded-full font-semibold" style={{
                          backgroundColor: step.badgeBg,
                          color: step.badgeColor
                        }}>
                          {step.badge}
                        </span>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    {step.arrow && (
                      <div className="flex items-center justify-center py-3">
                        <div className="flex flex-col items-center gap-2">
                          <FontAwesomeIcon icon={faArrowRight} className="text-2xl rotate-90" style={{ color: "var(--text-secondary)", opacity: 0.5 }} />
                          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{
                            color: step.arrowColor,
                            backgroundColor: step.arrowBg,
                            border: `1px solid ${step.arrowColor}33`
                          }}>
                            {step.arrow}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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

    </>
  );
}
