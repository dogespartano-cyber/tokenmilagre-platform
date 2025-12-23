/**
 * @module home/LatestNewsGrid
 * @description Grid de últimas notícias (Consome NewsTimeline para padronização)
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { NewsItem } from './types';
import NewsTimeline from '@/components/news/NewsTimeline';

interface LatestNewsGridProps {
    news: NewsItem[];
}

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

            {/* Usando NewsTimeline para padronização visual com /noticias */}
            <div className="-mx-4 md:mx-0">
                <NewsTimeline items={news} />
            </div>
        </div>
    );
}
