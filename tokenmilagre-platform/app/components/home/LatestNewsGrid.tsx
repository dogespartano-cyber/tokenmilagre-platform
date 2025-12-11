/**
 * @module home/LatestNewsGrid
 * @description Grid de últimas notícias
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
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
                <Link href="/noticias" className="text-sm font-semibold hover:text-[var(--brand-primary)] transition-colors text-[var(--text-tertiary)]">
                    Ver Arquivo
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => {
                    const isFeatured = index === 0;

                    return (
                        <Link
                            key={item.id}
                            href={`/noticias/${item.slug || item.id}`}
                            className={`
                                group relative rounded-3xl overflow-hidden
                                ${isFeatured ? 'md:col-span-2 lg:col-span-2 min-h-[300px] zenith-featured' : 'zenith-card min-h-[240px]'}
                            `}
                        >
                            {/* Inner padding container */}
                            <div className={`${isFeatured ? 'p-8' : 'p-6'} h-full flex flex-col justify-between relative z-10`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${isFeatured ? 'bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--brand-primary)]' : 'bg-[var(--bg-tertiary)] border-[var(--border-light)] text-[var(--text-secondary)]'}`}>
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

                            {/* Background glow for featured */}
                            {isFeatured && (
                                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[var(--brand-primary)]/10 blur-[80px] rounded-full pointer-events-none" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
