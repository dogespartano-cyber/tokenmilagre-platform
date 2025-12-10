/**
 * @module home/ZenithMarketTicker
 * @description Linha superior dedicada para métricas de mercado (Cap, Vol, Dominance)
 * @design System: Zenith Cards (Glass/Gold)
 */
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faGlobe, faCoins } from '@fortawesome/free-solid-svg-icons';
import { TokenBTC, TokenETH } from '@token-icons/react';
import type { MarketDataProps } from './types';

const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    return `$${(num / 1e6).toFixed(0)}M`;
};

export function ZenithMarketTicker({ marketData }: MarketDataProps) {
    if (!marketData) return null;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* 1. Global Market Cap */}
            <div className="zenith-card p-4 flex items-center gap-4 group hover:border-[var(--brand-primary)]/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)] group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faGlobe} />
                </div>
                <div>
                    <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Capitalização</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-[var(--text-primary)] font-mono">{formatNumber(marketData.totalMarketCap)}</span>
                        <span className={`text-xs font-bold ${marketData.marketCapChange24h >= 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                            {marketData.marketCapChange24h >= 0 ? '+' : ''}{marketData.marketCapChange24h.toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. 24h Volume */}
            <div className="zenith-card p-4 flex items-center gap-4 group hover:border-[var(--info)]/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[var(--info)]/10 flex items-center justify-center text-[var(--info)] group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faChartLine} />
                </div>
                <div>
                    <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Volume 24h</p>
                    <span className="text-lg font-bold text-[var(--text-primary)] font-mono">{formatNumber(marketData.totalVolume)}</span>
                </div>
            </div>

            {/* 3. BTC Dominance */}
            <div className="zenith-card p-4 flex items-center gap-4 group hover:border-orange-500/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TokenBTC size={20} variant="branded" />
                </div>
                <div>
                    <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Dominância BTC</p>
                    <div className="w-full bg-[var(--bg-tertiary)] h-1.5 rounded-full mt-1 overflow-hidden w-24">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: `${marketData.btcDominance}%` }} />
                    </div>
                    <span className="text-sm font-bold text-[var(--text-primary)] mt-1 block">{marketData.btcDominance.toFixed(1)}%</span>
                </div>
            </div>

            {/* 4. ETH Dominance */}
            <div className="zenith-card p-4 flex items-center gap-4 group hover:border-indigo-500/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TokenETH size={20} variant="branded" />
                </div>
                <div>
                    <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Dominância ETH</p>
                    <div className="w-full bg-[var(--bg-tertiary)] h-1.5 rounded-full mt-1 overflow-hidden w-24">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${marketData.ethDominance}%` }} />
                    </div>
                    <span className="text-sm font-bold text-[var(--text-primary)] mt-1 block">{marketData.ethDominance.toFixed(1)}%</span>
                </div>
            </div>
        </div>
    );
}
