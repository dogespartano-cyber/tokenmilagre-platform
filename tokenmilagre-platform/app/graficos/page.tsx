'use client';

import dynamic from 'next/dynamic';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';
import CryptoAnalyzer from '@/components/CryptoAnalyzer';
import MarketFlow from '@/components/MarketFlow';

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

      <div className="min-h-screen relative transition-colors duration-300">
        {/* Dynamic Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-info/10 dark:bg-info/20 blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '0.8s' }}></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="space-y-16">

            {/* Section 1: Macro & Money Flow */}
            <section className="space-y-12 animate-fade-in-up">
              <MarketFlow />

              <div className="glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/10">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mapa de Calor S&P 500</h2>
                  <p className="text-gray-500 dark:text-gray-400">Visão macro do mercado de ações global</p>
                </div>
                <StockHeatmapWidget />

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Caminho do Dinheiro
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Investidores direcionam lucros das grandes ações (S&P 500) para projetos de maior risco e retorno, como Bitcoin. Com os lucros do BTC, diversificam para Ethereum e, finalmente, para altcoins de alto risco/retorno.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Crypto Overview */}
            <section className="space-y-12 animate-fade-in-up delay-100">
              {/* Heatmap - Full Width */}
              <div className="glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/10 h-[600px] flex flex-col">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mapa de Calor Cripto</h2>
                  <p className="text-gray-500 dark:text-gray-400">Performance do mercado em tempo real</p>
                </div>
                <div className="flex-1 rounded-xl overflow-hidden">
                  <CryptoHeatmapWidget />
                </div>
              </div>

              {/* Bubbles - Full Width */}
              <div className="glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/10 h-[800px] flex flex-col">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bolhas Cripto</h2>
                  <p className="text-gray-500 dark:text-gray-400">Visualização interativa de volume e tendência</p>
                </div>
                <div className="flex-1 rounded-xl overflow-hidden bg-black/5 dark:bg-black/20">
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

            {/* Section 3: Command Center (Deep Dive) */}
            <section className="space-y-6 animate-fade-in-up delay-200">
              <CryptoAnalyzer />
            </section>

            {/* Section 4: Institutional Data */}
            <section className="animate-fade-in-up delay-300">
              <ETFMetricsSection />
            </section>

            {/* Footer CTA - Reverted to Original Style */}
            <div className="space-y-6 animate-fade-in-up delay-400">
              <div>
                <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2 text-gray-900 dark:text-white">
                  Acompanhe $MILAGRE
                </h2>
                Educação financeira descentralizada. Monitore o mercado e aprenda a investir com sabedoria.
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://discord.gg/jPgZr7BVXY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card group flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/20 text-[#5865F2]"
                >
                  <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
                  <span>Discord</span>
                </a>

                <a
                  href="https://t.me/+Bop_TVFc_mg3Njlh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card group flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/20 text-[#0088cc]"
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
