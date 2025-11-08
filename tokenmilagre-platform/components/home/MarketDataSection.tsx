/**
 * Seção de Dados de Mercado da Homepage
 */

'use client';

import { TokenBTC, TokenETH } from '@token-icons/react';

interface MarketData {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  ethDominance: number;
  marketCapChange24h: number;
}

interface Props {
  data: MarketData | null;
  loading?: boolean;
}

export default function MarketDataSection({ data, loading }: Props) {
  if (loading || !data) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <section className="py-12 bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Market Cap */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-light)] hover:shadow-lg transition-all duration-300">
            <h3 className="text-[var(--text-tertiary)] text-sm font-medium mb-2">
              Market Cap Total
            </h3>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {formatCurrency(data.totalMarketCap)}
            </p>
            <p className={`text-sm mt-2 ${data.marketCapChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.marketCapChange24h >= 0 ? '+' : ''}
              {data.marketCapChange24h.toFixed(2)}% (24h)
            </p>
          </div>

          {/* Volume 24h */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-light)] hover:shadow-lg transition-all duration-300">
            <h3 className="text-[var(--text-tertiary)] text-sm font-medium mb-2">
              Volume 24h
            </h3>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {formatCurrency(data.totalVolume)}
            </p>
          </div>

          {/* BTC Dominance */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-light)] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <TokenBTC size={20} variant="branded" />
              <h3 className="text-[var(--text-tertiary)] text-sm font-medium">
                Dominância BTC
              </h3>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {data.btcDominance.toFixed(2)}%
            </p>
          </div>

          {/* ETH Dominance */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-light)] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <TokenETH size={20} variant="branded" />
              <h3 className="text-[var(--text-tertiary)] text-sm font-medium">
                Dominância ETH
              </h3>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {data.ethDominance.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
