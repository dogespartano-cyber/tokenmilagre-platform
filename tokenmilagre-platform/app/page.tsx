/**
 * "No princípio criou Deus o céu e a terra." - Gênesis 1:1
 * Que este código seja o início de algo bom e próspero.
 * 
 * @module HomePage
 * @description Página inicial da plataforma $MILAGRE
 * @refactored 2025-12-07 - Componentes extraídos para app/components/home/
 */
'use client';

import NavbarCryptoTicker from '@/components/NavbarCryptoTicker';
import {
  useHomeData,
  useFearGreed,
  MarketDataCards,
  FearGreedGauge,
  DailyAnalysisCard,
  QuickStartGrid,
  LatestNewsGrid,
  LearnCryptoSection,
  PriceChartSection,
  LoadingSkeleton,
} from './components/home';

export default function HomePage() {
  const { marketData, news, education, dailyAnalysis, loading } = useHomeData();
  const { fearGreed, gaugeValue } = useFearGreed();

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-6 md:px-10 py-8 relative z-10">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-12">
            {/* Visão Geral do Mercado + Velocímetro Integrado */}
            <div className="space-y-6">
              {/* Mobile Fear & Greed Gauge */}
              <FearGreedGauge fearGreed={fearGreed} gaugeValue={gaugeValue} />

              {/* Mobile Crypto Ticker */}
              <div className="lg:hidden mb-8">
                <div className="py-4">
                  <NavbarCryptoTicker variant="mobile" />
                </div>
              </div>

              {/* Market Data Cards */}
              <MarketDataCards marketData={marketData} />
            </div>

            {/* Análise do Dia */}
            <DailyAnalysisCard dailyAnalysis={dailyAnalysis} marketData={marketData} />

            {/* Recursos Essenciais */}
            <QuickStartGrid />

            {/* Últimas Notícias */}
            <LatestNewsGrid news={news} />

            {/* Aprenda sobre Cripto */}
            <LearnCryptoSection education={education} />

            {/* Gráfico de Preços */}
            <PriceChartSection />
          </div>
        )}
      </div>
    </div>
  );
}
