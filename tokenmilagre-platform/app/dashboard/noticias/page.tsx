'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  source: string;
  sources?: string[];
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  factChecked?: boolean;
  lastVerified?: string;
}

export default function NoticiasPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Todas', icon: '📰' },
    { id: 'bitcoin', label: 'Bitcoin', icon: '₿' },
    { id: 'ethereum', label: 'Ethereum', icon: 'Ξ' },
    { id: 'solana', label: 'Solana', icon: '◎' },
    { id: 'defi', label: 'DeFi', icon: '🏦' },
    { id: 'nfts', label: 'NFTs', icon: '🎨' },
    { id: 'regulação', label: 'Regulação', icon: '⚖️' },
  ];

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/news?category=${selectedCategory}`);
      const data = await response.json();
      if (data.success) {
        setNews(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const published = new Date(date);
    const diffMs = now.getTime() - published.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `Há ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Há ${diffDays}d`;
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '🟢';
      case 'negative': return '🔴';
      default: return '🟡';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Notícia otimista';
      case 'negative': return 'Notícia pessimista';
      default: return 'Notícia neutra';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
            📰 Notícias Cripto
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Resumos inteligentes das principais notícias do mercado
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}>
          <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Filtrar por categoria:</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900'
                    : ''
                }`}
                style={selectedCategory !== cat.id ? {
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)'
                } : undefined}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-pulse">📰</div>
            <p className="text-xl" style={{ color: 'var(--text-primary)' }}>Carregando notícias...</p>
          </div>
        )}

        {/* News Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <Link
                key={index}
                href={`/dashboard/noticias/${item.slug || item.id}`}
                className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105 group cursor-pointer block"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}
              >
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getSentimentIcon(item.sentiment)}</span>
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{getSentimentLabel(item.sentiment)}</span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{getTimeAgo(item.publishedAt)}</span>
                </div>

                {/* Título */}
                <h3 className="font-bold text-lg mb-3 line-clamp-2 transition" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>

                {/* Resumo */}
                <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                  {item.summary}
                </p>

                {/* Keywords */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.keywords.slice(0, 3).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-lg text-xs"
                      style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* Categorias */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.category.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-300/30 rounded-lg text-xs font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Link Leia Mais */}
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold transition" style={{ color: 'var(--brand-primary)' }}>
                    Leia mais
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && news.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl" style={{ color: 'var(--text-primary)' }}>Nenhuma notícia encontrada</p>
            <p className="mt-2" style={{ color: 'var(--text-tertiary)' }}>Tente selecionar outra categoria</p>
          </div>
        )}
      </div>
    </div>
  );
}
