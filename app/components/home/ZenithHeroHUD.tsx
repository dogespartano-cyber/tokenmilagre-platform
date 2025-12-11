/**
 * @module home/ZenithHeroHUD
 * @description Hero HUD unificado para o conceito "Project Zenith"
 * @design System: Cyber-Prosperity (Obsidian/Gold/Neon)
 */
'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBolt, faChartLine, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { TokenBTC, TokenETH } from '@token-icons/react';
import { FearGreedGauge } from './FearGreedGauge';
import type { MarketDataProps, FearGreedProps, DailyAnalysisProps, MarketData, FearGreedData } from './types';

// Combinando tipos para o HUD
interface ZenithHeroHUDProps extends DailyAnalysisProps {
    marketData: MarketData | null;
    fearGreed: FearGreedData | null;
    gaugeValue: number;
}

const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    return `$${(num / 1e6).toFixed(0)}M`;
};

export function ZenithHeroHUD({ marketData, dailyAnalysis, fearGreed, gaugeValue }: ZenithHeroHUDProps) {
    if (!marketData || !fearGreed || !dailyAnalysis) return null;

    // Cores dinâmicas para o Gauge
    const gaugeColor = gaugeValue > 50 ? '#00FF9D' : gaugeValue < 30 ? '#FF4D4D' : '#FFD700';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* MOBILE ONLY: Fear & Greed removed from here (moved to ZenithMarketTicker for correct order) */}

            {/* 1. SENTIMENT MODULE (Col-4) - Widened (Desktop Only - hidden on mobile) */}
            <div className="hidden lg:flex col-span-4 zenith-card rounded-3xl p-6 relative overflow-visible group flex-col justify-center">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                </div>

                <h3 className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-6 text-center">
                    Sentimento do Mercado
                </h3>

                <div className="relative flex flex-col items-center justify-center">
                    {/* SVG Gauge Customizado */}
                    <div className="w-56 h-32 relative">
                        <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
                            {/* Track */}
                            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--bg-tertiary)" strokeWidth="12" strokeLinecap="round" />
                            {/* Active Arc - Dynamic based on value */}
                            <path
                                d="M 20 100 A 80 80 0 0 1 180 100"
                                fill="none"
                                stroke="url(#gaugeGradient)"
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray="251"
                                strokeDashoffset={251 - (251 * gaugeValue) / 100}
                                className="transition-all duration-1000 ease-out"
                            />
                            {/* Needle */}
                            <circle cx="100" cy="100" r="6" fill={gaugeColor} className="shadow-lg" />
                            <path
                                d="M 100 100 L 100 30"
                                stroke={gaugeColor}
                                strokeWidth="4"
                                strokeLinecap="round"
                                className="origin-bottom transition-all duration-1000 ease-elastic"
                                style={{ transform: `rotate(${(gaugeValue * 1.8) - 90}deg)` }}
                            />

                            <defs>
                                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#FF4D4D" />
                                    <stop offset="50%" stopColor="#FFD700" />
                                    <stop offset="100%" stopColor="#00FF9D" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Value Overlay */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-center">
                            <span className="text-5xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-poppins)] tracking-tighter drop-shadow-lg">
                                {gaugeValue}
                            </span>
                        </div>
                    </div>

                    <div className="mt-2 text-center">
                        <span className="text-xl font-medium text-[var(--text-secondary)]">
                            {fearGreed.value_classification}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. CENTER STAGE - DAILY ANALYSIS (Col-8) - Widened */}
            <div className="lg:col-span-8 zenith-card rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-center min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-bg)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badge AI */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <FontAwesomeIcon icon={faBolt} />
                        Análise Diária
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] font-mono">
                        {new Date(dailyAnalysis.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase()}
                    </span>
                </div>

                <Link href={`/noticias/${dailyAnalysis.slug || dailyAnalysis.id}`} className="block group-hover:translate-x-1 transition-transform">
                    <h2 className="text-3xl lg:text-5xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-poppins)] leading-tight mb-4 group-hover:text-[var(--brand-primary)] transition-colors">
                        {dailyAnalysis.title}
                    </h2>
                    <p className="text-[var(--text-secondary)] text-base lg:text-lg leading-relaxed line-clamp-2 mb-6 max-w-2xl">
                        {dailyAnalysis.summary}
                    </p>
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href={`/noticias/${dailyAnalysis.slug || dailyAnalysis.id}`}
                        className="px-6 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-sm hover:bg-[var(--brand-primary)] hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                    >
                        Ler Análise
                        <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
