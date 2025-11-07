/**
 * Seção de Notícias da Homepage
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface Props {
  news: NewsItem[];
  loading?: boolean;
}

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'text-green-500';
    case 'negative':
      return 'text-red-500';
    default:
      return 'text-yellow-500';
  }
};

const getSentimentEmoji = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return '🟢';
    case 'negative':
      return '🔴';
    default:
      return '🟡';
  }
};

export default function NewsSection({ news, loading }: Props) {
  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Últimas Notícias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-20 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[var(--bg-secondary)]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            Últimas Notícias
          </h2>
          <Link
            href="/dashboard/noticias"
            className="text-[var(--brand-primary)] hover:text-[var(--brand-hover)] flex items-center gap-2 transition-colors"
          >
            Ver todas <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.slice(0, 4).map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/noticias/${item.slug || item.id}`}
              className="block bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-light)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">
                  {getSentimentEmoji(item.sentiment)}
                </span>
                <span className={`text-sm font-medium ${getSentimentColor(item.sentiment)}`}>
                  {item.sentiment}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 line-clamp-2">
                {item.title}
              </h3>

              <p className="text-[var(--text-tertiary)] text-sm line-clamp-3 mb-4">
                {item.summary}
              </p>

              <p className="text-xs text-[var(--text-tertiary)]">
                {new Date(item.publishedAt).toLocaleDateString('pt-BR')}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
