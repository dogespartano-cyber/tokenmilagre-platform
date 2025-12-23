'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowUp,
  faArrowDown,
  faGlobe,
  faFileAlt,
  faChartLine,
  faCoins,
  faTrophy,
  faChartSimple,
  faNewspaper,
  faClock,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
  faTelegram,
  faReddit
} from '@fortawesome/free-brands-svg-icons';
import TopCryptosList from '@/components/crypto/TopCryptosList';

// Lista de top moedas para prefetch inteligente
const TOP_CRYPTO_SLUGS = [
  'bitcoin',
  'ethereum',
  'tether',
  'binancecoin',
  'solana',
  'ripple',
  'usd-coin',
  'cardano',
  'dogecoin',
  'tron',
  'avalanche-2',
  'shiba-inu',
  'polkadot',
  'chainlink',
  'bitcoin-cash',
  'litecoin',
  'polygon',
  'dai',
  'uniswap',
  'internet-computer',
];

interface CryptoData {
  id: string;
  coingeckoId: string;
  symbol: string;
  name: string;
  slug: string;
  currentPrice: number | null;
  marketCap: number | null;
  marketCapRank: number | null;
  totalVolume: number | null;
  high24h: number | null;
  low24h: number | null;
  priceChange24h: number | null;
  priceChangePercentage24h: number | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  maxSupply: number | null;
  ath: number | null;
  athDate: string | null;
  atl: number | null;
  atlDate: string | null;
  description: string | null;
  homepage: string | null;
  whitepaper: string | null;
  blockchain: string | null;
  socialLinks: string | null;
  imageSmall: string | null;
  imageLarge: string | null;
  lastUpdated: string;
  createdAt: string;
}

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

