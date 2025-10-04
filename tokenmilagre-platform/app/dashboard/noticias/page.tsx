'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
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

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
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
  };

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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '🟢';
      case 'negative': return '🔴';
      default: return '🟡';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-3 font-[family-name:var(--font-poppins)]">
            📰 Notícias Cripto
          </h1>
          <p className="text-white/70 text-lg">
            Resumos inteligentes das principais notícias do mercado
          </p>
          <p className="text-white/50 text-sm mt-2">
            ✨ Powered by Claude AI
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
          <h3 className="text-white font-bold text-lg mb-4">Filtrar por categoria:</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
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
            <p className="text-white text-xl">Carregando notícias...</p>
          </div>
        )}

        {/* News Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl hover:shadow-2xl transition-all hover:scale-105 group"
              >
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getSentimentIcon(item.sentiment)}</span>
                    <span className="text-white/60 text-sm">{item.source}</span>
                  </div>
                  <span className="text-white/50 text-xs">{getTimeAgo(item.publishedAt)}</span>
                </div>

                {/* Título */}
                <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 group-hover:text-yellow-300 transition">
                  {item.title}
                </h3>

                {/* Resumo */}
                <p className="text-white/70 text-sm mb-4 line-clamp-3">
                  {item.summary}
                </p>

                {/* Keywords */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.keywords.slice(0, 3).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80"
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
                      className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-300/30 rounded-lg text-xs text-white font-semibold"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold text-sm transition"
                >
                  Ler notícia completa
                  <span>→</span>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && news.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-white text-xl">Nenhuma notícia encontrada</p>
            <p className="text-white/60 mt-2">Tente selecionar outra categoria</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-blue-300/30 shadow-xl">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🤖</span>
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Sobre os Resumos</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Todas as notícias são automaticamente resumidas e classificadas pela <strong>IA Claude</strong>.
                Os resumos destacam os pontos principais, categorizam por tema e analisam o sentimento
                (positivo, neutro ou negativo) para você tomar decisões informadas rapidamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
