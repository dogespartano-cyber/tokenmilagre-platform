'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowRight, faCheckCircle, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { TokenBTC, TokenETH } from '@token-icons/react';
import { getLevelGradient, getLevelColor, getLevelIcon } from '@/lib/utils/level-helpers';

const LightweightChart = dynamic(() => import('@/components/LightweightChart'), {
  ssr: false,
});

interface MarketData {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  ethDominance: number;
  marketCapChange24h: number;
}

interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords?: string[];
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
  const [news, setNews] = useState<NewsItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [dailyAnalysis, setDailyAnalysis] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingResources, setLoadingResources] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchMarketData();
    fetchNews();
    fetchEducation();
    fetchResources();
    fetchDailyAnalysis();

    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      fetchMarketData();
      fetchNews();
      fetchEducation();
      fetchResources();
      fetchDailyAnalysis();
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
    const CACHE_KEY = 'home_market_data';

    // Carregar do cache imediatamente (elimina flash visual)
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        setMarketData(cachedData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar cache de market data:', error);
      }
    }

    // Buscar dados atualizados em background
    try {
      const response = await fetch('/api/market');
      const result = await response.json();

      if (result.success && result.data) {
        setMarketData(result.data);
        // Salvar no cache
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
      } else {
        console.error('Erro ao buscar dados do mercado:', result.error);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados do mercado:', error);
      // Manter loading false se temos cache
      if (cached) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const fetchNews = async () => {
    const CACHE_KEY = 'home_news_list';

    // Carregar do cache imediatamente (elimina flash visual)
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        setNews(cachedData);
      } catch (error) {
        console.error('Erro ao carregar cache de notícias:', error);
      }
    }

    // Buscar dados atualizados em background
    try {
      const response = await fetch('/api/articles?type=news');
      const data = await response.json();
      if (data.success && data.data) {
        // Ordenar por data (mais recentes primeiro) e pegar apenas as 6 últimas notícias
        const sortedNews = data.data
          .sort((a: NewsItem, b: NewsItem) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          )
          .slice(0, 4);
        setNews(sortedNews);
        // Salvar no cache
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(sortedNews));
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      // Manter dados em cache se houver erro
      if (!cached) {
        setNews([]);
      }
    }
  };

  const fetchEducation = async () => {
    const CACHE_KEY = 'home_education_list';

    // Carregar do cache imediatamente (elimina flash visual)
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        setEducation(cachedData);
      } catch (error) {
        console.error('Erro ao carregar cache de educação:', error);
      }
    }

    // Buscar dados atualizados em background
    try {
      const response = await fetch('/api/articles?type=educational');
      const data = await response.json();
      if (data.success && data.data) {
        // Pegar apenas os 4 primeiros artigos educacionais
        const educationalArticles = data.data.slice(0, 4);
        setEducation(educationalArticles);
        // Salvar no cache
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(educationalArticles));
      }
    } catch (error) {
      console.error('Erro ao buscar artigos educacionais:', error);
      // Manter dados em cache se houver erro
      if (!cached) {
        setEducation([]);
      }
    }
  };

  const fetchResources = async () => {
    try {
      setLoadingResources(true);
      // Buscar recursos reais da API ao invés de hardcoded
      const response = await fetch('/api/resources?verified=true');
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        // Pegar os 4 primeiros recursos verificados
        const topResources = data.data.slice(0, 4).map((r: any) => ({
          name: r.name,
          category: r.category.charAt(0).toUpperCase() + r.category.slice(1),
          description: r.shortDescription,
          gradient: getResourceGradient(r.category),
          stats: getResourceStats(r.category),
          verified: r.verified,
          url: `/recursos/${r.slug}`
        }));
        setResources(topResources);
      } else {
        // Fallback para recursos padrão se API falhar
        setResources([]);
      }
    } catch (error) {
      console.error('Erro ao buscar recursos:', error);
      setResources([]);
    } finally {
      setLoadingResources(false);
    }
  };

  // Helper: Gradiente baseado na categoria
  const getResourceGradient = (category: string) => {
    const gradients: { [key: string]: string } = {
      wallet: 'linear-gradient(135deg, #F6851B 0%, #E2761B 100%)',
      exchange: 'linear-gradient(135deg, #F3BA2F 0%, #EAA42D 100%)',
      'defi-protocol': 'linear-gradient(135deg, #FF007A 0%, #E6006E 100%)',
      browsers: 'linear-gradient(135deg, #AB9FF2 0%, #9388E5 100%)',
      analytics: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      explorers: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    };
    return gradients[category] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  // Helper: Stats baseado na categoria
  const getResourceStats = (category: string) => {
    const stats: { [key: string]: string } = {
      wallet: 'Verificado',
      exchange: 'Popular',
      'defi-protocol': 'DeFi',
      browsers: 'Web3',
      analytics: 'Analytics',
      explorers: 'Explorer',
    };
    return stats[category] || 'Verificado';
  };

  const fetchDailyAnalysis = async () => {
    const CACHE_KEY = 'home_daily_analysis';

    // Carregar do cache imediatamente
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        // Verificar se o cache é de hoje
        const cacheDate = new Date(cachedData.publishedAt).toDateString();
        const today = new Date().toDateString();
        if (cacheDate === today) {
          setDailyAnalysis(cachedData);
        }
      } catch (error) {
        console.error('Erro ao carregar cache da análise diária:', error);
      }
    }

    // Buscar análise do dia com tag 'analise-diaria'
    try {
      const response = await fetch('/api/articles?type=news&limit=20');
      const data = await response.json();

      if (data.success && data.data) {
        // Encontrar artigo com tag 'analise-diaria' publicado hoje
        const today = new Date().toDateString();

        const analysis = data.data.find((article: NewsItem) => {
          const articleDate = new Date(article.publishedAt).toDateString();

          // keywords contém as tags (parse do campo tags do banco)
          const articleTags = article.keywords || [];

          // Verificar se tem tag 'analise-diaria' e foi publicado hoje
          const hasTag = articleTags.some((tag: string) =>
            tag.toLowerCase() === 'analise-diaria'
          );

          return hasTag && articleDate === today;
        });

        if (analysis) {
          setDailyAnalysis(analysis);
          // Salvar no cache
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(analysis));
        } else {
          setDailyAnalysis(null);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar análise diária:', error);
      // Manter cache se houver erro
      if (!cached) {
        setDailyAnalysis(null);
      }
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
      case 'positive': return faArrowUp;
      case 'negative': return faArrowRight; // Using arrow right for neutral/negative distinction if needed, but let's stick to the requested logic
      default: return faCheckCircle;
    }
  };

  // Helper: Cor do sentimento
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#10B981'; // Emerald 500
      case 'negative': return '#EF4444'; // Red 500
      default: return '#F59E0B'; // Amber 500
    }
  };

  // Helper: Gradiente do sentimento
  const getSentimentGradient = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'rgba(16, 185, 129, 0.08)'; // Emerald 500 with 8% opacity
      case 'negative': return 'rgba(239, 68, 68, 0.08)'; // Red 500 with 8% opacity
      default: return 'rgba(245, 158, 11, 0.08)'; // Amber 500 with 8% opacity
    }
  };

  // Helper: Texto do sentimento
  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Positivo';
      case 'negative': return 'Negativo';
      default: return 'Neutro';
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

            {/* Análise do Dia - Simple Card */}
            {dailyAnalysis && (
              <div className="rounded-2xl p-6 border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                style={{
                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                  borderColor: 'var(--border-light)'
                }}>

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                      📊 Análise do Dia
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      Todos os dias as 21h
                    </p>
                  </div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(dailyAnalysis.publishedAt).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                </div>

                {/* Título da Análise */}
                <Link href={`/dashboard/noticias/${dailyAnalysis.slug || dailyAnalysis.id}`}>
                  <h4 className="text-xl font-bold mb-3 line-clamp-2 hover:text-brand-primary transition-colors cursor-pointer"
                    style={{ color: 'var(--text-primary)' }}>
                    {dailyAnalysis.title}
                  </h4>
                </Link>

                {/* Resumo */}
                <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {dailyAnalysis.summary}
                </p>

                {/* Destaques do Mercado */}
                {marketData && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {/* BTC */}
                    <div className="p-3 rounded-lg"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-light)'
                      }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <TokenBTC size={16} variant="branded" />
                        <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>
                          BTC
                        </span>
                      </div>
                      <p className="text-sm font-bold" style={{
                        color: marketData.marketCapChange24h >= 0 ? 'var(--success)' : 'var(--error)'
                      }}>
                        {marketData.marketCapChange24h >= 0 ? '+' : ''}{marketData.marketCapChange24h.toFixed(2)}%
                      </p>
                    </div>

                    {/* ETH */}
                    <div className="p-3 rounded-lg"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-light)'
                      }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <TokenETH size={16} variant="branded" />
                        <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>
                          ETH
                        </span>
                      </div>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {marketData.ethDominance.toFixed(2)}%
                      </p>
                    </div>

                    {/* Sentimento */}
                    <div className="p-3 rounded-lg"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-light)'
                      }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm"><FontAwesomeIcon icon={getSentimentIcon(dailyAnalysis.sentiment)} /></span>
                        <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>
                          Mercado
                        </span>
                      </div>
                      <p className="text-sm font-bold capitalize" style={{ color: 'var(--text-primary)' }}>
                        {dailyAnalysis.sentiment === 'positive' ? 'Positivo' :
                          dailyAnalysis.sentiment === 'negative' ? 'Negativo' : 'Neutro'}
                      </p>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Link
                  href={`/dashboard/noticias/${dailyAnalysis.slug || dailyAnalysis.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--brand-primary)',
                    color: 'var(--text-inverse)'
                  }}>
                  <span>Ler Análise Completa</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Recursos Essenciais */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] mb-3" style={{ color: 'var(--text-primary)' }}>
                  Recursos Essenciais
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Ferramentas e conhecimento para navegar o mercado cripto com segurança
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Gráficos Avançados */}
                <Link
                  href="/graficos"
                  className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    minHeight: '180px'
                  }}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div>
                      <div className="inline-block px-2 py-1 rounded-md text-xs font-bold mb-3 bg-white/20 backdrop-blur-sm">
                        Análise
                      </div>
                      <h4 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform origin-left">
                        Gráficos Avançados
                      </h4>
                      <p className="text-sm opacity-90 mb-3">
                        Análise técnica profissional em tempo real
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold opacity-90">TradingView</span>
                      <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

                {/* Card 2: Exchanges Verificadas */}
                <Link
                  href="/recursos?search=exchange"
                  className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #F3BA2F 0%, #EAA42D 100%)',
                    minHeight: '180px'
                  }}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div>
                      <div className="inline-block px-2 py-1 rounded-md text-xs font-bold mb-3 bg-white/20 backdrop-blur-sm">
                        Segurança
                      </div>
                      <h4 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform origin-left">
                        Exchanges Verificadas
                      </h4>
                      <p className="text-sm opacity-90 mb-3">
                        Links oficiais de plataformas confiáveis
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold opacity-90">Links seguros</span>
                      <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

                {/* Card 3: Como Investir */}
                <Link
                  href="/educacao"
                  className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    minHeight: '180px'
                  }}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div>
                      <div className="inline-block px-2 py-1 rounded-md text-xs font-bold mb-3 bg-white/20 backdrop-blur-sm">
                        Educação
                      </div>
                      <h4 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform origin-left">
                        Como Investir
                      </h4>
                      <p className="text-sm opacity-90 mb-3">
                        Guia completo para começar a investir
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold opacity-90">Intermediário</span>
                      <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

                {/* Card 4: Notícias do Mercado */}
                <Link
                  href="/dashboard/noticias"
                  className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #F7931A 0%, #E67E22 100%)',
                    minHeight: '180px'
                  }}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div>
                      <div className="inline-block px-2 py-1 rounded-md text-xs font-bold mb-3 bg-white/20 backdrop-blur-sm">
                        Atualizado
                      </div>
                      <h4 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform origin-left">
                        Notícias do Mercado
                      </h4>
                      <p className="text-sm opacity-90 mb-3">
                        Últimas atualizações do mundo cripto
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold opacity-90">Tempo real</span>
                      <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
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

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {news.length > 0 ? (
                  news.map((item, idx) => (
                    <Link
                      key={idx}
                      href={`/dashboard/noticias/${item.slug || item.id}`}
                      className="group relative rounded-2xl p-6 overflow-hidden border shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer block"
                      style={{
                        background: `linear-gradient(135deg, ${getSentimentGradient(item.sentiment)}, var(--bg-elevated))`,
                        borderColor: 'var(--border-light)'
                      }}
                    >
                      {/* Glow sutil no topo no hover */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${getSentimentColor(item.sentiment)}, transparent)`,
                          boxShadow: `0 0 20px ${getSentimentColor(item.sentiment)}40`
                        }}
                      />

                      {/* Content wrapper */}
                      <div className="relative flex flex-col h-full">
                        {/* Header do Card */}
                        <div className="flex items-start justify-between mb-4">
                          {/* Badge de Sentimento com ícone */}
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-sm" style={{
                            backgroundColor: `${getSentimentColor(item.sentiment)}15`,
                            border: `1px solid ${getSentimentColor(item.sentiment)}30`
                          }}>
                            <span className="text-xs font-bold uppercase tracking-wide" style={{
                              color: getSentimentColor(item.sentiment) // Usando a cor direta para o texto também
                            }}>
                              {getSentimentLabel(item.sentiment)}
                            </span>
                          </div>

                          {/* Tempo de publicação */}
                          <span className="text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-sm flex items-center gap-1.5" style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-tertiary)'
                          }}>
                            <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                            {getTimeAgo(item.publishedAt)}
                          </span>
                        </div>

                        {/* Título */}
                        <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors min-h-[3.5rem]" style={{ color: 'var(--text-primary)' }}>
                          {item.title}
                        </h3>

                        {/* Resumo */}
                        <p className="text-sm mb-4 line-clamp-3 leading-relaxed opacity-90 min-h-[4.5rem]" style={{ color: 'var(--text-secondary)' }}>
                          {item.summary}
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
                ) : loadingResources ? (
                  <div className="col-span-full text-center py-12">
                    <div className="inline-block animate-pulse px-6 py-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Carregando recursos...</p>
                    </div>
                  </div>
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Nenhum recurso encontrado no momento.</p>
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