export default function CryptoPage() {
  const params = useParams();
  const coingeckoId = params?.slug as string; // URL param ainda se chama "slug" mas contém o coingeckoId

  const [crypto, setCrypto] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);

  // Sanitizar HTML da descrição para prevenir XSS
  const sanitizedDescription = useMemo(() => {
    if (!crypto?.description) return '';
    return DOMPurify.sanitize(crypto.description);
  }, [crypto?.description]);

  // Forçar scroll para o topo ao montar ou mudar de moeda (fix para bug de scroll)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [coingeckoId]);

  useEffect(() => {
    if (!coingeckoId) return;

    // Fade out ao mudar de moeda
    setFadeIn(false);

    const fetchCrypto = async () => {
      try {
        // Tentar carregar do cache primeiro
        const cacheKey = `crypto_${coingeckoId}`;
        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
          const cachedData = JSON.parse(cached);
          const cacheAge = Date.now() - cachedData.timestamp;

          // Se cache tem menos de 1 hora, usar imediatamente
          if (cacheAge < 60 * 60 * 1000) {
            setCrypto(cachedData.data);
            setLoading(false);
            setIsRefreshing(true); // Atualizar em background

            // Fade in após carregar do cache
            setTimeout(() => setFadeIn(true), 50);
          }
        }

        // Se não tem cache, mostrar loading
        if (!cached) {
          setLoading(true);
        }

        // Fazer fetch (sempre, para manter atualizado)
        const response = await fetch(`/api/crypto/${coingeckoId}`);
        const result = await response.json();

        if (result.success) {
          setCrypto(result.data);
          setIsStale(result.stale || false);

          // Salvar no cache
          sessionStorage.setItem(cacheKey, JSON.stringify({
            data: result.data,
            timestamp: Date.now(),
          }));

          // Fade in após carregar da API
          setTimeout(() => setFadeIn(true), 50);
        } else {
          setError(result.error || 'Erro ao carregar dados');
        }
      } catch (err) {
        setError('Erro ao carregar dados da criptomoeda');
        console.error(err);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchCrypto();
  }, [coingeckoId]);

  // Prefetch inteligente das top moedas em background
  useEffect(() => {
    if (!coingeckoId) return;

    // Aguardar 1.5s para não interferir com carregamento da moeda atual
    const prefetchTimer = setTimeout(() => {
      TOP_CRYPTO_SLUGS.forEach((topCryptoId) => {
        // Pular a moeda atual
        if (topCryptoId === coingeckoId) return;

        // Verificar se já está em cache
        const cacheKey = `crypto_${topCryptoId}`;
        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
          try {
            const cachedData = JSON.parse(cached);
            const cacheAge = Date.now() - cachedData.timestamp;

            // Se cache ainda é válido (< 1 hora), não fazer prefetch
            if (cacheAge < 60 * 60 * 1000) {
              return;
            }
          } catch (error) {
            // Cache inválido, continuar com prefetch
          }
        }

        // Fazer prefetch silencioso
        fetch(`/api/crypto/${topCryptoId}`)
          .then((res) => res.json())
          .then((result) => {
            if (result.success) {
              // Salvar no cache
              sessionStorage.setItem(
                cacheKey,
                JSON.stringify({
                  data: result.data,
                  timestamp: Date.now(),
                })
              );
            }
          })
          .catch(() => {
            // Ignorar erros - prefetch é opcional
          });
      });
    }, 1500);

    return () => clearTimeout(prefetchTimer);
  }, [coingeckoId]);

  // Buscar notícias relacionadas
  useEffect(() => {
    if (!coingeckoId) return;

    const fetchRelatedNews = async () => {
      setLoadingNews(true);
      try {
        const response = await fetch(`/api/news/related/${coingeckoId}`);
        const result = await response.json();

        if (result.success) {
          setRelatedNews(result.data);
        }
      } catch (error) {
        console.error('Erro ao buscar notícias relacionadas:', error);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchRelatedNews();
  }, [coingeckoId]);

  const formatPrice = (price: number | null) => {
    if (!price) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 6 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatLargeNumber = (num: number | null) => {
    if (!num) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatSupply = (num: number | null) => {
    if (!num) return 'N/A';
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const parseSocialLinks = (linksJson: string | null) => {
    if (!linksJson) return null;
    try {
      return JSON.parse(linksJson);
    } catch {
      return null;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Há ${diffMins}min`;
    if (diffHours < 24) return `Há ${diffHours}h`;
    return `Há ${diffDays}d`;
  };



  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="flex items-center justify-center min-h-[calc(100vh-300px)] animate-fade-in">
          {/* Spinner circular */}
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin border-[var(--border-article)] border-t-[var(--brand-primary)]"
          />
        </div>
      </div>
    );
  }

  if (error || !crypto) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold mb-4 text-[var(--text-article-title)]">
            {error || 'Criptomoeda não encontrada'}
          </h1>
        </div>
      </div>
    );
  }

  const socialLinks = parseSocialLinks(crypto.socialLinks);
  const priceChangeColorClass =
    crypto.priceChangePercentage24h && crypto.priceChangePercentage24h > 0
      ? 'text-emerald-500'
      : 'text-red-500';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
      {/* Grid Layout: Content + Sidebar */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 transition-all duration-300 ease-in-out"
        style={{
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        {/* Main Content */}
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="glass-card rounded-2xl p-8 border border-[var(--border-article)] shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                {crypto.imageLarge && (
                  <Image
                    src={crypto.imageLarge}
                    alt={crypto.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                )}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
                      {crypto.name}
                    </h1>
                    <span className="px-3 py-1 rounded-lg text-sm font-bold bg-[var(--bg-article-tag)] text-[var(--text-article-muted)]">
                      {crypto.symbol}
                    </span>
                    {crypto.marketCapRank && (
                      <span className="px-3 py-1 rounded-lg text-sm font-bold bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-sm">
                        #{crypto.marketCapRank}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-article-muted)]">
                    {crypto.blockchain && `Blockchain: ${crypto.blockchain}`}
                  </p>
                </div>
              </div>

              <div className="text-left lg:text-right">
                <div className="text-5xl font-bold mb-2 text-[var(--text-article-title)]">
                  {formatPrice(crypto.currentPrice)}
                </div>
                {crypto.priceChangePercentage24h !== null && (
                  <div className={`flex items-center gap-2 text-xl font-semibold justify-start lg:justify-end ${priceChangeColorClass}`}>
                    <FontAwesomeIcon
                      icon={crypto.priceChangePercentage24h > 0 ? faArrowUp : faArrowDown}
                    />
                    {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}% (24h)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Market Cap */}
            <div className="glass-card rounded-xl p-6 border border-[var(--border-article)] shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="w-5 h-5 text-[var(--brand-primary)]"
                />
                <h3 className="text-sm font-semibold text-[var(--text-article-muted)]">
                  Market Cap
                </h3>
              </div>
              <p className="text-2xl font-bold text-[var(--text-article-title)]">
                {formatLargeNumber(crypto.marketCap)}
              </p>
            </div>

            {/* Volume 24h */}
            <div className="glass-card rounded-xl p-6 border border-[var(--border-article)] shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon
                  icon={faChartSimple}
                  className="w-5 h-5 text-[var(--brand-primary)]"
                />
                <h3 className="text-sm font-semibold text-[var(--text-article-muted)]">
                  Volume 24h
                </h3>
              </div>
              <p className="text-2xl font-bold text-[var(--text-article-title)]">
                {formatLargeNumber(crypto.totalVolume)}
              </p>
            </div>

            {/* Máxima 24h */}
            <div className="glass-card rounded-xl p-6 border border-[var(--border-article)] shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon
                  icon={faArrowUp}
                  className="w-5 h-5 text-emerald-500"
                />
                <h3 className="text-sm font-semibold text-[var(--text-article-muted)]">
                  Máxima 24h
                </h3>
              </div>
              <p className="text-2xl font-bold text-[var(--text-article-title)]">
                {formatPrice(crypto.high24h)}
              </p>
            </div>

            {/* Mínima 24h */}
            <div className="glass-card rounded-xl p-6 border border-[var(--border-article)] shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon
                  icon={faArrowDown}
                  className="w-5 h-5 text-red-500"
                />
                <h3 className="text-sm font-semibold text-[var(--text-article-muted)]">
                  Mínima 24h
                </h3>
              </div>
              <p className="text-2xl font-bold text-[var(--text-article-title)]">
                {formatPrice(crypto.low24h)}
              </p>
            </div>
          </div>

          {/* Supply & ATH/ATL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Supply Info */}
            <div className="glass-card rounded-2xl p-6 border border-[var(--border-article)] shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faCoins}
                  className="w-6 h-6 text-[var(--brand-primary)]"
                />
                <h2 className="text-xl font-bold text-[var(--text-article-title)]">
                  Fornecimento
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[var(--text-article-muted)]">Circulante:</span>
                  <span className="font-semibold text-[var(--text-article-title)]">
                    {formatSupply(crypto.circulatingSupply)} {crypto.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-article-muted)]">Total:</span>
                  <span className="font-semibold text-[var(--text-article-title)]">
                    {formatSupply(crypto.totalSupply)} {crypto.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-article-muted)]">Máximo:</span>
                  <span className="font-semibold text-[var(--text-article-title)]">
                    {crypto.maxSupply ? `${formatSupply(crypto.maxSupply)} ${crypto.symbol}` : '∞'}
                  </span>
                </div>
              </div>
            </div>

            {/* ATH/ATL */}
            <div className="glass-card rounded-2xl p-6 border border-[var(--border-article)] shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faTrophy}
                  className="w-6 h-6 text-[var(--brand-primary)]"
                />
                <h2 className="text-xl font-bold text-[var(--text-article-title)]">
                  Recordes
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[var(--text-article-muted)]">
                      All-Time High:
                    </span>
                    <span className="text-xl font-bold text-emerald-500">
                      {formatPrice(crypto.ath)}
                    </span>
                  </div>
                  <p className="text-xs text-right text-[var(--text-article-muted)]">
                    {formatDate(crypto.athDate)}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[var(--text-article-muted)]">
                      All-Time Low:
                    </span>
                    <span className="text-xl font-bold text-red-500">
                      {formatPrice(crypto.atl)}
                    </span>
                  </div>
                  <p className="text-xs text-right text-[var(--text-article-muted)]">
                    {formatDate(crypto.atlDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {crypto.description && (
            <div className="glass-card rounded-2xl p-6 border border-[var(--border-article)] shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-[var(--text-article-title)]">
                Sobre {crypto.name}
              </h2>
              <div
                className="prose prose-lg max-w-none text-[var(--text-article-body)]"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {crypto.homepage && (
              <a
                href={crypto.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-md bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-hover)] text-white"
              >
                <FontAwesomeIcon icon={faGlobe} />
                Website Oficial
              </a>
            )}

            {crypto.whitepaper && (
              <a
                href={crypto.whitepaper}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-md glass-card border border-[var(--border-article)] text-[var(--text-article-title)] hover:border-[var(--brand-primary)]"
              >
                <FontAwesomeIcon icon={faFileAlt} />
                Whitepaper
              </a>
            )}

            {socialLinks?.twitter && (
              <a
                href={`https://twitter.com/${socialLinks.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-md bg-[#1DA1F2] text-white"
              >
                <FontAwesomeIcon icon={faTwitter} />
                Twitter
              </a>
            )}

            {socialLinks?.telegram && (
              <a
                href={`https://t.me/${socialLinks.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-md bg-[#0088cc] text-white"
              >
                <FontAwesomeIcon icon={faTelegram} />
                Telegram
              </a>
            )}

            {socialLinks?.reddit && (
              <a
                href={socialLinks.reddit}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-md bg-[#FF4500] text-white"
              >
                <FontAwesomeIcon icon={faReddit} />
                Reddit
              </a>
            )}
          </div>

          {/* Related News Section */}
          {!loadingNews && relatedNews.length > 0 && (
            <div className="space-y-6">
              <div className="pl-2 border-l-4 border-[var(--brand-primary)]">
                <h2 className="text-2xl font-bold text-[var(--text-article-title)]">
                  Notícias
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedNews.map((news) => (
                  <Link
                    key={news.id}
                    href={news.url}
                    className="glass-card group flex flex-col p-5 rounded-2xl border border-[var(--border-article)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--brand-primary)]/50"
                  >
                    {/* Header: Category + Sentiment */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[var(--bg-article-tag)] text-[var(--text-article-muted)] uppercase tracking-wide">
                        {news.category[0]}
                      </span>
                      <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md ${news.sentiment === 'positive' ? 'text-emerald-500 bg-emerald-500/10' :
                        news.sentiment === 'negative' ? 'text-red-500 bg-red-500/10' :
                          'text-amber-500 bg-amber-500/10'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${news.sentiment === 'positive' ? 'bg-emerald-500' :
                          news.sentiment === 'negative' ? 'bg-red-500' :
                            'bg-amber-500'
                          }`} />
                        {news.sentiment === 'positive' ? 'Positivo' : news.sentiment === 'negative' ? 'Negativo' : 'Neutro'}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-3 line-clamp-2 text-[var(--text-article-title)] group-hover:text-[var(--brand-primary)] transition-colors">
                      {news.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm mb-4 line-clamp-3 text-[var(--text-article-body)] flex-grow">
                      {news.summary}
                    </p>

                    {/* Footer: Time + Arrow */}
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-article)] mt-auto">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-article-muted)]">
                        <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                        {getTimeAgo(news.publishedAt)}
                      </div>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="w-4 h-4 text-[var(--brand-primary)] transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="sticky top-24">
            <TopCryptosList />
          </div>
        </div>
      </div>
    </div>
  );
}
