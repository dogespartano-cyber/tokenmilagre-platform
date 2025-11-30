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

      <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#0F1419] transition-colors duration-300">
        {/* Dynamic Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-info/10 dark:bg-info/20 blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '0.8s' }}></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="space-y-8">
            {/* Main Content */}
            <div className="space-y-12">

              {/* 1. Macro: Mapa de Calor S&P 500 */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2 text-gray-900 dark:text-white">
                    Mapa de Calor - S&P 500
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    Visualize o desempenho das principais ações dos EUA - onde está a maior parte do capital global
                  </p>
                </div>

                <StockHeatmapWidget />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-white/10"></div>

              {/* 2. Caminho do Dinheiro - Explicação */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h1 className="text-4xl font-bold font-[family-name:var(--font-poppins)] text-gray-900 dark:text-white">
                    Caminho do Dinheiro
                  </h1>
                  <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                    Investidores direcionam lucros das grandes ações (S&P 500) para projetos de maior risco e retorno, como Bitcoin. Com os lucros do BTC, diversificam para Ethereum e, finalmente, para altcoins de alto risco/retorno. Este é o caminho natural do capital em busca de maiores oportunidades.
                  </p>
                </div>

                {/* Desktop: Horizontal Flow */}
                <div className="hidden md:flex items-center justify-start gap-8">
                  {/* Step 1: S&P 500 */}
                  <div className="flex-1 max-w-[240px] text-center space-y-3 p-6 rounded-2xl border transition-all duration-300 hover:scale-105 backdrop-blur-md bg-white/60 dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl relative group" style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(30, 64, 175, 0.2))',
                      color: '#3B82F6',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                      <FontAwesomeIcon icon={faChartLine} className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white drop-shadow-sm">
                      S&P 500
                    </h3>
                    <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold border" style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: '#3B82F6',
                      borderColor: 'rgba(59, 130, 246, 0.2)'
                    }}>
                      Baixo Risco
                    </span>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      Capital global
                    </p>
                  </div>

                  <FontAwesomeIcon icon={faArrowRight} className="text-3xl flex-shrink-0" style={{ color: "var(--text-secondary)", opacity: 0.5 }} />

                  {/* Step 2: Bitcoin */}
                  <div className="flex-1 max-w-[240px] text-center space-y-3 p-6 rounded-2xl border transition-all duration-300 hover:scale-105 backdrop-blur-md bg-white/60 dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl relative group" style={{
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.2))',
                      color: '#F59E0B',
                      boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      <FontAwesomeIcon icon={faBitcoin} className="drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white drop-shadow-sm">
                      Bitcoin
                    </h3>
                    <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold border" style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      color: '#F59E0B',
                      borderColor: 'rgba(245, 158, 11, 0.2)'
                    }}>
                      Risco Médio
                    </span>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      Porta de entrada
                    </p>
                  </div>

                  <FontAwesomeIcon icon={faArrowRight} className="text-3xl flex-shrink-0" style={{ color: "var(--text-secondary)", opacity: 0.5 }} />

                  {/* Step 3: Ethereum */}
                  <div className="flex-1 max-w-[240px] text-center space-y-3 p-6 rounded-2xl border transition-all duration-300 hover:scale-105 backdrop-blur-md bg-white/60 dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl relative group" style={{
                      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(251, 146, 60, 0.2))',
                      color: '#F97316',
                      boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)',
                      border: '1px solid rgba(249, 115, 22, 0.3)'
                    }}>
                      <FontAwesomeIcon icon={faEthereum} className="drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white drop-shadow-sm">
                      Ethereum
                    </h3>
                    <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold border" style={{
                      backgroundColor: 'rgba(249, 115, 22, 0.1)',
                      color: '#F97316',
                      borderColor: 'rgba(249, 115, 22, 0.2)'
                    }}>
                      Risco Elevado
                    </span>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      Inovação
                    </p>
                  </div>

                  <FontAwesomeIcon icon={faArrowRight} className="text-3xl flex-shrink-0" style={{ color: "var(--text-secondary)", opacity: 0.5 }} />

                  {/* Step 4: Altcoins */}
                  <div className="flex-1 max-w-[240px] text-center space-y-3 p-6 rounded-2xl border transition-all duration-300 hover:scale-105 backdrop-blur-md bg-white/60 dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl relative group" style={{
                      background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(239, 68, 68, 0.2))',
                      color: '#EF4444',
                      boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
                      border: '1px solid rgba(220, 38, 38, 0.3)'
                    }}>
                      <FontAwesomeIcon icon={faCoins} className="drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white drop-shadow-sm">
                      Altcoins
                    </h3>
                    <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold border" style={{
                      backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      color: '#EF4444',
                      borderColor: 'rgba(220, 38, 38, 0.2)'
                    }}>
                      Alto Risco
                    </span>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
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
                      <div className="flex items-center gap-5 p-5 rounded-2xl border transition-all duration-300 backdrop-blur-md bg-white/60 dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{
                          background: step.gradient,
                          color: 'white',
                          boxShadow: `0 0 20px ${step.shadowColor}`,
                          border: `1px solid ${step.shadowColor}`
                        }}>
                          <FontAwesomeIcon icon={step.icon} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            {step.title}
                          </h3>
                          <span className="inline-block px-3 py-1 text-xs rounded-full font-semibold border" style={{
                            backgroundColor: step.badgeBg,
                            color: step.badgeColor,
                            borderColor: step.badgeColor + '40'
                          }}>
                            {step.risk}
                          </span>
                          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
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
              <div className="border-t border-gray-200 dark:border-white/10"></div>

              {/* 3. Mercado Cripto Agregado: Mapa de Calor */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2 text-gray-900 dark:text-white">
                    Mapa de Calor de Criptomoedas
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    Entrada de investidores buscando diversificação no mercado cripto
                  </p>
                </div>

                <CryptoHeatmapWidget />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-white/10"></div>

              {/* Fluxo de Capital no Mercado Cripto */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] text-gray-900 dark:text-white">
                    Fluxo de Capital no Mercado Cripto
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    Dentro do mercado cripto, o capital segue um padrão: lucros realizados no Bitcoin são alocados em Ethereum, que por sua vez são diversificados em altcoins de menor capitalização e maior potencial de retorno. Os lucros das altcoins de alto risco retornam para BTC e Stablecoins, aguardando novas oportunidades. Este ciclo se repete a cada movimento de alta do mercado.
                  </p>
                </div>

                {/* Desktop: Horizontal Flow */}
                <div className="hidden md:flex items-center justify-start gap-8 flex-wrap">
                  {/* BTC */}
                  <div className="flex-1 min-w-[220px] max-w-[260px] text-center space-y-3 p-6 rounded-2xl border transition-all duration-300 hover:scale-105 backdrop-blur-md bg-white/60 dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl relative group" style={{
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.2))',
                      color: '#F59E0B',
                      boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      <FontAwesomeIcon icon={faBitcoin} className="drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white drop-shadow-sm">
                      Bitcoin
                    </h3>
                    <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold border" style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      color: '#F59E0B',
                      borderColor: 'rgba(245, 158, 11, 0.2)'
                    }}>
                      Reserva de Valor
                    </span>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
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
                  <div className="flex-1 min-w-[220px] max-w-[260px] text-center space-y-3 p-6 rounded-2xl border transition-all duration-300 hover:scale-105 backdrop-blur-md bg-white/60 dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl relative group" style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(129, 140, 248, 0.2))',
                      color: '#6366F1',
                      boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
                      border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}>
                      <FontAwesomeIcon icon={faEthereum} className="drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white drop-shadow-sm">
                      Ethereum
                    </h3>
                    <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold border" style={{
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      color: '#6366F1',
                      borderColor: 'rgba(99, 102, 241, 0.2)'
                    }}>
                      DeFi & NFTs
                    </span>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
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
                  <div className="flex-1 min-w-[220px] max-w-[260px] text-center space-y-3 p-6 rounded-2xl border transition-all duration-300 hover:scale-105 backdrop-blur-md bg-white/60 dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl relative group" style={{
                      background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(239, 68, 68, 0.2))',
                      color: '#EF4444',
                      boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
                      border: '1px solid rgba(220, 38, 38, 0.3)'
                    }}>
                      <FontAwesomeIcon icon={faCoins} className="drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white drop-shadow-sm">
                      Altcoins
                    </h3>
                    <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold border" style={{
                      backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      color: '#EF4444',
                      borderColor: 'rgba(220, 38, 38, 0.2)'
                    }}>
                      Alto Risco/Retorno
                    </span>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
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
                  <div className="flex-1 min-w-[220px] max-w-[260px] text-center space-y-3 p-6 rounded-2xl border transition-all duration-300 hover:scale-105 backdrop-blur-md bg-white/60 dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl relative group" style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.2))',
                        color: '#F59E0B',
                        boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)',
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                      }}>
                        <FontAwesomeIcon icon={faBitcoin} />
                      </div>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl relative group" style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(52, 211, 153, 0.2))',
                        color: '#10B981',
                        boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        <FontAwesomeIcon icon={faDollarSign} />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white drop-shadow-sm">
                      BTC + Stables
                    </h3>
                    <span className="inline-block px-3 py-1.5 text-xs rounded-full font-semibold border" style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10B981',
                      borderColor: 'rgba(16, 185, 129, 0.2)'
                    }}>
                      Segurança
                    </span>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
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
                      <div className="flex items-center gap-5 p-5 rounded-2xl border transition-all duration-300 backdrop-blur-md bg-white/60 dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{
                          background: step.gradient,
                          color: 'white',
                          boxShadow: `0 0 20px ${step.shadowColor}`,
                          border: `1px solid ${step.shadowColor}`
                        }}>
                          <FontAwesomeIcon icon={step.icon} />
                        </div>

                        <div className="flex-1 space-y-2">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            {step.title}
                          </h3>
                          <span className="inline-block px-3 py-1 text-xs rounded-full font-semibold border" style={{
                            backgroundColor: step.badgeBg,
                            color: step.badgeColor,
                            borderColor: step.badgeColor + '40'
                          }}>
                            {step.badge}
                          </span>
                          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
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
              <div className="border-t border-gray-200 dark:border-white/10"></div>

              {/* 4. Mercado Cripto Agregado: Crypto Bubbles */}
              <div className="space-y-6">
                {/* SEO only - hidden visually */}
                <div className="sr-only">
                  <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2 text-gray-900 dark:text-white">
                    Crypto Bubbles - Visualização Interativa
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    Explore o mercado cripto em tempo real com visualização interativa de bolhas
                  </p>
                </div>

                <div className="backdrop-blur-xl rounded-2xl p-2 border shadow-2xl overflow-hidden bg-white/60 dark:bg-white/5 border-gray-200 dark:border-white/10">
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
              <div className="border-t border-gray-200 dark:border-white/10"></div>

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
                      <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                        <TokenBTC size={24} variant="branded" />
                        Bitcoin - Sentimento
                      </h4>
                      <TechnicalAnalysisWidget symbol="BINANCE:BTCUSDT" />
                    </div>

                    {/* Análise Técnica ETH */}
                    <div>
                      <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                        <TokenETH size={24} variant="branded" />
                        Ethereum - Sentimento
                      </h4>
                      <TechnicalAnalysisWidget symbol="BINANCE:ETHUSDT" />
                    </div>

                    {/* Análise Técnica SOL */}
                    <div>
                      <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                        <TokenSOL size={24} variant="branded" />
                        Solana - Sentimento
                      </h4>
                      <TechnicalAnalysisWidget symbol="BINANCE:SOLUSDT" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-white/10"></div>

              {/* 5. ETFs de Bitcoin e Ethereum */}
              <ETFMetricsSection />

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-white/10"></div>

              {/* 6. Token $MILAGRE CTA */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2 text-gray-900 dark:text-white">
                    Acompanhe $MILAGRE
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    O token da educação financeira descentralizada. Monitore o mercado e aprenda a investir com sabedoria.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://discord.gg/jPgZr7BVXY"
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
      </div>

    </>
  );
}
