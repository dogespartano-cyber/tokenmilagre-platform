/**
 * @module components/zenith/ZenithHeroHUD
 * @description Hero HUD unificado para o conceito "Project Zenith"
 * @design System: Cyber-Prosperity (Obsidian/Gold/Neon)
 */
'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBolt, faChartLine, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { TokenBTC, TokenETH } from '@token-icons/react';
import { FearGreedGauge } from './FearGreedGauge';
import type { MarketDataProps, FearGreedProps, DailyAnalysisProps, MarketData, FearGreedData, NewsItem } from '@/app/components/home/types';

interface ZenithHeroHUDProps {
    marketData: MarketData | null;
    dailyAnalysis: NewsItem | null;
}

export function ZenithHeroHUD({ marketData, dailyAnalysis }: ZenithHeroHUDProps) {
    if (!marketData || !dailyAnalysis) return null;

    return (
        <div className="grid grid-cols-1 gap-6 mb-8">
            {/* 2. CENTER STAGE - DAILY ANALYSIS - Full Width */}
            <div className="zenith-card rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-center min-h-[300px]">
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
                    <h2 className="title-newtab text-3xl lg:text-5xl font-inter leading-tight mb-4 group-hover:text-[var(--brand-primary)] transition-colors">
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
