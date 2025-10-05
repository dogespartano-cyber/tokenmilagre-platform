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
            <p className="text-xl" style={{ color: 'var(--text-primary)' }}>Carregando dados do mercado...</p>
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
              <div className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" style={{
                background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                borderColor: 'var(--border-medium)'
              }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Capitalização Total</p>
                  <span className="text-2xl">💰</span>
                </div>
                <p className="font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
                  {marketData && formatNumber(marketData.totalMarketCap)}
                </p>
                <p className="text-sm font-semibold" style={{
                  color: marketData && marketData.marketCapChange24h >= 0 ? 'var(--success)' : 'var(--error)'
                }}>
                  {marketData && marketData.marketCapChange24h >= 0 ? '▲' : '▼'}
                  {marketData && Math.abs(marketData.marketCapChange24h).toFixed(2)}% (24h)
                </p>
              </div>

              {/* Volume 24h */}
              <div className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" style={{
                background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                borderColor: 'var(--border-medium)'
              }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Volume 24h</p>
                  <span className="text-2xl">📈</span>
                </div>
                <p className="font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
                  {marketData && formatNumber(marketData.totalVolume)}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Negociação global</p>
              </div>

              {/* Dominância BTC */}
              <div className="backdrop-blur-lg rounded-2xl p-6 border shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300" style={{
                background: 'linear-gradient(135deg, var(--warning-bg), var(--bg-elevated))',
                borderColor: 'var(--warning-border)'
              }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Dominância BTC</p>
                  <span className="text-2xl">₿</span>
                </div>
                <p className="font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
                  {marketData && marketData.btcDominance.toFixed(2)}%
                </p>
                <div className="w-full rounded-full h-2 mt-2" style={{ backgroundColor: 'var(--border-medium)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      background: 'linear-gradient(90deg, #F59E0B, #D97706)',
                      width: `${marketData?.btcDominance}%`
                    }}
                  />
                </div>
              </div>

              {/* Dominância ETH */}
              <div className="backdrop-blur-lg rounded-2xl p-6 border shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300" style={{
                background: 'linear-gradient(135deg, #EDE9FE, var(--bg-elevated))',
                borderColor: '#C4B5FD'
              }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Dominância ETH</p>
                  <span className="text-2xl">Ξ</span>
                </div>
                <p className="font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
                  {marketData && marketData.ethDominance.toFixed(2)}%
                </p>
                <div className="w-full rounded-full h-2 mt-2" style={{ backgroundColor: 'var(--border-medium)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
                      width: `${marketData?.ethDominance}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Análise de Mercado e Links */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Sentimento & Análise do Mercado */}
              <div className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h3 className="font-bold text-xl mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  📊 Análise de Mercado
                </h3>

                {/* Sentimento do Mercado */}
                {fearGreed && (
                  <div className="mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-medium)' }}>
                    <p className="text-sm mb-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Sentimento do Mercado</p>
                    <div className="flex items-center gap-4">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getFearGreedColor(parseInt(fearGreed.value))} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex flex-col items-center justify-center">
                          <span className="text-2xl">{getFearGreedEmoji(fearGreed.value_classification)}</span>
                          <span className="font-bold text-sm" style={{ color: 'var(--text-inverse)' }}>{fearGreed.value}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                          {fearGreed.value_classification === 'Extreme Fear' && 'Medo Extremo'}
                          {fearGreed.value_classification === 'Fear' && 'Medo'}
                          {fearGreed.value_classification === 'Neutral' && 'Neutro'}
                          {fearGreed.value_classification === 'Greed' && 'Ganância'}
                          {fearGreed.value_classification === 'Extreme Greed' && 'Ganância Extrema'}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
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
                    <p className="text-sm mb-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Ciclo de Mercado</p>
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
                        <p className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                          {marketData.btcDominance < 40
                            ? `Altseason Ativa! ${Math.round(100 - marketData.btcDominance)}% de intensidade`
                            : marketData.btcDominance < 50
                            ? `Aproximando Altseason: ${Math.round((50 - marketData.btcDominance) * 2)}% de chance`
                            : `Bitcoin Dominante: ${Math.round((100 - marketData.btcDominance) / 2)}% de chance de Altseason`
                          }
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
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
              <div className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h3 className="font-bold text-xl mb-4 font-[family-name:var(--font-poppins)] flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <span>📰</span>
                  <span>Últimas Notícias</span>
                </h3>
                <div className="space-y-3">
                  {news.length > 0 ? (
                    news.map((item, idx) => (
                      <Link
                        key={idx}
                        href={`/dashboard/noticias/${item.slug || item.id}`}
                        className="block rounded-lg p-3 border transition-all duration-300 group hover:shadow-lg hover:-translate-y-0.5"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-medium)'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">{getSentimentIcon(item.sentiment)}</span>
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.category[0]}</span>
                          <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>{getTimeAgo(item.publishedAt)}</span>
                        </div>
                        <h4 className="font-semibold text-sm mb-1 line-clamp-2 transition" style={{ color: 'var(--text-secondary)' }}>
                          {item.title}
                        </h4>
                        <p className="text-xs line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>{item.summary}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-center py-4" style={{ color: 'var(--text-tertiary)' }}>Carregando notícias...</p>
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
              <div className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h3 className="font-bold text-xl mb-4 font-[family-name:var(--font-poppins)] flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <span>🔗</span>
                  <span>Links Úteis</span>
                </h3>
                <div className="space-y-2">
                  <a
                    href="https://www.coingecko.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg p-3 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-medium)'
                    }}
                  >
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>📊 CoinGecko</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Dados de mercado</p>
                  </a>
                  <a
                    href="https://coinmarketcap.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg p-3 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-medium)'
                    }}
                  >
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>💹 CoinMarketCap</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Rankings e preços</p>
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
              <h2 className="font-bold text-3xl font-[family-name:var(--font-poppins)] text-center mb-2" style={{ color: "var(--text-primary)" }}>
                👑 Bitcoin - Análise Completa
              </h2>
              <p className="text-center mb-6" style={{ color: "var(--text-tertiary)" }}>
                Gráfico avançado com Médias Móveis, Bandas de Bollinger e RSI
              </p>

              <AdvancedChart symbol="BTCUSDT" name="₿ Bitcoin (BTC/USDT) - Gráfico Profissional" />
            </div>

            {/* Divider */}
            <div className="border-t-2 border-white/20"></div>

            {/* Gráficos TradingView */}
            <div className="space-y-6">
              <h2 className="font-bold text-3xl font-[family-name:var(--font-poppins)] text-center mb-2" style={{ color: "var(--text-primary)" }}>
                📈 Gráficos ao Vivo
              </h2>
              <p className="text-center mb-6" style={{ color: "var(--text-tertiary)" }}>Acompanhe BTC, ETH e SOL em tempo real</p>

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
              <h2 className="font-bold text-3xl font-[family-name:var(--font-poppins)] text-center mb-2" style={{ color: "var(--text-primary)" }}>
                🔬 Análise Técnica Avançada
              </h2>
              <p className="text-center mb-6" style={{ color: "var(--text-tertiary)" }}>Indicadores técnicos e recomendações de trading</p>

              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                {/* Análise Técnica BTC */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <span>₿</span>
                    <span>Bitcoin - Indicadores</span>
                  </h3>
                  <TechnicalAnalysisWidget symbol="BINANCE:BTCUSDT" />
                </div>

                {/* Análise Técnica ETH */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <span>Ξ</span>
                    <span>Ethereum - Indicadores</span>
                  </h3>
                  <TechnicalAnalysisWidget symbol="BINANCE:ETHUSDT" />
                </div>

                {/* Análise Técnica SOL */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
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
              <h2 className="font-bold text-3xl font-[family-name:var(--font-poppins)] text-center mb-2" style={{ color: "var(--text-primary)" }}>
                🗺️ Mapa de Mercado & Rastreador
              </h2>
              <p className="text-center mb-6" style={{ color: "var(--text-tertiary)" }}>Visualize o mercado completo e filtre oportunidades</p>

              <div className="space-y-8">
                {/* Mapa de Calor Cripto */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <span>🔥</span>
                    <span>Mapa de Calor Cripto</span>
                  </h3>
                  <CryptoHeatmapWidget />
                </div>

                {/* Rastreador de Mercado */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <span>📋</span>
                    <span>Rastreador de Mercado</span>
                  </h3>
                  <CustomCryptoScreener />
                </div>
              </div>
            </div>

            {/* Token $MILAGRE CTA */}
            <div className="bg-gradient-to-r from-yellow-400/20 to-amber-400/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-yellow-300/40 shadow-xl text-center">
              <h3 className="font-bold text-2xl mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                🌟 Acompanhe $MILAGRE
              </h3>
              <p className="mb-6 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
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
            <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              🔄 Dados atualizados automaticamente a cada 30 segundos
            </p>
          </div>
        )}
      </div>
  );
}
