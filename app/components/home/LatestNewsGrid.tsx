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
          <h2 className="text-2xl title-newtab group-hover:text-[var(--brand-primary)] transition-colors">
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
