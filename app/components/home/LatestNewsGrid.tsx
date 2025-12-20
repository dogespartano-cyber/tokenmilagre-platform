/**
 * @module home/LatestNewsGrid
 * @description Grid de últimas notícias
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import type { NewsItem } from './types';
import ZenithCard from '@/components/ui/ZenithCard';

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
                <Link
                    href="/noticias"
                    className="group inline-flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
                    title="Ver Todas as Notícias"
                >
                    <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)] group-hover:scale-110 transition-transform">
                        <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                    </div>
                    <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                        Últimas Notícias
                    </h2>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => {
                    const isFeatured = index === 0;

                    // Mapeamento de variantes baseado no sentimento
                    const variantMap: Record<string, 'success' | 'danger' | 'warning' | 'default'> = {
                        positive: 'success',
                        negative: 'danger',
                        neutral: 'warning',
                    };
                    const variant = variantMap[item.sentiment] || 'default';

                    // Estilos de badge internos (podem ser movidos para componente separado no futuro)
                    let sentimentBorder = '';
                    let sentimentGlow = '';

                    if (item.sentiment === 'positive') {
                        sentimentBorder = 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20';
                        sentimentGlow = 'bg-green-500/20';
                    } else if (item.sentiment === 'negative') {
                        sentimentBorder = 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20';
                        sentimentGlow = 'bg-red-500/20';
                    } else if (item.sentiment === 'neutral') {
                        sentimentBorder = 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20';
                        sentimentGlow = 'bg-yellow-500/20';
                    }

                    return (
                        <ZenithCard
                            key={item.id}
                            as={Link}
                            href={`/noticias/${item.slug || item.id}`}
                            variant={variant}
                            className={`
                                ${isFeatured ? 'md:col-span-2 lg:col-span-2 min-h-[300px]' : 'min-h-[240px]'}
                            `}
                        >
                            {/* Inner padding container */}
                            <div className={`${isFeatured ? 'p-2' : ''} h-full flex flex-col justify-between relative z-10`}>
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
                        </ZenithCard>
                    )
                })}
            </div>
        </div>
    );
}
