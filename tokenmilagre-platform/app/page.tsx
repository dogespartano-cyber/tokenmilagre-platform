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

const StockHeatmapWidget = dynamic(() => import('@/components/StockHeatmapWidget'), {
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

export default function HomePage() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      const response = await fetch('/api/articles');
      const data = await response.json();
      if (data.success && data.data) {
        // Ordenar por data (mais recentes primeiro) e pegar apenas as 4 últimas
        const sortedNews = data.data
          .sort((a: NewsItem, b: NewsItem) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          )
          .slice(0, 4);
        setNews(sortedNews);
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      setNews([]); // Garantir que news seja um array vazio em caso de erro
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
              <div className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" style={{
                background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                borderColor: 'var(--border-medium)'
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

            {/* Últimas Notícias com Fear & Greed */}
            <div>
              <div className="backdrop-blur-xl rounded-3xl p-8 border-2 shadow-2xl hover:shadow-3xl transition-all duration-500 group overflow-hidden relative" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                {/* Background gradient animado */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-2xl font-[family-name:var(--font-poppins)] flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <span className="text-3xl">📰</span>
                      <span>Últimas Notícias</span>
                    </h3>
                    <div className="px-3 py-1 rounded-full text-xs font-bold" style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white'
                    }}>
                      HOJE
                    </div>
                  </div>

                  {/* Índice Fear & Greed */}
                  {fearGreed && (
                    <div className="mb-6 p-5 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02]" style={{
                      background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                      borderColor: 'var(--border-light)'
                    }}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 animate-pulse"></div>
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Índice Fear & Greed - Sentimento do Mercado</p>
                      </div>

                      <div className="flex flex-col lg:flex-row items-center gap-5">
                        {/* Fear & Greed Info */}
                        <div className="flex items-center gap-5 flex-1">
                          <div className="relative">
                            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getFearGreedColor(parseInt(fearGreed.value))} flex items-center justify-center shadow-2xl transform group-hover:rotate-3 transition-transform duration-500`}>
                              <div className="bg-white/20 backdrop-blur-md w-20 h-20 rounded-xl flex flex-col items-center justify-center border border-white/30">
                                <span className="text-3xl mb-1">{getFearGreedEmoji(fearGreed.value_classification)}</span>
                                <span className="font-black text-lg" style={{ color: 'var(--text-inverse)' }}>{fearGreed.value}</span>
                              </div>
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 animate-ping"></div>
                          </div>

                          <div className="flex-1">
                            <p className="font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
                              {fearGreed.value_classification === 'Extreme Fear' && '😱 Medo Extremo'}
                              {fearGreed.value_classification === 'Fear' && '😰 Medo'}
                              {fearGreed.value_classification === 'Neutral' && '😐 Neutro'}
                              {fearGreed.value_classification === 'Greed' && '🤑 Ganância'}
                              {fearGreed.value_classification === 'Extreme Greed' && '🚀 Ganância Extrema'}
                            </p>
                            <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                              {parseInt(fearGreed.value) <= 25 && '💎 Oportunidade de acumular'}
                              {parseInt(fearGreed.value) > 25 && parseInt(fearGreed.value) <= 45 && '⚠️ Cautela recomendada'}
                              {parseInt(fearGreed.value) > 45 && parseInt(fearGreed.value) <= 55 && '⚖️ Mercado equilibrado'}
                              {parseInt(fearGreed.value) > 55 && parseInt(fearGreed.value) <= 75 && '📈 Otimismo crescente'}
                              {parseInt(fearGreed.value) > 75 && '🔥 Alta volatilidade esperada'}
                            </p>
                          </div>
                        </div>

                        {/* Community Buttons - Lateral */}
                        <div className="flex flex-col gap-3 lg:border-l lg:pl-5" style={{ borderColor: 'var(--border-light)' }}>
                          <p className="text-xs font-bold uppercase tracking-wider text-center lg:text-left" style={{ color: 'var(--text-tertiary)' }}>
                            💬 Comunidade
                          </p>
                          <div className="flex flex-row gap-2">
                            <a
                              href="https://discord.gg/skaX8bFY"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
                              style={{
                                background: 'linear-gradient(135deg, #5865F2, #4752C4)',
                                color: 'white'
                              }}
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                              </svg>
                              <span>Discord</span>
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>

                            <a
                              href="https://t.me/+Bop_TVFc_mg3Njlh"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
                              style={{
                                background: 'linear-gradient(135deg, #0088cc, #006699)',
                                color: 'white'
                              }}
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21l-1.446 1.394c-.14.18-.357.295-.6.295c-.002 0-.003 0-.005 0l.213-3.054l5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                              </svg>
                              <span>Telegram</span>
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Divisor */}
                  <div className="border-t-2 mb-6" style={{ borderColor: 'var(--border-light)' }}></div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {news.length > 0 ? (
                      news.map((item, idx) => (
                        <Link
                          key={idx}
                          href={`/dashboard/noticias/${item.slug || item.id}`}
                          className="block rounded-2xl p-4 border-2 transition-all duration-300 group/item hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                            borderColor: 'var(--border-light)'
                          }}
                        >
                          {/* Hover gradient */}
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>

                          <div className="relative z-10">
                            {/* Header da notícia */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg flex-shrink-0">{getSentimentIcon(item.sentiment)}</span>
                              <span className="px-2 py-1 rounded-lg text-xs font-bold uppercase" style={{
                                backgroundColor: 'var(--bg-primary)',
                                color: 'var(--brand-primary)'
                              }}>
                                {item.category[0]}
                              </span>
                              <span className="text-xs ml-auto font-medium" style={{ color: 'var(--text-muted)' }}>{getTimeAgo(item.publishedAt)}</span>
                            </div>

                            {/* Título */}
                            <h4 className="font-bold text-base mb-2 line-clamp-2 group-hover/item:text-yellow-400 transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>
                              {item.title}
                            </h4>

                            {/* Resumo */}
                            <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-tertiary)' }}>
                              {item.summary}
                            </p>

                            {/* Footer - Ler mais */}
                            <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--brand-primary)' }}>
                              <span>Ler artigo completo</span>
                              <span className="group-hover/item:translate-x-1 transition-transform duration-300">→</span>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-5xl mb-3 animate-pulse">📰</div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Carregando notícias...</p>
                      </div>
                    )}
                  </div>

                  {/* Ver todas */}
                  <Link
                    href="/dashboard/noticias"
                    className="mt-6 block text-center py-3 px-6 rounded-xl font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                      color: 'var(--text-inverse)'
                    }}
                  >
                    Ver todas as notícias →
                  </Link>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-white/20"></div>

            {/* Análise de Mercado Cripto */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="font-bold text-3xl font-[family-name:var(--font-poppins)] mb-2" style={{ color: "var(--text-primary)" }}>
                  📊 Análise de Mercado Cripto
                </h2>
                <p style={{ color: "var(--text-tertiary)" }}>
                  Acompanhe gráficos ao vivo, análise técnica e indicadores profissionais
                </p>
              </div>

              {/* Bitcoin - Análise Completa */}
              <div className="space-y-4">
                <h3 className="font-semibold text-xl flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <span>👑</span>
                  <span>Bitcoin</span>
                </h3>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  Gráfico com Médias Móveis, Bandas de Bollinger e RSI
                </p>
                <AdvancedChart symbol="BTCUSDT" name="₿ Bitcoin (BTC/USDT) - Gráfico Profissional" />
              </div>

              {/* Gráficos ao Vivo */}
              <div className="space-y-4">
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

              {/* Análise Técnica Avançada */}
              <div className="space-y-4">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                  {/* Análise Técnica BTC */}
                  <div>
                    <h4 className="font-semibold text-base mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                      <span>₿</span>
                      <span>Bitcoin - Sentimento</span>
                    </h4>
                    <TechnicalAnalysisWidget symbol="BINANCE:BTCUSDT" />
                  </div>

                  {/* Análise Técnica ETH */}
                  <div>
                    <h4 className="font-semibold text-base mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                      <span>Ξ</span>
                      <span>Ethereum - Sentimento</span>
                    </h4>
                    <TechnicalAnalysisWidget symbol="BINANCE:ETHUSDT" />
                  </div>

                  {/* Análise Técnica SOL */}
                  <div>
                    <h4 className="font-semibold text-base mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                      <span>◎</span>
                      <span>Solana - Sentimento</span>
                    </h4>
                    <TechnicalAnalysisWidget symbol="BINANCE:SOLUSDT" />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-white/20"></div>

            {/* Mapa de Calor S&P 500 */}
            <div className="space-y-6">
              <h2 className="font-bold text-3xl font-[family-name:var(--font-poppins)] text-center mb-2" style={{ color: "var(--text-primary)" }}>
                📊 Mapa de Calor - S&P 500
              </h2>
              <p className="text-center mb-6" style={{ color: "var(--text-tertiary)" }}>
                Visualize o desempenho das principais ações dos EUA
              </p>

              <StockHeatmapWidget />
            </div>

            {/* Divider */}
            <div className="border-t-2 border-white/20"></div>

            {/* Mapa de Calor & Rastreador */}
            <div className="space-y-6">
              <h2 className="font-bold text-3xl font-[family-name:var(--font-poppins)] text-center mb-2" style={{ color: "var(--text-primary)" }}>
                🗺️ Mapa de Mercado de Criptomoedas
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

                {/* CryptoBubbles */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <span>🫧</span>
                    <span>Crypto Bubbles - Visualização Interativa</span>
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
                <a
                  href="https://discord.gg/skaX8bFY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-theme-xl hover:shadow-2xl hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #5865F2, #4752C4)',
                    color: 'white'
                  }}
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Discord</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>

                <a
                  href="https://t.me/+Bop_TVFc_mg3Njlh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-theme-xl hover:shadow-2xl hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #0088cc, #006699)',
                    color: 'white'
                  }}
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21l-1.446 1.394c-.14.18-.357.295-.6.295c-.002 0-.003 0-.005 0l.213-3.054l5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                  <span>Telegram</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>

            {/* Atualização */}
            <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              🔄 Dados atualizados automaticamente a cada 30 segundos
            </p>
          </div>
        )}

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
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      </div>
  );
}
