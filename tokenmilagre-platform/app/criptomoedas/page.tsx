'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faNewspaper, faClock } from '@fortawesome/free-solid-svg-icons';
import CustomCryptoScreener from '@/components/CustomCryptoScreener';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

export default function CriptomoedasPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);

  // Forçar scroll para o topo ao montar (fix para bug de scroll)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Buscar notícias
  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      try {
        const response = await fetch('/api/news');
        const result = await response.json();

        if (result.success) {
          // Limitar a 6 notícias
          setNews(result.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, []);

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Há ${diffMins}min`;
    if (diffHours < 24) return `Há ${diffHours}h`;
    return `Há ${diffDays}d`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#22c55e';
      case 'negative': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Positiva';
      case 'negative': return 'Negativa';
      default: return 'Neutra';
    }
  };



  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-16">
          {/* Rastreador de Mercado */}
          <div className="space-y-8">
            <div
              className="rounded-2xl overflow-hidden shadow-lg border"
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'var(--bg-elevated)',
              }}
            >
              <CustomCryptoScreener />
            </div>

            {/* Notícias Relacionadas */}
            {!loadingNews && news.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={faNewspaper}
                    className="w-6 h-6"
                    style={{ color: 'var(--brand-primary)' }}
                  />
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Notícias Relacionadas sobre Criptomoedas
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {news.map((newsItem) => (
                    <Link
                      key={newsItem.id}
                      href={newsItem.url}
                      className="group rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--border-light)',
                      }}
                    >
                      {/* Header: Category + Sentiment */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-bold"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {newsItem.category[0]}
                        </span>
                        <span
                          className="px-2 py-1 rounded text-xs font-bold"
                          style={{
                            backgroundColor: `${getSentimentColor(newsItem.sentiment)}20`,
                            color: getSentimentColor(newsItem.sentiment),
                          }}
                        >
                          {getSentimentLabel(newsItem.sentiment)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-lg font-bold mb-2 line-clamp-2 group-hover:underline"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {newsItem.title}
                      </h3>

                      {/* Summary */}
                      <p
                        className="text-sm mb-4 line-clamp-2"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {newsItem.summary}
                      </p>

                      {/* Footer: Time + Arrow */}
                      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                          {getTimeAgo(newsItem.publishedAt)}
                        </div>
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="w-4 h-4 transition-transform group-hover:translate-x-1"
                          style={{ color: 'var(--brand-primary)' }}
                        />
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Ver mais notícias */}
                <div>
                  <Link
                    href="/dashboard/noticias"
                    className="inline-flex items-center gap-2 font-semibold transition-all hover:gap-3"
                    style={{
                      color: 'var(--brand-primary)',
                    }}
                  >
                    Ver todas as notícias
                    <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
}
