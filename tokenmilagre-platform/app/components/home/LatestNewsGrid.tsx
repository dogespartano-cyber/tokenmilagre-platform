/**
 * @module home/LatestNewsGrid
 * @description Grid de últimas notícias
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
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

/**
 * Retorna cor baseado no sentimento
 */
const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
        case 'positive': return '#10B981';
        case 'negative': return '#EF4444';
        default: return '#F59E0B';
    }
};

/**
 * Retorna label baseado no sentimento
 */
const getSentimentLabel = (sentiment: string): string => {
    switch (sentiment) {
        case 'positive': return 'Positivo';
        case 'negative': return 'Negativo';
        default: return 'Neutro';
    }
};

export function LatestNewsGrid({ news }: LatestNewsGridProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    Últimas Notícias
                </h2>
                <Link href="/noticias" className="text-sm font-semibold hover:underline" style={{ color: 'var(--brand-primary)' }}>
                    Ver todas
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {news.map((item) => (
                    <Link key={item.id} href={`/noticias/${item.slug || item.id}`} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                                {item.category[0]}
                            </span>
                            <span className="text-xs text-[var(--text-tertiary)]">
                                {getTimeAgo(item.publishedAt)}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 line-clamp-2 text-[var(--text-primary)]">
                            {item.title}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
                            {item.summary}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-semibold">
                            <span className="flex items-center gap-1" style={{ color: getSentimentColor(item.sentiment) }}>
                                <FontAwesomeIcon icon={getSentimentIcon(item.sentiment)} />
                                {getSentimentLabel(item.sentiment)}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
