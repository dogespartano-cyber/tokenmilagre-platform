/**
 * @module home/MarketDataCards
 * @description Cards de dados de mercado (capitalização, volume, dominância)
 */

'use client';

import type { MarketDataProps } from './types';

/**
 * Formata números grandes para exibição
 */
const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString('pt-BR')}`;
};

export function MarketDataCards({ marketData }: MarketDataProps) {
    if (!marketData) return null;

    const cardClass = "relative p-4 lg:p-6 rounded-2xl zenith-card overflow-hidden";

    return (
        <>
            {/* Mobile/Tablet: Cards em Grid 2x2 */}
            <div className="lg:hidden grid grid-cols-2 gap-4">
                {/* Capitalização Total */}
                <div className={cardClass}>
                    <div className="mb-2">
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Capitalização Total</p>
                    </div>
                    <p className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                        {formatNumber(marketData.totalMarketCap)}
                    </p>
                    <p className="text-xs font-semibold" style={{
                        color: marketData.marketCapChange24h >= 0 ? 'var(--success)' : 'var(--error)'
                    }}>
                        {marketData.marketCapChange24h >= 0 ? '▲' : '▼'}
                        {Math.abs(marketData.marketCapChange24h).toFixed(2)}%
                    </p>
                </div>

                {/* Volume 24h */}
                <div className={cardClass}>
                    <div className="mb-2">
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Volume 24h</p>
                    </div>
                    <p className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                        {formatNumber(marketData.totalVolume)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Global</p>
                </div>

                {/* Dominância BTC */}
                <div className={cardClass}>
                    <div className="mb-2">
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Dominância BTC</p>
                    </div>
                    <p className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                        {marketData.btcDominance.toFixed(2)}%
                    </p>
                    <div className="w-full rounded-full h-1.5 mt-1 bg-zinc-500/10">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                background: 'linear-gradient(90deg, #F59E0B, #D97706)',
                                width: `${marketData.btcDominance}%`
                            }}
                        />
                    </div>
                </div>

                {/* Dominância ETH */}
                <div className={cardClass}>
                    <div className="mb-2">
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Dominância ETH</p>
                    </div>
                    <p className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                        {marketData.ethDominance.toFixed(2)}%
                    </p>
                    <div className="w-full rounded-full h-1.5 mt-1 bg-zinc-500/10">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
                                width: `${marketData.ethDominance}%`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Desktop: Cards em 1 Linha Horizontal */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-6">
                {/* Capitalização Total */}
                <div className={cardClass}>
                    <div className="mb-2">
                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Capitalização Total</p>
                    </div>
                    <p className="font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
                        {formatNumber(marketData.totalMarketCap)}
                    </p>
                    <p className="text-sm font-semibold" style={{
                        color: marketData.marketCapChange24h >= 0 ? 'var(--success)' : 'var(--error)'
                    }}>
                        {marketData.marketCapChange24h >= 0 ? '▲' : '▼'}
                        {Math.abs(marketData.marketCapChange24h).toFixed(2)}% (24h)
                    </p>
                </div>

                {/* Volume 24h */}
                <div className={cardClass}>
                    <div className="mb-2">
                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Volume 24h</p>
                    </div>
                    <p className="font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
                        {formatNumber(marketData.totalVolume)}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Negociação global</p>
                </div>

                {/* Dominância BTC */}
                <div className={cardClass}>
                    <div className="mb-2">
                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Dominância BTC</p>
                    </div>
                    <p className="font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
                        {marketData.btcDominance.toFixed(2)}%
                    </p>
                    <div className="w-full rounded-full h-2 mt-2 bg-zinc-500/10">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                background: 'linear-gradient(90deg, #F59E0B, #D97706)',
                                width: `${marketData.btcDominance}%`
                            }}
                        />
                    </div>
                </div>

                {/* Dominância ETH */}
                <div className={cardClass}>
                    <div className="mb-2">
                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Dominância ETH</p>
                    </div>
                    <p className="font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
                        {marketData.ethDominance.toFixed(2)}%
                    </p>
                    <div className="w-full rounded-full h-2 mt-2 bg-zinc-500/10">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
                                width: `${marketData.ethDominance}%`
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
