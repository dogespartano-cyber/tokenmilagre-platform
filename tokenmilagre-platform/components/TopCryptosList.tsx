'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faCoins } from '@fortawesome/free-solid-svg-icons';

interface TopCrypto {
  id: string;
  coingeckoId: string;
  name: string;
  symbol: string;
  currentPrice: number | null;
  priceChangePercentage24h: number | null;
  marketCapRank: number | null;
  imageSmall: string | null;
}

interface TopCryptosListProps {
  currentCryptoId?: string;
}

export default function TopCryptosList({ currentCryptoId }: TopCryptosListProps) {
  const [cryptos, setCryptos] = useState<TopCrypto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCryptos = async () => {
      try {
        // Tentar carregar do cache primeiro
        const cacheKey = 'crypto_top_list';
        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
          const cachedData = JSON.parse(cached);
          const cacheAge = Date.now() - cachedData.timestamp;

          // Se cache tem menos de 30 minutos, usar imediatamente
          if (cacheAge < 30 * 60 * 1000) {
            setCryptos(cachedData.data);
            setLoading(false);
            return; // Não fazer fetch novamente
          }
        }

        // Buscar dados atualizados
        const response = await fetch('/api/crypto/top');
        const result = await response.json();

        if (result.success) {
          setCryptos(result.data);

          // Salvar no cache
          sessionStorage.setItem(cacheKey, JSON.stringify({
            data: result.data,
            timestamp: Date.now(),
          }));
        }
      } catch (error) {
        console.error('Erro ao carregar top criptomoedas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCryptos();
  }, []);

  const formatPrice = (price: number | null) => {
    if (!price) return '$0.00';
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (loading) {
    return (
      <div
        className="rounded-2xl p-6 border shadow-md sticky top-24"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-light)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <FontAwesomeIcon
            icon={faCoins}
            className="w-5 h-5"
            style={{ color: 'var(--brand-primary)' }}
          />
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Top Moedas
          </h2>
        </div>
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-lg animate-pulse"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="h-4 rounded" style={{ backgroundColor: 'var(--border-medium)' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 border shadow-md sticky top-24"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-light)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <FontAwesomeIcon
          icon={faCoins}
          className="w-5 h-5"
          style={{ color: 'var(--brand-primary)' }}
        />
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Top Moedas
        </h2>
      </div>

      <div className="space-y-2">
        {cryptos.map((crypto) => {
          const isActive = crypto.coingeckoId === currentCryptoId;
          const priceChangeColor =
            crypto.priceChangePercentage24h && crypto.priceChangePercentage24h > 0
              ? '#22c55e'
              : '#ef4444';

          return (
            <Link
              key={crypto.id}
              href={`/criptomoedas/${crypto.coingeckoId}`}
              className="block p-3 rounded-lg transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                border: isActive
                  ? '2px solid var(--brand-primary)'
                  : '2px solid transparent',
              }}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <span
                  className="text-xs font-bold w-6 text-center"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {crypto.marketCapRank}
                </span>

                {/* Image */}
                {crypto.imageSmall ? (
                  <Image
                    src={crypto.imageSmall}
                    alt={crypto.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {crypto.symbol.charAt(0)}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-semibold text-sm truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {crypto.name}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {crypto.symbol}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {formatPrice(crypto.currentPrice)}
                    </span>

                    {crypto.priceChangePercentage24h !== null && (
                      <span
                        className="flex items-center gap-1 text-xs font-semibold"
                        style={{ color: priceChangeColor }}
                      >
                        <FontAwesomeIcon
                          icon={crypto.priceChangePercentage24h > 0 ? faArrowUp : faArrowDown}
                          className="w-3 h-3"
                        />
                        {Math.abs(crypto.priceChangePercentage24h).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
