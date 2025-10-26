'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowRight, faCheckCircle, faArrowUp, faSeedling, faGraduationCap, faRocket, faBook } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

const LightweightChart = dynamic(() => import('@/components/LightweightChart'), {
  ssr: false,
});

const TickerTapeWidget = dynamic(() => import('@/components/TickerTapeWidget'), {
  ssr: false,
});

const CustomCryptoScreener = dynamic(() => import('@/components/CustomCryptoScreener'), {
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

interface EducationItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  level: string;
  readTime: string;
}

interface ResourceItem {
  name: string;
  category: string;
  description: string;
  gradient: string;
  stats: string;
  verified: boolean;
  url: string;
}

// Helper functions for education card styling
const getLevelGradient = (level: string | null) => {
  switch(level) {
    case 'iniciante': return 'rgba(34, 197, 94, 0.08)';     // Verde 8%
    case 'intermediario': return 'rgba(234, 179, 8, 0.08)'; // Amarelo 8%
    case 'avancado': return 'rgba(239, 68, 68, 0.08)';      // Vermelho 8%
    default: return 'rgba(100, 116, 139, 0.05)';            // Cinza neutro
  }
};

const getLevelColor = (level: string | null) => {
  switch(level) {
    case 'iniciante': return '#22c55e';
    case 'intermediario': return '#eab308';
    case 'avancado': return '#ef4444';
    default: return '#64748b';
  }
};

const getLevelIcon = (level: string | null) => {
  switch(level) {
    case 'iniciante': return faSeedling;
    case 'intermediario': return faGraduationCap;
    case 'avancado': return faRocket;
    default: return faBook;
  }
};

export default function HomePage() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [gaugeValue, setGaugeValue] = useState(0); // Valor animado do ponteiro

  useEffect(() => {
    fetchMarketData();
    fetchFearGreed();
    fetchNews();
    fetchEducation();
    fetchResources();

    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      fetchMarketData();
      fetchFearGreed();
      fetchNews();
      fetchEducation();
      fetchResources();
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

  // Animação do ponteiro do velocímetro
  useEffect(() => {
    if (fearGreed) {
      const targetValue = parseInt(fearGreed.value);
      const duration = 2500; // 2.5 segundos
      const steps = 60;
      const stepValue = targetValue / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      setGaugeValue(0); // Começa do zero

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          // Easing function para movimento mais realista
          const progress = currentStep / steps;
          const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          setGaugeValue(Math.round(targetValue * easedProgress));
        } else {
          setGaugeValue(targetValue);
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [fearGreed]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/market');
      const result = await response.json();

      if (result.success && result.data) {
        setMarketData(result.data);
      } else {
        console.error('Erro ao buscar dados do mercado:', result.error);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados do mercado:', error);
      setLoading(false);
    }
  };

  const fetchFearGreed = async () => {
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
  };

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/articles?type=news');
      const data = await response.json();
      if (data.success && data.data) {
        // Ordenar por data (mais recentes primeiro) e pegar apenas as 6 últimas notícias
        const sortedNews = data.data
          .sort((a: NewsItem, b: NewsItem) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          )
          .slice(0, 6);
        setNews(sortedNews);
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      setNews([]);
    }
  };

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/articles?type=educational');
      const data = await response.json();
      if (data.success && data.data) {
        // Pegar apenas os 4 primeiros artigos educacionais
        const educationalArticles = data.data.slice(0, 4);
        setEducation(educationalArticles);
      }
    } catch (error) {
      console.error('Erro ao buscar artigos educacionais:', error);
      setEducation([]);
    }
  };

  const fetchResources = async () => {
    try {
      // Recursos em destaque com visual atraente
      const featuredResources: ResourceItem[] = [
        {
          name: 'MetaMask',
          category: 'Wallet',
          description: 'A carteira mais popular do mundo cripto',
          gradient: 'linear-gradient(135deg, #F6851B 0%, #E2761B 100%)',
          stats: '10M+ usuários',
          verified: true,
          url: '/recursos/metamask'
        },
        {
          name: 'Binance',
          category: 'Exchange',
          description: 'Maior plataforma de trading do mercado',
          gradient: 'linear-gradient(135deg, #F3BA2F 0%, #EAA42D 100%)',
          stats: '120M+ usuários',
          verified: true,
          url: '/recursos/binance'
        },
        {
          name: 'Uniswap',
          category: 'DeFi',
          description: 'Exchange descentralizada líder em volume',
          gradient: 'linear-gradient(135deg, #FF007A 0%, #E6006E 100%)',
          stats: '$1T+ negociado',
          verified: true,
          url: '/recursos/uniswap'
        },
        {
          name: 'Phantom',
          category: 'Wallet',
          description: 'Carteira principal do ecossistema Solana',
          gradient: 'linear-gradient(135deg, #AB9FF2 0%, #9388E5 100%)',
          stats: '7M+ usuários',
          verified: true,
          url: '/recursos/phantom'
        }
      ];
      setResources(featuredResources);
    } catch (error) {
      console.error('Erro ao buscar recursos:', error);
      setResources([]);
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
    <>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-pulse">📊</div>
            <p className="text-xl" style={{ color: 'var(--text-primary)' }}>Carregando dados do mercado...</p>
          </div>
        ) : (
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
                          <linearGradient id="rainbowGradientHome" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#DC2626" />
                            <stop offset="20%" stopColor="#EA580C" />
                            <stop offset="40%" stopColor="#F59E0B" />
                            <stop offset="60%" stopColor="#84CC16" />
                            <stop offset="80%" stopColor="#22C55E" />
                            <stop offset="100%" stopColor="#10B981" />
                          </linearGradient>

                          {/* Filtros */}
                          <filter id="softShadowHome" x="-50%" y="-50%" width="200%" height="200%">
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

                          <filter id="intensiveGlowHome" x="-50%" y="-50%" width="200%" height="200%">
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
                          stroke="url(#rainbowGradientHome)"
                          strokeWidth="26"
                          strokeLinecap="butt"
                          filter="url(#intensiveGlowHome)"
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
                            filter="url(#softShadowHome)"
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
                          filter="url(#intensiveGlowHome)"
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
                    Token Milagre
                  </h1>
                  <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                    Educação financeira descentralizada para todos
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

            {/* Ticker Tape - Fita de Preços */}
            <div
              className="rounded-2xl overflow-hidden shadow-md border"
              style={{
              borderColor: 'var(--border-light)',
              backgroundColor: 'var(--bg-elevated)'
            }}>
              <TickerTapeWidget />
            </div>

            {/* Visão Geral do Mercado + Velocímetro Integrado */}
            <div className="space-y-6">
              {/* Mobile/Tablet: Cards em Grid 2x2 */}
              <div className="lg:hidden grid grid-cols-2 gap-4">
                {/* Capitalização Total */}
                <div
                  className="backdrop-blur-lg rounded-2xl p-4 border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                  style={{
                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                  borderColor: 'var(--border-light)'
                }}>
                  <div className="mb-2">
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Capitalização Total</p>
                  </div>
                  <p className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                    {marketData && formatNumber(marketData.totalMarketCap)}
                  </p>
                  <p className="text-xs font-semibold" style={{
                    color: marketData && marketData.marketCapChange24h >= 0 ? 'var(--success)' : 'var(--error)'
                  }}>
                    {marketData && marketData.marketCapChange24h >= 0 ? '▲' : '▼'}
                    {marketData && Math.abs(marketData.marketCapChange24h).toFixed(2)}%
                  </p>
                </div>

                {/* Volume 24h */}
                <div
                  className="backdrop-blur-lg rounded-2xl p-4 border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                  style={{
                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                  borderColor: 'var(--border-light)'
                }}>
                  <div className="mb-2">
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Volume 24h</p>
                  </div>
                  <p className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                    {marketData && formatNumber(marketData.totalVolume)}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Global</p>
                </div>

                {/* Dominância BTC */}
                <div
                  className="backdrop-blur-lg rounded-2xl p-4 border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                  style={{
                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                  borderColor: 'var(--border-light)'
                }}>
                  <div className="mb-2">
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>BTC</p>
                  </div>
                  <p className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                    {marketData && marketData.btcDominance.toFixed(2)}%
                  </p>
                  <div className="w-full rounded-full h-1.5 mt-1" style={{ backgroundColor: 'var(--border-medium)' }}>
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
                <div
                  className="backdrop-blur-lg rounded-2xl p-4 border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                  style={{
                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                  borderColor: 'var(--border-light)'
                }}>
                  <div className="mb-2">
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>ETH</p>
                  </div>
                  <p className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                    {marketData && marketData.ethDominance.toFixed(2)}%
                  </p>
                  <div className="w-full rounded-full h-1.5 mt-1" style={{ backgroundColor: 'var(--border-medium)' }}>
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

              {/* Desktop: Cards em 1 Linha Horizontal */}
              <div className="hidden lg:grid lg:grid-cols-4 gap-6">
                {/* Capitalização Total */}
                <div
                  className="backdrop-blur-lg rounded-2xl p-6 border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                  style={{
                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                  borderColor: 'var(--border-light)'
                }}>
                  <div className="mb-2">
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Capitalização Total</p>
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
                <div
                  className="backdrop-blur-lg rounded-2xl p-6 border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                  style={{
                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                  borderColor: 'var(--border-light)'
                }}>
                  <div className="mb-2">
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Volume 24h</p>
                  </div>
                  <p className="font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
                    {marketData && formatNumber(marketData.totalVolume)}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Negociação global</p>
                </div>

                {/* Dominância BTC */}
                <div
                  className="backdrop-blur-lg rounded-2xl p-6 border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                  style={{
                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                  borderColor: 'var(--border-light)'
                }}>
                  <div className="mb-2">
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Dominância BTC</p>
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
                <div
                  className="backdrop-blur-lg rounded-2xl p-6 border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                  style={{
                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                  borderColor: 'var(--border-light)'
                }}>
                  <div className="mb-2">
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Dominância ETH</p>
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
            </div>

            {/* Últimas Notícias */}
            <div className="space-y-6">
                {/* Título Últimas Notícias */}
                <div>
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    Últimas Notícias
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {news.length > 0 ? (
                      news.map((item, idx) => (
                        <Link
                          key={idx}
                          href={`/dashboard/noticias/${item.slug || item.id}`}
                          className="block rounded-2xl p-4 border shadow-md transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1"
                          style={{
                            background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                            borderColor: 'var(--border-light)'
                          }}
                        >
                          <div>
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
                            <h4 className="font-bold text-base mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
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
                  className="inline-block py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                    color: 'var(--text-inverse)'
                  }}
                >
                  Ver todas as notícias →
                </Link>
            </div>

            {/* Educação - 4 Cards */}
            <div className="space-y-6 mt-20">
                <div>
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    Aprenda sobre Cripto
                  </h3>
                </div>

                {/* Grid de 4 Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {education.length > 0 ? (
                    education.slice(0, 4).map((resource) => (
                      <Link
                        key={resource.id}
                        href={`/educacao/${resource.slug}`}
                        className="group relative rounded-2xl p-6 overflow-hidden border shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer block"
                        style={{
                          background: `linear-gradient(135deg, ${getLevelGradient(resource.level)}, var(--bg-elevated))`,
                          borderColor: 'var(--border-light)'
                        }}
                      >
                        {/* Glow sutil no topo no hover */}
                        <div
                          className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${getLevelColor(resource.level)}, transparent)`,
                            boxShadow: `0 0 20px ${getLevelColor(resource.level)}40`
                          }}
                        />

                        {/* Content wrapper */}
                        <div className="relative flex flex-col h-full">
                          {/* Header do Card */}
                          <div className="flex items-start justify-between mb-4">
                            {/* Badge de Nível com ícone */}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-sm" style={{
                              backgroundColor: `${getLevelColor(resource.level)}15`,
                              border: `1px solid ${getLevelColor(resource.level)}30`
                            }}>
                              <FontAwesomeIcon
                                icon={getLevelIcon(resource.level)}
                                className="w-3.5 h-3.5"
                                style={{ color: getLevelColor(resource.level) }}
                              />
                              <span className="text-xs font-bold uppercase tracking-wide" style={{
                                color: getLevelColor(resource.level)
                              }}>
                                {resource.level === 'iniciante' ? 'Iniciante' : resource.level === 'intermediario' ? 'Intermediário' : resource.level === 'avancado' ? 'Avançado' : 'Geral'}
                              </span>
                            </div>

                            {/* Tempo de leitura */}
                            <span className="text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-sm flex items-center gap-1.5" style={{
                              backgroundColor: 'var(--bg-secondary)',
                              color: 'var(--text-tertiary)'
                            }}>
                              <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                              {resource.readTime || '5 min'}
                            </span>
                          </div>

                          {/* Título */}
                          <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors min-h-[3.5rem]" style={{ color: 'var(--text-primary)' }}>
                            {resource.title}
                          </h3>

                          {/* Descrição */}
                          <p className="text-sm mb-4 line-clamp-3 leading-relaxed opacity-90 min-h-[4.5rem]" style={{ color: 'var(--text-secondary)' }}>
                            {resource.summary}
                          </p>

                          {/* Spacer to push footer to bottom */}
                          <div className="flex-grow"></div>

                          {/* Footer */}
                          <div className="pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                            <div className="flex items-center justify-end">
                              {/* CTA com seta animada */}
                              <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all" style={{ color: 'var(--text-primary)' }}>
                                Ler artigo
                                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-5xl mb-3 animate-pulse">📚</div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Carregando artigos educacionais...</p>
                    </div>
                  )}
                </div>

                {/* Ver todos */}
                <Link
                  href="/educacao"
                  className="inline-flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                    color: 'var(--text-inverse)'
                  }}
                >
                  <span>Ver todos os artigos</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                </Link>
            </div>

            {/* Recursos */}
            <div className="space-y-6 mt-20">
                {/* Header */}
                <div>
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)] mb-3" style={{ color: 'var(--text-primary)' }}>
                    Ferramentas Essenciais
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Plataformas confiáveis utilizadas por milhões de usuários globalmente
                  </p>
                </div>

                {/* Grid de Recursos em Destaque */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {resources.length > 0 ? (
                    resources.map((resource, idx) => (
                      <Link
                        key={idx}
                        href={resource.url}
                        className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                        style={{
                          background: resource.gradient,
                          minHeight: '180px'
                        }}
                      >
                        {/* Overlay escuro sutil */}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>

                        {/* Conteúdo */}
                        <div className="relative z-10 h-full flex flex-col justify-between text-white">
                          <div>
                            {/* Badge categoria */}
                            <div className="inline-block px-2 py-1 rounded-md text-xs font-bold mb-3 bg-white/20 backdrop-blur-sm">
                              {resource.category}
                            </div>

                            {/* Nome */}
                            <h4 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform origin-left">
                              {resource.name}
                            </h4>

                            {/* Descrição */}
                            <p className="text-sm opacity-90 mb-3">
                              {resource.description}
                            </p>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {resource.verified && (
                                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                              )}
                              <span className="text-xs font-semibold opacity-90">{resource.stats}</span>
                            </div>

                            {/* Ícone seta */}
                            <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="inline-block animate-pulse px-6 py-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Carregando recursos...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Final */}
                <div>
                  <Link
                    href="/recursos"
                    className="inline-flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                      color: 'var(--text-inverse)'
                    }}
                  >
                    Ver todos
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                  </Link>
                </div>
            </div>

            {/* Gráfico Bitcoin */}
            <div className="space-y-6 mt-20">
              <div>
                <h3 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2" style={{ color: "var(--text-primary)" }}>
                  Bitcoin - Gráfico ao Vivo
                </h3>
                <p style={{ color: "var(--text-tertiary)" }}>
                  Acompanhe a cotação do Bitcoin em tempo real
                </p>
              </div>
              <LightweightChart symbol="BTCUSDT" name="Bitcoin (BTC/USDT)" />
            </div>

            {/* Rastreador de Mercado */}
            <div className="space-y-6 mt-20">
              <div>
                <h3 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2" style={{ color: "var(--text-primary)" }}>
                  Rastreador de Mercado
                </h3>
                <p style={{ color: "var(--text-tertiary)" }}>
                  Visualize e filtre as principais criptomoedas do mercado
                </p>
              </div>
              <CustomCryptoScreener />
            </div>
          </div>
        )}
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
