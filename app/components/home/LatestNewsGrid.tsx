/**
 * @module home/LatestNewsGrid
 * @description Grid de últimas notícias
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import type { NewsItem } from './types';

interface LatestNewsGridProps {
    news: NewsItem[];
}

/**
 * Retorna o tempo relativo desde a publicação
 */
const getTimeAgo = (date: string): string => {
    const now = new Date();
    const published = new Date(date);
    const diffMs = now.getTime() - published.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `Há ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Há ${diffDays}d`;
};

export function LatestNewsGrid({ news }: LatestNewsGridProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-primary)]">
                    Últimas Notícias
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => {
                    const isFeatured = index === 0;

                    // Definir estilo baseado no sentimento
                    let cardStyle = isFeatured ? 'zenith-featured' : 'zenith-card';
                    let sentimentBorder = '';
                    let sentimentGlow = '';

                    if (item.sentiment === 'positive') {
                        cardStyle = 'bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 hover:shadow-xl hover:shadow-green-500/10';
                        sentimentBorder = 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
                        sentimentGlow = 'bg-green-500/20';
                    } else if (item.sentiment === 'negative') {
                        cardStyle = 'bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-500/20 hover:shadow-xl hover:shadow-red-500/10';
                        sentimentBorder = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
                        sentimentGlow = 'bg-red-500/20';
                    } else if (item.sentiment === 'neutral') {
                        cardStyle = 'bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/10';
                        sentimentBorder = 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
                        sentimentGlow = 'bg-yellow-500/20';
                    }

                    return (
                        <Link
                            key={item.id}
                            href={`/noticias/${item.slug || item.id}`}
                            className={`
                                group relative rounded-3xl overflow-hidden transition-all duration-300
                                ${isFeatured ? 'md:col-span-2 lg:col-span-2 min-h-[300px]' : 'min-h-[240px]'}
                                ${cardStyle}
                            `}
                        >
                            {/* Inner padding container */}
                            <div className={`${isFeatured ? 'p-8' : 'p-6'} h-full flex flex-col justify-between relative z-10`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${(item.sentiment === 'positive' || item.sentiment === 'negative' || item.sentiment === 'neutral')
                                        ? sentimentBorder
                                        : (isFeatured ? 'bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--brand-primary)]' : 'bg-[var(--bg-tertiary)] border-[var(--border-light)] text-[var(--text-secondary)]')
                                        }`}>
                                        {item.category[0]}
                                    </div>
                                    <span className="text-xs text-[var(--text-muted)] font-mono">{getTimeAgo(item.publishedAt)}</span>
                                </div>

                                <div className="space-y-3">
                                    <h3 className={`font-bold font-[family-name:var(--font-poppins)] text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors ${isFeatured ? 'text-3xl leading-tight' : 'text-xl'}`}>
                                        {item.title}
                                    </h3>
                                    <p className={`text-[var(--text-secondary)] ${isFeatured ? 'text-lg line-clamp-3' : 'text-sm line-clamp-2'}`}>
                                        {item.summary}
                                    </p>
                                </div>

                                {isFeatured && (
                                    <div className="mt-6 flex items-center gap-2 text-[var(--brand-primary)] font-bold text-sm">
                                        Ler Notícia Completa <FontAwesomeIcon icon={faNewspaper} />
                                    </div>
                                )}
                            </div>

                            {/* Background glow for featured or sentiment */}
                            {isFeatured && (
                                <div className={`absolute -bottom-20 -right-20 w-64 h-64 blur-[80px] rounded-full pointer-events-none ${(item.sentiment === 'positive' || item.sentiment === 'negative' || item.sentiment === 'neutral') ? sentimentGlow : 'bg-[var(--brand-primary)]/10'
                                    }`} />
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
