'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowRight, faCheckCircle, faArrowUp, faChartLine, faShieldAlt, faGraduationCap, faNewspaper } from '@fortawesome/free-solid-svg-icons';
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
  const [chartSymbol, setChartSymbol] = useState('BTCUSDT');

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
      wallet: 'linear-gradient(135deg, #F6851B 0%, #E2761B 100%)', // Orange
      exchange: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', // Blue
      'defi-protocol': 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', // Pink
      browsers: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', // Purple
      analytics: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', // Indigo
      explorers: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', // Emerald
      'development-tools': 'linear-gradient(135deg, #64748B 0%, #475569 100%)', // Slate
      tools: 'linear-gradient(135deg, #64748B 0%, #475569 100%)', // Slate
      'portfolio-tracker': 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', // Cyan
    };
    return gradients[category] || 'linear-gradient(135deg, #64748B 0%, #475569 100%)'; // Slate default
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
      'development-tools': 'Dev',
      tools: 'Tools',
      'portfolio-tracker': 'Portfolio',
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
    <div className="min-h-screen relative overflow-hidden bg-[var(--bg-primary)] transition-colors duration-300">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-6 md:px-10 py-8 relative z-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-pulse">📊</div>
            <p className="text-xl" style={{ color: 'var(--text-primary)' }}>Carregando dados do mercado...</p>
          </div>
        ) : (
          <div className="space-y-12">

            {/* Header Section */}


            {/* Visão Geral do Mercado + Velocímetro Integrado */}
            <div className="space-y-6">
              {/* Mobile/Tablet: Cards em Grid 2x2 */}
              <div className="lg:hidden grid grid-cols-2 gap-4">
                {/* Capitalização Total */}
                <div className="glass-card rounded-2xl p-4">
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
                <div className="glass-card rounded-2xl p-4">
                  <div className="mb-2">
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Volume 24h</p>
                  </div>
                  <p className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                    {marketData && formatNumber(marketData.totalVolume)}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Global</p>
                </div>

                {/* Dominância BTC */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="mb-2">
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>BTC</p>
                  </div>
                  <p className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                    {marketData && marketData.btcDominance.toFixed(2)}%
                  </p>
                  <div className="w-full rounded-full h-1.5 mt-1 bg-[var(--bg-tertiary)]">
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
                <div className="glass-card rounded-2xl p-4">
                  <div className="mb-2">
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>ETH</p>
                  </div>
                  <p className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                    {marketData && marketData.ethDominance.toFixed(2)}%
                  </p>
                  <div className="w-full rounded-full h-1.5 mt-1 bg-[var(--bg-tertiary)]">
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
                <div className="glass-card rounded-2xl p-6">
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
                <div className="glass-card rounded-2xl p-6">
                  <div className="mb-2">
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Volume 24h</p>
                  </div>
                  <p className="font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
                    {marketData && formatNumber(marketData.totalVolume)}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Negociação global</p>
                </div>

                {/* Dominância BTC */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="mb-2">
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Dominância BTC</p>
                  </div>
                  <p className="font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
                    {marketData && marketData.btcDominance.toFixed(2)}%
                  </p>
                  <div className="w-full rounded-full h-2 mt-2 bg-[var(--bg-tertiary)]">
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
                <div className="glass-card rounded-2xl p-6">
                  <div className="mb-2">
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Dominância ETH</p>
                  </div>
                  <p className="font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
                    {marketData && marketData.ethDominance.toFixed(2)}%
                  </p>
                  <div className="w-full rounded-full h-2 mt-2 bg-[var(--bg-tertiary)]">
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
              <div className="glass-card rounded-2xl p-6 border-l-4 border-teal-500">

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
                  <h4 className="text-xl font-bold mb-3 line-clamp-2 hover:text-teal-500 transition-colors cursor-pointer"
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
                    <div className="p-3 rounded-lg bg-[var(--bg-primary)]/50 backdrop-blur-sm border border-[var(--border-light)]">
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
                    <div className="p-3 rounded-lg bg-[var(--bg-primary)]/50 backdrop-blur-sm border border-[var(--border-light)]">
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
                    <div className="p-3 rounded-lg bg-[var(--bg-primary)]/50 backdrop-blur-sm border border-[var(--border-light)]">
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-80 bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg hover:shadow-teal-500/30"
                >
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
                  className="glass-card group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 mb-4">
                        <FontAwesomeIcon icon={faChartLine} />
                      </div>
                      <h4 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
                        Gráficos Avançados
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)] mb-3">
                        Análise técnica profissional em tempo real
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-purple-500 text-sm font-semibold">
                      <span>TradingView</span>
                      <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

                {/* Card 2: Ferramentas & Recursos */}
                <Link
                  href="/recursos"
                  className="glass-card group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 mb-4">
                        <FontAwesomeIcon icon={faShieldAlt} />
                      </div>
                      <h4 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
                        Ferramentas & Recursos
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)] mb-3">
                        Plataformas e ferramentas essenciais
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-blue-500 text-sm font-semibold">
                      <span>Links seguros</span>
                      <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

                {/* Card 3: Como Investir */}
                <Link
                  href="/educacao"
                  className="glass-card group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 text-green-500 mb-4">
                        <FontAwesomeIcon icon={faGraduationCap} />
                      </div>
                      <h4 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
                        Como Investir
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)] mb-3">
                        Guia completo para começar a investir
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-green-500 text-sm font-semibold">
                      <span>Intermediário</span>
                      <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

                {/* Card 4: Notícias do Mercado */}
                <Link
                  href="/dashboard/noticias"
                  className="glass-card group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10 text-red-500 mb-4">
                        <FontAwesomeIcon icon={faNewspaper} />
                      </div>
                      <h4 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
                        Notícias do Mercado
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)] mb-3">
                        Fique por dentro do que move o mercado
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-red-500 text-sm font-semibold">
                      <span>Em tempo real</span>
                      <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Últimas Notícias */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Últimas Notícias
                </h2>
                <Link href="/dashboard/noticias" className="text-sm font-semibold hover:underline" style={{ color: 'var(--brand-primary)' }}>
                  Ver todas
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {news.map((item) => (
                  <Link key={item.id} href={`/dashboard/noticias/${item.slug || item.id}`} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                        {item.category[0]}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)]">
                        {getTimeAgo(item.publishedAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
                      {item.summary}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="flex items-center gap-1" style={{ color: getSentimentColor(item.sentiment) }}>
                        <FontAwesomeIcon icon={getSentimentIcon(item.sentiment)} />
                        {getSentimentLabel(item.sentiment)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Aprenda sobre Cripto */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Aprenda sobre Cripto
                </h2>
                <Link href="/educacao" className="text-sm font-semibold hover:underline" style={{ color: 'var(--brand-primary)' }}>
                  Ver todos
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {education.map((item) => (
                  <Link key={item.id} href={`/educacao/${item.slug}`} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform">
                    <div className="mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3`} style={{ background: getLevelGradient(item.level) }}>
                        <FontAwesomeIcon icon={getLevelIcon(item.level)} style={{ color: getLevelColor(item.level) }} />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} />
                        {item.readTime}
                      </span>
                      <span style={{ color: getLevelColor(item.level) }}>
                        {item.level}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Gráfico de Preços */}
            <div className="glass-card rounded-2xl p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Gráfico de Preços
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartSymbol('BTCUSDT')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${chartSymbol === 'BTCUSDT' ? 'bg-orange-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}
                  >
                    BTC
                  </button>
                  <button
                    onClick={() => setChartSymbol('ETHUSDT')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${chartSymbol === 'ETHUSDT' ? 'bg-blue-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}
                  >
                    ETH
                  </button>
                  <button
                    onClick={() => setChartSymbol('SOLUSDT')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${chartSymbol === 'SOLUSDT' ? 'bg-purple-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}
                  >
                    SOL
                  </button>
                </div>
              </div>
              <div className="w-full">
                <LightweightChart symbol={chartSymbol} />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
