'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowRight, faChevronLeft, faChevronRight, faCheckCircle, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

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

export default function HomePage() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
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
        // Ordenar por data (mais recentes primeiro) e pegar apenas as 4 últimas notícias
        const sortedNews = data.data
          .sort((a: NewsItem, b: NewsItem) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          )
          .slice(0, 4);
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
          <div className="space-y-10">
            {/* Ticker Tape - Fita de Preços */}
            <div
              className="rounded-2xl overflow-hidden shadow-md border"
              style={{
              borderColor: 'var(--border-light)',
              backgroundColor: 'var(--bg-elevated)'
            }}>
              <TickerTapeWidget />
            </div>

            {/* Visão Geral do Mercado */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Gráfico Bitcoin e Velocímetro - SEM CARD */}
            <div>
              {/* Índice Fear & Greed - Velocímetro */}
              {fearGreed && (
                <div className="mb-8">
                  <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
                    {/* Coluna 1: Gráfico Bitcoin */}
                    <div>
                      <LightweightChart symbol="BTCUSDT" name="Bitcoin (BTC/USDT)" />
                    </div>

                    {/* Coluna 2: Velocímetro + Informações do Sentimento */}
                    <div className="flex flex-col items-center gap-4">
                          {/* Título */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 animate-pulse"></div>
                            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Índice Fear & Greed - Sentimento do Mercado</p>
                          </div>

                          {/* Velocímetro SVG Redesenhado */}
                          <div className="relative flex items-center justify-center" style={{ width: '400px', height: '280px' }}>
                            <svg viewBox="-20 -30 320 250" className="w-full h-full" style={{ overflow: 'visible' }}>
                              <defs>
                                {/* Gradiente arco-íris para o arco */}
                                <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#DC2626" />
                                  <stop offset="20%" stopColor="#EA580C" />
                                  <stop offset="40%" stopColor="#F59E0B" />
                                  <stop offset="60%" stopColor="#84CC16" />
                                  <stop offset="80%" stopColor="#22C55E" />
                                  <stop offset="100%" stopColor="#10B981" />
                                </linearGradient>

                                {/* Sombra suave */}
                                <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
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

                                {/* Glow intenso */}
                                <filter id="intensiveGlow" x="-50%" y="-50%" width="200%" height="200%">
                                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                  <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                  </feMerge>
                                </filter>
                              </defs>

                              {/* Arco de fundo (trilha cinza) */}
                              <path
                                d="M 50 170 A 90 90 0 0 1 230 170"
                                fill="none"
                                stroke="var(--border-medium)"
                                strokeWidth="26"
                                strokeLinecap="butt"
                                opacity="0.2"
                              />

                              {/* Arco colorido principal com gradiente */}
                              <path
                                d="M 50 170 A 90 90 0 0 1 230 170"
                                fill="none"
                                stroke="url(#rainbowGradient)"
                                strokeWidth="26"
                                strokeLinecap="butt"
                                filter="url(#intensiveGlow)"
                              />

                              {/* Marcações principais (0, 25, 50, 75, 100) */}
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
                                    {/* Linha marcação */}
                                    <line
                                      x1={x1}
                                      y1={y1}
                                      x2={x2}
                                      y2={y2}
                                      stroke={mark.color}
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                    />
                                    {/* Texto da marcação */}
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

                              {/* Marcações secundárias (cada 10) */}
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

                              {/* Ponteiro do velocímetro */}
                              <g
                                style={{
                                  transform: `rotate(${(gaugeValue * 1.8) - 90}deg)`,
                                  transformOrigin: '140px 170px',
                                  transition: 'transform 0.05s linear'
                                }}
                              >
                                {/* Sombra do ponteiro */}
                                <path
                                  d="M 140 170 L 135 165 L 138 90 L 140 85 L 142 90 L 145 165 Z"
                                  fill="#000000"
                                  opacity="0.15"
                                  transform="translate(2, 3)"
                                />

                                {/* Ponteiro com gradiente dinâmico */}
                                <path
                                  d="M 140 170 L 135 165 L 138 90 L 140 85 L 142 90 L 145 165 Z"
                                  fill={
                                    gaugeValue <= 20 ? '#DC2626' :
                                    gaugeValue <= 40 ? '#F59E0B' :
                                    gaugeValue <= 60 ? '#84CC16' :
                                    gaugeValue <= 80 ? '#22C55E' : '#10B981'
                                  }
                                  filter="url(#softShadow)"
                                />
                              </g>

                              {/* Base do ponteiro - círculo externo */}
                              <circle
                                cx="140"
                                cy="170"
                                r="18"
                                fill="var(--bg-elevated)"
                                stroke="var(--border-medium)"
                                strokeWidth="2"
                              />

                              {/* Círculo central */}
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
                                filter="url(#intensiveGlow)"
                              />

                              {/* Valor numérico grande */}
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

                          {/* Informações do Sentimento - Abaixo do Contador */}
                          <div className="flex flex-col items-center gap-2 text-center">
                            <p className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>
                              {fearGreed.value_classification === 'Extreme Fear' && '😱 Medo Extremo'}
                              {fearGreed.value_classification === 'Fear' && '😰 Medo'}
                              {fearGreed.value_classification === 'Neutral' && '😐 Neutro'}
                              {fearGreed.value_classification === 'Greed' && '🤑 Ganância'}
                              {fearGreed.value_classification === 'Extreme Greed' && '🚀 Ganância Extrema'}
                            </p>
                            <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                              {parseInt(fearGreed.value) <= 25 && '💎 Oportunidade de acumular'}
                              {parseInt(fearGreed.value) > 25 && parseInt(fearGreed.value) <= 45 && '⚠️ Cautela recomendada'}
                              {parseInt(fearGreed.value) > 45 && parseInt(fearGreed.value) <= 55 && '⚖️ Mercado equilibrado'}
                              {parseInt(fearGreed.value) > 55 && parseInt(fearGreed.value) <= 75 && '📈 Otimismo crescente'}
                              {parseInt(fearGreed.value) > 75 && '⚡ Alta volatilidade esperada'}
                            </p>
                            {/* Barra de progresso */}
                            <div className="w-full max-w-xs h-2 rounded-full overflow-hidden mt-1" style={{ backgroundColor: 'var(--border-medium)' }}>
                              <div
                                className="h-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${gaugeValue}%`,
                                  background: `linear-gradient(90deg, ${
                                    gaugeValue <= 20 ? '#DC2626' :
                                    gaugeValue <= 40 ? '#F59E0B' :
                                    gaugeValue <= 60 ? '#84CC16' :
                                    gaugeValue <= 80 ? '#22C55E' : '#10B981'
                                  }, ${
                                    gaugeValue <= 20 ? '#EF4444' :
                                    gaugeValue <= 40 ? '#FCD34D' :
                                    gaugeValue <= 60 ? '#A3E635' :
                                    gaugeValue <= 80 ? '#4ADE80' : '#34D399'
                                  })`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                )}
            </div>

            {/* Últimas Notícias */}
            <div className="space-y-6">
                {/* Título Últimas Notícias */}
                <div>
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    Últimas Notícias
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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

            {/* Educação - Carousel */}
            <div className="space-y-6 mt-20">
                <div>
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    Aprenda sobre Cripto
                  </h3>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                  {education.length > 0 ? (
                    <>
                      {/* Slides */}
                      <div className="overflow-hidden rounded-2xl">
                        <div
                          className="flex transition-transform duration-500 ease-out"
                          style={{ transform: `translateX(-${currentSlide * 50}%)` }}
                        >
                          {education.map((item, idx) => (
                            <div key={idx} className="w-1/2 flex-shrink-0 px-2">
                              <Link
                                href={`/educacao/${item.slug}`}
                                className="block rounded-3xl p-8 border-2 shadow-lg relative overflow-hidden"
                                style={{
                                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                                  borderColor: 'var(--border-light)',
                                  minHeight: '350px'
                                }}
                              >
                                {/* Número do Slide - Decorativo */}
                                <div className="absolute -top-4 -right-4 text-9xl font-black opacity-5 select-none" style={{ color: '#F59E0B' }}>
                                  {idx + 1}
                                </div>

                                {/* Conteúdo */}
                                <div className="relative z-10 h-full flex flex-col">
                                  {/* Header - Ícone e Badges em linha */}
                                  <div className="flex items-center gap-3 mb-6">
                                    {/* Badge de Nível - Compacto */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm" style={{
                                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                                      color: 'white'
                                    }}>
                                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                      <span className="uppercase tracking-wide">{item.level}</span>
                                    </div>

                                    {/* Tempo de Leitura - Compacto */}
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold" style={{
                                      backgroundColor: 'var(--bg-secondary)',
                                      color: 'var(--text-secondary)'
                                    }}>
                                      <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" />
                                      {item.readTime}
                                    </div>

                                    {/* Contador - Compacto */}
                                    <div className="ml-auto text-xs font-bold px-2.5 py-1.5 rounded-lg" style={{
                                      backgroundColor: 'var(--bg-secondary)',
                                      color: 'var(--text-muted)'
                                    }}>
                                      {idx + 1} / {education.length}
                                    </div>
                                  </div>

                                  {/* Título - Grande e Destacado */}
                                  <h4 className="font-black text-3xl mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
                                    {item.title}
                                  </h4>

                                  {/* Resumo - Maior e mais legível */}
                                  <p className="text-base leading-relaxed mb-6 flex-grow" style={{ color: 'var(--text-secondary)' }}>
                                    {item.summary}
                                  </p>

                                  {/* CTA - Botão de Ação */}
                                  <div className="flex items-center pt-6 border-t-2" style={{
                                    borderColor: 'var(--border-light)'
                                  }}>
                                    <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#F59E0B' }}>
                                      <span>Começar a Aprender</span>
                                      <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      {education.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentSlide(prev => prev === 0 ? education.length - 1 : prev - 1)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 border-2 z-10"
                            style={{
                              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                              borderColor: '#F59E0B',
                              color: 'white'
                            }}
                            aria-label="Slide anterior"
                          >
                            <FontAwesomeIcon icon={faChevronLeft} className="w-6 h-6" />
                          </button>

                          <button
                            onClick={() => setCurrentSlide(prev => prev === education.length - 1 ? 0 : prev + 1)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 border-2 z-10"
                            style={{
                              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                              borderColor: '#F59E0B',
                              color: 'white'
                            }}
                            aria-label="Próximo slide"
                          >
                            <FontAwesomeIcon icon={faChevronRight} className="w-6 h-6" />
                          </button>
                        </>
                      )}

                      {/* Dots Indicators */}
                      {education.length > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                          {education.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentSlide(idx)}
                              className="transition-all duration-300 rounded-full"
                              style={{
                                width: currentSlide === idx ? '32px' : '8px',
                                height: '8px',
                                backgroundColor: currentSlide === idx ? '#F59E0B' : 'var(--border-medium)'
                              }}
                              aria-label={`Ir para slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
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
                <div className="grid md:grid-cols-3 gap-4">
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
                    <div className="col-span-3 text-center py-12">
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

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Análise de Mercado Cripto */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2" style={{ color: "var(--text-primary)" }}>
                  Análise de Mercado Cripto
                </h2>
                <p style={{ color: "var(--text-tertiary)" }}>
                  Acompanhe gráficos ao vivo, análise técnica e indicadores profissionais
                </p>
              </div>

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
                    <h4 className="font-semibold text-base mb-3" style={{ color: "var(--text-primary)" }}>
                      Bitcoin - Sentimento
                    </h4>
                    <TechnicalAnalysisWidget symbol="BINANCE:BTCUSDT" />
                  </div>

                  {/* Análise Técnica ETH */}
                  <div>
                    <h4 className="font-semibold text-base mb-3" style={{ color: "var(--text-primary)" }}>
                      Ethereum - Sentimento
                    </h4>
                    <TechnicalAnalysisWidget symbol="BINANCE:ETHUSDT" />
                  </div>

                  {/* Análise Técnica SOL */}
                  <div>
                    <h4 className="font-semibold text-base mb-3" style={{ color: "var(--text-primary)" }}>
                      Solana - Sentimento
                    </h4>
                    <TechnicalAnalysisWidget symbol="BINANCE:SOLUSDT" />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Mapa de Calor S&P 500 */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2" style={{ color: "var(--text-primary)" }}>
                Mapa de Calor - S&P 500
              </h2>
              <p className="mb-6" style={{ color: "var(--text-tertiary)" }}>
                Visualize o desempenho das principais ações dos EUA
              </p>

              <StockHeatmapWidget />
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Mapa de Calor & Rastreador */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2" style={{ color: "var(--text-primary)" }}>
                Mapa de Mercado de Criptomoedas
              </h2>
              <p className="mb-6" style={{ color: "var(--text-tertiary)" }}>Visualize o mercado completo e filtre oportunidades</p>

              <div className="space-y-8">
                {/* Mapa de Calor Cripto */}
                <div>
                  <CryptoHeatmapWidget />
                </div>

                {/* CryptoBubbles */}
                <div>
                  <h3 className="font-semibold text-lg mb-3" style={{ color: "var(--text-primary)" }}>
                    Crypto Bubbles - Visualização Interativa
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
                  <h3 className="font-semibold text-lg mb-3" style={{ color: "var(--text-primary)" }}>
                    Rastreador de Mercado
                  </h3>
                  <CustomCryptoScreener />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Token $MILAGRE CTA */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Acompanhe $MILAGRE
                </h3>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                  O token da educação financeira descentralizada. Monitore o mercado e aprenda a investir com sabedoria.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://discord.gg/skaX8bFY"
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

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Atualização */}
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Dados atualizados automaticamente a cada 30 segundos
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
          <FontAwesomeIcon icon={faArrowUp} className="w-6 h-6" />
        </button>
      )}
      </div>
    </>
  );
}
