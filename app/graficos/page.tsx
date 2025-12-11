'use client';

import dynamic from 'next/dynamic';
import Script from 'next/script';
import CryptoAnalyzer from '@/components/crypto/CryptoAnalyzer';
import MarketFlow from '@/components/crypto/MarketFlow';
import SocialLinks from '@/components/shared/SocialLinks';

const CryptoHeatmapWidget = dynamic(() => import('@/components/widgets/CryptoHeatmapWidget'), {
  ssr: false,
});

const StockHeatmapWidget = dynamic(() => import('@/components/widgets/StockHeatmapWidget'), {
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
          "description": "Acompanhe o mercado de criptomoedas em tempo real com gráficos avançados, análise técnica e indicadores profissionais",
          "url": "https://tokenmilagre.xyz/graficos"
        })}
      </Script>

      <div className="min-h-screen relative transition-colors duration-300">


        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="space-y-16">

            {/* Section 1: Command Center (Deep Dive) - Moved to Top */}
            <section className="space-y-6 animate-fade-in-up">
              <CryptoAnalyzer />
            </section>

            {/* Section 2: Macro & Money Flow */}
            <section className="space-y-12 animate-fade-in-up delay-100">
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mapa de Calor S&P 500</h2>
                  <p className="text-gray-500 dark:text-gray-400">Visão macro do mercado de ações global</p>
                </div>
                <StockHeatmapWidget />

                <div className="mt-8">
                  <MarketFlow />
                </div>
              </div>
            </section>

            {/* Section 3: Crypto Overview */}
            <section className="space-y-12 animate-fade-in-up delay-200">
              {/* Heatmap - Full Width */}
              <div className="p-6 h-[800px] flex flex-col">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mapa de Calor Cripto</h2>
                  <p className="text-gray-500 dark:text-gray-400">Performance do mercado em tempo real</p>
                </div>
                <div className="flex-1 rounded-xl overflow-hidden">
                  <CryptoHeatmapWidget />
                </div>
              </div>

              {/* Bubbles - Full Width */}
              <div className="p-6 h-[800px] flex flex-col">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bolhas Cripto</h2>
                  <p className="text-gray-500 dark:text-gray-400">Visualização interativa de volume e tendência</p>
                </div>
                <div className="flex-1 rounded-xl overflow-hidden">
                  <iframe
                    src="https://cryptobubbles.net"
                    className="w-full h-full"
                    style={{ border: 'none' }}
                    loading="lazy"
                    title="CryptoBubbles"
                  />
                </div>
              </div>
            </section>



            {/* Section 4: Institutional Data - REMOVIDO */}

            {/* Footer CTA - Reverted to Original Style */}
            <div className="space-y-6 animate-fade-in-up delay-400">
              <div>
                <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2 text-gray-900 dark:text-white">
                  Acompanhe $MILAGRE
                </h2>
                Educação financeira descentralizada. Monitore o mercado e aprenda a investir com sabedoria.
              </div>

              <div className="flex flex-wrap gap-4">
                <SocialLinks variant="buttons" platforms={['discord', 'telegram']} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
