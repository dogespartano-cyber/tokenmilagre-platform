'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
  faChartSimple
} from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
  faTelegram,
  faReddit
} from '@fortawesome/free-brands-svg-icons';
import TopCryptosList from '@/components/TopCryptosList';

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

export default function CryptoPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [crypto, setCrypto] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Forçar scroll para o topo ao montar ou mudar de moeda (fix para bug de scroll)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    // Fade out ao mudar de moeda
    setFadeIn(false);

    const fetchCrypto = async () => {
      try {
        // Tentar carregar do cache primeiro
        const cacheKey = `crypto_${slug}`;
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
        const response = await fetch(`/api/crypto/${slug}`);
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
  }, [slug]);

  // Prefetch inteligente das top moedas em background
  useEffect(() => {
    if (!slug) return;

    // Aguardar 1.5s para não interferir com carregamento da moeda atual
    const prefetchTimer = setTimeout(() => {
      TOP_CRYPTO_SLUGS.forEach((topSlug) => {
        // Pular a moeda atual
        if (topSlug === slug) return;

        // Verificar se já está em cache
        const cacheKey = `crypto_${topSlug}`;
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
        fetch(`/api/crypto/${topSlug}`)
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
  }, [slug]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[calc(100vh-300px)] animate-fade-in">
          {/* Spinner circular */}
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin"
            style={{
              borderColor: 'var(--border-light)',
              borderTopColor: 'var(--brand-primary)',
            }}
          />
        </div>
      </div>
    );
  }

  if (error || !crypto) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {error || 'Criptomoeda não encontrada'}
          </h1>
          <Link
            href="/criptomoedas"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
              color: 'white',
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Voltar para Criptomoedas
          </Link>
        </div>
      </div>
    );
  }

  const socialLinks = parseSocialLinks(crypto.socialLinks);
  const priceChangeColor =
    crypto.priceChangePercentage24h && crypto.priceChangePercentage24h > 0
      ? '#22c55e'
      : '#ef4444';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link
        href="/criptomoedas"
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70 mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Voltar para Criptomoedas
      </Link>

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
        <div
          className="rounded-2xl p-8 border shadow-lg"
          style={{
            background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-secondary) 100%)',
            borderColor: 'var(--border-light)',
          }}
        >
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
                  <h1
                    className="text-4xl font-bold font-[family-name:var(--font-poppins)]"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {crypto.name}
                  </h1>
                  <span
                    className="px-3 py-1 rounded-lg text-sm font-bold"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {crypto.symbol}
                  </span>
                  {crypto.marketCapRank && (
                    <span
                      className="px-3 py-1 rounded-lg text-sm font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                      }}
                    >
                      #{crypto.marketCapRank}
                    </span>
                  )}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {crypto.blockchain && `Blockchain: ${crypto.blockchain}`}
                </p>
              </div>
            </div>

            <div className="text-left lg:text-right">
              <div
                className="text-5xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {formatPrice(crypto.currentPrice)}
              </div>
              {crypto.priceChangePercentage24h !== null && (
                <div
                  className="flex items-center gap-2 text-xl font-semibold justify-start lg:justify-end"
                  style={{ color: priceChangeColor }}
                >
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
          <div
            className="rounded-xl p-6 border shadow-md"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-light)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <FontAwesomeIcon
                icon={faChartLine}
                className="w-5 h-5"
                style={{ color: 'var(--brand-primary)' }}
              />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Market Cap
              </h3>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatLargeNumber(crypto.marketCap)}
            </p>
          </div>

          {/* Volume 24h */}
          <div
            className="rounded-xl p-6 border shadow-md"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-light)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <FontAwesomeIcon
                icon={faChartSimple}
                className="w-5 h-5"
                style={{ color: 'var(--brand-primary)' }}
              />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Volume 24h
              </h3>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatLargeNumber(crypto.totalVolume)}
            </p>
          </div>

          {/* Máxima 24h */}
          <div
            className="rounded-xl p-6 border shadow-md"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-light)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <FontAwesomeIcon
                icon={faArrowUp}
                className="w-5 h-5"
                style={{ color: '#22c55e' }}
              />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Máxima 24h
              </h3>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatPrice(crypto.high24h)}
            </p>
          </div>

          {/* Mínima 24h */}
          <div
            className="rounded-xl p-6 border shadow-md"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-light)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <FontAwesomeIcon
                icon={faArrowDown}
                className="w-5 h-5"
                style={{ color: '#ef4444' }}
              />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Mínima 24h
              </h3>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatPrice(crypto.low24h)}
            </p>
          </div>
        </div>

        {/* Supply & ATH/ATL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supply Info */}
          <div
            className="rounded-2xl p-6 border shadow-md"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-light)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FontAwesomeIcon
                icon={faCoins}
                className="w-6 h-6"
                style={{ color: 'var(--brand-primary)' }}
              />
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Fornecimento
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Circulante:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {formatSupply(crypto.circulatingSupply)} {crypto.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Total:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {formatSupply(crypto.totalSupply)} {crypto.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Máximo:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {crypto.maxSupply ? `${formatSupply(crypto.maxSupply)} ${crypto.symbol}` : '∞'}
                </span>
              </div>
            </div>
          </div>

          {/* ATH/ATL */}
          <div
            className="rounded-2xl p-6 border shadow-md"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-light)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FontAwesomeIcon
                icon={faTrophy}
                className="w-6 h-6"
                style={{ color: 'var(--brand-primary)' }}
              />
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Recordes
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    All-Time High:
                  </span>
                  <span className="text-xl font-bold" style={{ color: '#22c55e' }}>
                    {formatPrice(crypto.ath)}
                  </span>
                </div>
                <p className="text-xs text-right" style={{ color: 'var(--text-tertiary)' }}>
                  {formatDate(crypto.athDate)}
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    All-Time Low:
                  </span>
                  <span className="text-xl font-bold" style={{ color: '#ef4444' }}>
                    {formatPrice(crypto.atl)}
                  </span>
                </div>
                <p className="text-xs text-right" style={{ color: 'var(--text-tertiary)' }}>
                  {formatDate(crypto.atlDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {crypto.description && (
          <div
            className="rounded-2xl p-6 border shadow-md"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-light)',
            }}
          >
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Sobre {crypto.name}
            </h2>
            <div
              className="prose prose-lg max-w-none"
              style={{ color: 'var(--text-secondary)' }}
              dangerouslySetInnerHTML={{ __html: crypto.description }}
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
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-md"
              style={{
                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                color: 'white',
              }}
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
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-md"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '2px solid var(--border-medium)',
              }}
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
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #1DA1F2, #0d8bd9)',
                color: 'white',
              }}
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
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #0088cc, #006699)',
                color: 'white',
              }}
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
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #FF4500, #d93d00)',
                color: 'white',
              }}
            >
              <FontAwesomeIcon icon={faReddit} />
              Reddit
            </a>
          )}
        </div>
        </div>

        {/* Sidebar - Top Cryptos */}
        <aside className="lg:block">
          <TopCryptosList currentSlug={slug} />
        </aside>
      </div>
    </div>
  );
}
