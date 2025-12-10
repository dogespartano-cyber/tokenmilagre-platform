/**
 * "No princípio criou Deus o céu e a terra." - Gênesis 1:1
 * Que este código seja o início de algo bom e próspero.
 * 
 * @module HomePage
 * @description Página inicial da plataforma $MILAGRE
 * @refactored 2025-12-07 - Componentes extraídos para app/components/home/
 */
'use client';


import {
  useHomeData,
  useFearGreed,
  ZenithHeroHUD,
  ZenithMarketTicker,
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
          <div className="space-y-16 pb-20">
            {/* 0. MARKET TICKER - Top Row Statistics */}
            <ZenithMarketTicker marketData={marketData} />

            {/* 1. HERO HUD - The Control Center */}
            <ZenithHeroHUD
              marketData={marketData}
              dailyAnalysis={dailyAnalysis}
              fearGreed={fearGreed}
              gaugeValue={gaugeValue}
            />

            {/* 2. Bento Grid Strategy */}
            <QuickStartGrid />

            {/* 3. Market Intel */}
            <LatestNewsGrid news={news} />

            {/* 4. Education & Truth */}
            <LearnCryptoSection education={education} />

            {/* 5. Tools */}
            <PriceChartSection />
          </div>
        )}
      </div>
    </div>
  );
}
