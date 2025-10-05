'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LightweightChart = dynamic(() => import('@/components/LightweightChart'), {
  ssr: false,
});

const AdvancedChart = dynamic(() => import('@/components/AdvancedChart'), {
  ssr: false,
});

const TechnicalAnalysisWidget = dynamic(() => import('@/components/TechnicalAnalysisWidget'), {
  ssr: false,
});

const CustomCryptoScreener = dynamic(() => import('@/components/CustomCryptoScreener'), {
  ssr: false,
});

const CryptoHeatmapWidget = dynamic(() => import('@/components/CryptoHeatmapWidget'), {
  ssr: false,
});

const TickerTapeWidget = dynamic(() => import('@/components/TickerTapeWidget'), {
  ssr: false,
});

interface MarketData {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  ethDominance: number;
  marketCapChange24h: number;
}

interface FearGreedData {
  value: string;
  value_classification: string;
}

interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export default function MercadoPage() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
    fetchFearGreed();
    fetchNews();

    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      fetchMarketData();
      fetchFearGreed();
      fetchNews();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/global'
      );
      const data = await response.json();

      setMarketData({
        totalMarketCap: data.data.total_market_cap.usd,
        totalVolume: data.data.total_volume.usd,
        btcDominance: data.data.market_cap_percentage.btc,
        ethDominance: data.data.market_cap_percentage.eth,
        marketCapChange24h: data.data.market_cap_change_percentage_24h_usd,
      });
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados do mercado:', error);
      setLoading(false);
    }
  };

  const fetchFearGreed = async () => {
    try {
      const response = await fetch('https://api.alternative.me/fng/');
      const data = await response.json();
      setFearGreed(data.data[0]);
    } catch (error) {
      console.error('Erro ao buscar Fear & Greed Index:', error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      if (data.success) {
        setNews(data.data.slice(0, 3)); // Pegar apenas as 3 últimas notícias
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString('pt-BR')}`;
  };

  const getFearGreedColor = (value: number) => {
    if (value <= 25) return 'from-red-500 to-red-600';
    if (value <= 45) return 'from-orange-500 to-orange-600';
    if (value <= 55) return 'from-yellow-500 to-yellow-600';
    if (value <= 75) return 'from-green-500 to-green-600';
    return 'from-emerald-500 to-emerald-600';
  };

  const getFearGreedEmoji = (classification: string) => {
    const map: { [key: string]: string } = {
      'Extreme Fear': '😱',
      'Fear': '😰',
      'Neutral': '😐',
      'Greed': '🤑',
      'Extreme Greed': '🚀'
    };
    return map[classification] || '📊';
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '🟢';
      case 'negative': return '🔴';
      default: return '🟡';
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const published = new Date(date);
    const diffMs = now.getTime() - published.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `Há ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Há ${diffDays}d`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-pulse">📊</div>
            <p className="text-white text-xl">Carregando dados do mercado...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Ticker Tape - Fita de Preços */}
            <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-yellow-400/40 bg-gradient-to-r from-yellow-400/10 via-amber-400/10 to-yellow-400/10">
              <TickerTapeWidget />
            </div>

            {/* Visão Geral do Mercado */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Capitalização Total */}
              <div className="bg-gradient-to-br from-[#142841] to-[#1E3A5F] backdrop-blur-lg rounded-2xl p-6 border-2 border-[#2A4A6E] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#94A3B8] text-sm">Capitalização Total</p>
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-[#FFFFFF] font-bold text-3xl mb-1">
                  {marketData && formatNumber(marketData.totalMarketCap)}
                </p>
                <p className={`text-sm font-semibold ${
                  marketData && marketData.marketCapChange24h >= 0
                    ? 'text-[#10B981]'
                    : 'text-[#EF4444]'
                }`}>
                  {marketData && marketData.marketCapChange24h >= 0 ? '▲' : '▼'}
                  {marketData && Math.abs(marketData.marketCapChange24h).toFixed(2)}% (24h)
                </p>
              </div>

              {/* Volume 24h */}
              <div className="bg-gradient-to-br from-[#142841] to-[#1E3A5F] backdrop-blur-lg rounded-2xl p-6 border-2 border-[#2A4A6E] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#94A3B8] text-sm">Volume 24h</p>
                  <span className="text-2xl">📈</span>
                </div>
                <p className="text-[#FFFFFF] font-bold text-3xl mb-1">
                  {marketData && formatNumber(marketData.totalVolume)}
                </p>
                <p className="text-[#64748B] text-sm">Negociação global</p>
              </div>

              {/* Dominância BTC */}
              <div className="bg-gradient-to-br from-[#F59E0B]/15 to-[#D97706]/15 backdrop-blur-lg rounded-2xl p-6 border border-[#F59E0B]/30 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#94A3B8] text-sm">Dominância BTC</p>
                  <span className="text-2xl">₿</span>
                </div>
                <p className="text-[#FFFFFF] font-bold text-3xl mb-1">
                  {marketData && marketData.btcDominance.toFixed(2)}%
                </p>
                <div className="w-full bg-[#2A4A6E]/50 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] h-full rounded-full transition-all duration-500"
                    style={{ width: `${marketData?.btcDominance}%` }}
                  />
                </div>
              </div>

              {/* Dominância ETH */}
              <div className="bg-gradient-to-br from-[#8B5CF6]/15 to-[#7C3AED]/15 backdrop-blur-lg rounded-2xl p-6 border border-[#8B5CF6]/30 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#94A3B8] text-sm">Dominância ETH</p>
                  <span className="text-2xl">Ξ</span>
                </div>
                <p className="text-[#FFFFFF] font-bold text-3xl mb-1">
                  {marketData && marketData.ethDominance.toFixed(2)}%
                </p>
                <div className="w-full bg-[#2A4A6E]/50 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] h-full rounded-full transition-all duration-500"
                    style={{ width: `${marketData?.ethDominance}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Análise de Mercado e Links */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Sentimento & Análise do Mercado */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
                <h3 className="text-white font-bold text-xl mb-6 font-[family-name:var(--font-poppins)]">
                  📊 Análise de Mercado
                </h3>

                {/* Sentimento do Mercado */}
                {fearGreed && (
                  <div className="mb-6 pb-6 border-b border-white/20">
                    <p className="text-white/70 text-sm mb-3 font-semibold">Sentimento do Mercado</p>
                    <div className="flex items-center gap-4">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getFearGreedColor(parseInt(fearGreed.value))} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex flex-col items-center justify-center">
                          <span className="text-2xl">{getFearGreedEmoji(fearGreed.value_classification)}</span>
                          <span className="text-white font-bold text-sm">{fearGreed.value}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold text-lg mb-1">
                          {fearGreed.value_classification === 'Extreme Fear' && 'Medo Extremo'}
                          {fearGreed.value_classification === 'Fear' && 'Medo'}
                          {fearGreed.value_classification === 'Neutral' && 'Neutro'}
                          {fearGreed.value_classification === 'Greed' && 'Ganância'}
                          {fearGreed.value_classification === 'Extreme Greed' && 'Ganância Extrema'}
                        </p>
                        <p className="text-white/70 text-sm leading-relaxed">
                          {parseInt(fearGreed.value) <= 25 && 'Mercado em pânico - possível oportunidade de compra'}
                          {parseInt(fearGreed.value) > 25 && parseInt(fearGreed.value) <= 45 && 'Investidores cautelosos - sentimento negativo'}
                          {parseInt(fearGreed.value) > 45 && parseInt(fearGreed.value) <= 55 && 'Mercado equilibrado - sem tendência clara'}
                          {parseInt(fearGreed.value) > 55 && parseInt(fearGreed.value) <= 75 && 'Otimismo crescente - mercado aquecendo'}
                          {parseInt(fearGreed.value) > 75 && 'Euforia no mercado - atenção a correções'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Altcoin Season */}
                {marketData && (
                  <div>
                    <p className="text-white/70 text-sm mb-3 font-semibold">Ciclo de Mercado</p>
                    <div className="flex items-center gap-4">
                      <div className={`w-20 h-20 rounded-full ${
                        marketData.btcDominance < 40
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                          : marketData.btcDominance < 50
                          ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      } flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <span className="text-3xl">
                          {marketData.btcDominance < 40 ? '🚀' : marketData.btcDominance < 50 ? '⚡' : '₿'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold text-lg mb-1">
                          {marketData.btcDominance < 40
                            ? `Altseason Ativa! ${Math.round(100 - marketData.btcDominance)}% de intensidade`
                            : marketData.btcDominance < 50
                            ? `Aproximando Altseason: ${Math.round((50 - marketData.btcDominance) * 2)}% de chance`
                            : `Bitcoin Dominante: ${Math.round((100 - marketData.btcDominance) / 2)}% de chance de Altseason`
                          }
                        </p>
                        <p className="text-white/70 text-sm leading-relaxed">
                          {marketData.btcDominance < 40 && 'Altcoins superando BTC - momento ideal para diversificação'}
                          {marketData.btcDominance >= 40 && marketData.btcDominance < 50 && 'Transição em curso - monitore oportunidades em altcoins'}
                          {marketData.btcDominance >= 50 && 'BTC lidera o mercado - foco em Bitcoin e grandes caps'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Últimas Notícias */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
                <h3 className="text-white font-bold text-xl mb-4 font-[family-name:var(--font-poppins)] flex items-center gap-2">
                  <span>📰</span>
                  <span>Últimas Notícias</span>
                </h3>
                <div className="space-y-3">
                  {news.length > 0 ? (
                    news.map((item, idx) => (
                      <Link
                        key={idx}
                        href={`/dashboard/noticias/${item.slug || item.id}`}
                        className="block bg-[#142841]/50 hover:bg-[#1E3A5F] rounded-lg p-3 border border-[#2A4A6E]/40 hover:border-[#10B981]/50 transition-all duration-300 group hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">{getSentimentIcon(item.sentiment)}</span>
                          <span className="text-[#94A3B8] text-xs">{item.category[0]}</span>
                          <span className="text-[#64748B] text-xs ml-auto">{getTimeAgo(item.publishedAt)}</span>
                        </div>
                        <h4 className="text-[#E0E6ED] font-semibold text-sm mb-1 line-clamp-2 group-hover:text-[#10B981] transition">
                          {item.title}
                        </h4>
                        <p className="text-[#94A3B8] text-xs line-clamp-2">{item.summary}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-[#94A3B8] text-sm text-center py-4">Carregando notícias...</p>
                  )}
                </div>
                <Link
                  href="/dashboard/noticias"
                  className="mt-4 block text-center text-yellow-400 hover:text-yellow-300 font-semibold text-sm transition"
                >
                  Ver todas as notícias →
                </Link>
              </div>

              {/* Links Úteis */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
                <h3 className="text-white font-bold text-xl mb-4 font-[family-name:var(--font-poppins)] flex items-center gap-2">
                  <span>🔗</span>
                  <span>Links Úteis</span>
                </h3>
                <div className="space-y-2">
                  <a
                    href="https://www.coingecko.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#142841]/50 hover:bg-[#1E3A5F] rounded-lg p-3 border border-[#2A4A6E]/40 hover:border-[#10B981]/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <p className="text-[#E0E6ED] font-semibold text-sm">📊 CoinGecko</p>
                    <p className="text-[#94A3B8] text-xs">Dados de mercado</p>
                  </a>
                  <a
                    href="https://coinmarketcap.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#142841]/50 hover:bg-[#1E3A5F] rounded-lg p-3 border border-[#2A4A6E]/40 hover:border-[#10B981]/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <p className="text-[#E0E6ED] font-semibold text-sm">💹 CoinMarketCap</p>
                    <p className="text-[#94A3B8] text-xs">Rankings e preços</p>
                  </a>
                  <a
                    href="https://br.tradingview.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#142841]/50 hover:bg-[#1E3A5F] rounded-lg p-3 border border-[#2A4A6E]/40 hover:border-[#10B981]/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <p className="text-[#E0E6ED] font-semibold text-sm">📈 TradingView</p>
                    <p className="text-[#94A3B8] text-xs">Análise técnica</p>
                  </a>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-white/20"></div>

            {/* Gráfico Bitcoin Avançado com Indicadores */}
            <div className="space-y-6">
              <h2 className="text-white font-bold text-3xl font-[family-name:var(--font-poppins)] text-center mb-2">
                👑 Bitcoin - Análise Completa
              </h2>
              <p className="text-white/70 text-center mb-6">
                Gráfico avançado com Médias Móveis, Bandas de Bollinger e RSI
              </p>

              <AdvancedChart symbol="BTCUSDT" name="₿ Bitcoin (BTC/USDT) - Gráfico Profissional" />
            </div>

            {/* Divider */}
            <div className="border-t-2 border-white/20"></div>

            {/* Gráficos TradingView */}
            <div className="space-y-6">
              <h2 className="text-white font-bold text-3xl font-[family-name:var(--font-poppins)] text-center mb-2">
                📈 Gráficos ao Vivo
              </h2>
              <p className="text-white/70 text-center mb-6">Acompanhe BTC, ETH e SOL em tempo real</p>

              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                {/* BTC Chart */}
                <div>
                  <LightweightChart symbol="BTCUSDT" name="₿ Bitcoin (BTC/USDT)" />
                </div>

                {/* ETH Chart */}
                <div>
                  <LightweightChart symbol="ETHUSDT" name="Ξ Ethereum (ETH/USDT)" />
                </div>

                {/* SOL Chart */}
                <div>
                  <LightweightChart symbol="SOLUSDT" name="◎ Solana (SOL/USDT)" />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-white/20"></div>

            {/* Análise Técnica Avançada */}
            <div className="space-y-6">
              <h2 className="text-white font-bold text-3xl font-[family-name:var(--font-poppins)] text-center mb-2">
                🔬 Análise Técnica Avançada
              </h2>
              <p className="text-white/70 text-center mb-6">Indicadores técnicos e recomendações de trading</p>

              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                {/* Análise Técnica BTC */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <span>₿</span>
                    <span>Bitcoin - Indicadores</span>
                  </h3>
                  <TechnicalAnalysisWidget symbol="BINANCE:BTCUSDT" />
                </div>

                {/* Análise Técnica ETH */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <span>Ξ</span>
                    <span>Ethereum - Indicadores</span>
                  </h3>
                  <TechnicalAnalysisWidget symbol="BINANCE:ETHUSDT" />
                </div>

                {/* Análise Técnica SOL */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <span>◎</span>
                    <span>Solana - Indicadores</span>
                  </h3>
                  <TechnicalAnalysisWidget symbol="BINANCE:SOLUSDT" />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-white/20"></div>

            {/* Mapa de Calor & Rastreador */}
            <div className="space-y-6">
              <h2 className="text-white font-bold text-3xl font-[family-name:var(--font-poppins)] text-center mb-2">
                🗺️ Mapa de Mercado & Rastreador
              </h2>
              <p className="text-white/70 text-center mb-6">Visualize o mercado completo e filtre oportunidades</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Mapa de Calor Cripto */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <span>🔥</span>
                    <span>Mapa de Calor Cripto</span>
                  </h3>
                  <CryptoHeatmapWidget />
                </div>

                {/* Rastreador de Mercado */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <span>📋</span>
                    <span>Rastreador de Mercado</span>
                  </h3>
                  <CustomCryptoScreener />
                </div>
              </div>
            </div>

            {/* Token $MILAGRE CTA */}
            <div className="bg-gradient-to-r from-yellow-400/20 to-amber-400/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-yellow-300/40 shadow-xl text-center">
              <h3 className="text-white font-bold text-2xl mb-4 font-[family-name:var(--font-poppins)]">
                🌟 Acompanhe $MILAGRE
              </h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                O token da educação financeira descentralizada. Monitore o mercado e aprenda a investir com sabedoria.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 text-white font-bold rounded-full transition-all shadow-xl"
                >
                  📊 Meu Dashboard
                </Link>
                <a
                  href="https://pump.fun/coin/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-full transition-all shadow-xl"
                >
                  🚀 Comprar $MILAGRE
                </a>
              </div>
            </div>

            {/* Atualização */}
            <p className="text-center text-white/60 text-sm">
              🔄 Dados atualizados automaticamente a cada 30 segundos
            </p>
          </div>
        )}
      </div>
  );
}
