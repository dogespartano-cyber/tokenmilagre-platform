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
            {/* 1. Global Market Cap - Blue/Indigo */}
            <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 cursor-default">
                <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-indigo-500" style={{ boxShadow: '0 0 20px #3b82f640' }} />

                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110">
                        <FontAwesomeIcon icon={faGlobe} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Capitalização</p>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[var(--text-primary)] font-mono">{formatNumber(marketData.totalMarketCap)}</span>
                            <span className={`text-xs font-bold ${marketData.marketCapChange24h >= 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'} flex items-center gap-1`}>
                                {marketData.marketCapChange24h >= 0 ? '+' : ''}{marketData.marketCapChange24h.toFixed(1)}%
                                <span className="opacity-60 text-[10px] font-normal text-[var(--text-tertiary)]">24h</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 24h Volume - Green/Emerald */}
            <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10 cursor-default">
                <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-green-500 to-emerald-500" style={{ boxShadow: '0 0 20px #10b98140' }} />

                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-green-500/10 rounded-xl text-green-600 dark:text-green-400 transition-transform duration-300 group-hover:scale-110">
                        <FontAwesomeIcon icon={faChartLine} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Volume 24h</p>
                        <span className="text-lg font-bold text-[var(--text-primary)] font-mono">{formatNumber(marketData.totalVolume)}</span>
                    </div>
                </div>
            </div>

            {/* 3. BTC Dominance - Orange/Amber */}
            <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 cursor-default">
                <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-500 to-amber-500" style={{ boxShadow: '0 0 20px #f9731640' }} />

                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500/10 rounded-xl transition-transform duration-300 group-hover:scale-110">
                        <TokenBTC size={20} variant="branded" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Dom. BTC</p>
                            <span className="text-xs font-bold text-[var(--text-primary)]">{marketData.btcDominance.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-[var(--bg-tertiary)] h-1.5 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full rounded-full" style={{ width: `${marketData.btcDominance}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. ETH Dominance - Indigo/Purple */}
            <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 cursor-default">
                <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-500 to-purple-500" style={{ boxShadow: '0 0 20px #6366f140' }} />

                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl transition-transform duration-300 group-hover:scale-110">
                        <TokenETH size={20} variant="branded" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Dom. ETH</p>
                            <span className="text-xs font-bold text-[var(--text-primary)]">{marketData.ethDominance.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-[var(--bg-tertiary)] h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${marketData.ethDominance}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
