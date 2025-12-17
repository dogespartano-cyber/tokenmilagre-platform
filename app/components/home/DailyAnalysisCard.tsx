/**
 * @module home/DailyAnalysisCard
 * @description Card de análise diária do mercado
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowUp, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { TokenBTC, TokenETH } from '@token-icons/react';
import type { DailyAnalysisProps } from './types';

/**
 * Retorna ícone baseado no sentimento
 */
const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
        case 'positive': return faArrowUp;
        case 'negative': return faArrowRight;
        default: return faCheckCircle;
    }
};

export function DailyAnalysisCard({ dailyAnalysis, marketData }: DailyAnalysisProps) {
    if (!dailyAnalysis) return null;

    return (
        <div className="group relative p-6 rounded-2xl crystal-card overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                        📊 Análise do Dia <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-zinc-500/10 dark:backdrop-blur-none text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-500/20 font-normal">AI Powered</span>
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
            <Link href={`/noticias/${dailyAnalysis.slug || dailyAnalysis.id}`}>
                <h4 className="text-xl font-bold mb-3 line-clamp-2 transition-colors cursor-pointer hover:underline decoration-zinc-500/50"
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
                    <div className="p-3 rounded-lg bg-white dark:bg-zinc-500/5 dark:backdrop-blur-sm border border-zinc-200 dark:border-zinc-500/10">
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
                    <div className="p-3 rounded-lg bg-white dark:bg-zinc-500/5 dark:backdrop-blur-sm border border-zinc-200 dark:border-zinc-500/10">
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
                    <div className="p-3 rounded-lg bg-white dark:bg-zinc-500/5 dark:backdrop-blur-sm border border-zinc-200 dark:border-zinc-500/10">
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
                href={`/noticias/${dailyAnalysis.slug || dailyAnalysis.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all bg-white dark:bg-zinc-500/10 hover:bg-zinc-50 dark:hover:bg-zinc-500/20 text-[var(--text-primary)] border border-zinc-200 dark:border-zinc-500/20 hover:shadow-lg"
            >
                <span>Ler Análise Completa</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
            </Link>
        </div>
    );
}
