'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

export default function ArtigoPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [params.id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/news`);
      const data = await response.json();

      if (data.success) {
        const foundArticle = data.data.find((item: NewsItem) => item.id === params.id);
        if (foundArticle) {
          setArticle(foundArticle);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar artigo:', error);
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

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '🟢';
      case 'negative': return '🔴';
      default: return '🟡';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="text-6xl mb-4 animate-pulse">📰</div>
          <p className="text-white text-xl">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-white text-xl mb-4">Artigo não encontrado</p>
          <button
            onClick={() => router.push('/dashboard/noticias')}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-bold rounded-xl hover:scale-105 transition"
          >
            ← Voltar para Notícias
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Botão Voltar */}
      <button
        onClick={() => router.push('/dashboard/noticias')}
        className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex items-center gap-2"
      >
        <span>←</span> Voltar para Notícias
      </button>

      {/* Header do Artigo */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl mb-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl">{getSentimentIcon(article.sentiment)}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-white/70 font-semibold">{article.source}</span>
              <span className="text-white/50">•</span>
              <span className="text-white/50 text-sm">{getTimeAgo(article.publishedAt)}</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {article.title}
        </h1>

        <p className="text-white/70 text-lg mb-6">
          {article.summary}
        </p>

        {/* Categorias */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.category.map((cat, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-300/30 rounded-lg text-sm text-white font-semibold"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2">
          {article.keywords.map((keyword, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80"
            >
              #{keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Conteúdo do Artigo */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl">
        <article className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold text-white mt-6 mb-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-white/80 mb-4 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 text-white/80 space-y-2">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="text-white/80">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="text-white font-bold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-yellow-300">{children}</em>
              ),
            }}
          >
            {article.content || 'Conteúdo não disponível.'}
          </ReactMarkdown>
        </article>

        {/* Fonte Original */}
        <div className="mt-8 pt-6 border-t-2 border-white/20">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition"
          >
            Ver fonte original ({article.source})
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
