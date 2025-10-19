'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { NewsGridSkeleton } from '@/components/SkeletonLoader';

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
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Capturar parâmetro de busca da URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    }
  }, []);

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
      // Buscar artigos do banco de dados
      const articlesRes = await fetch(`/api/articles?category=${selectedCategory}`);
      const articlesData = await articlesRes.json();

      const allItems: NewsItem[] = articlesData.success ? articlesData.data : [];

      // Ordenar por data (mais recente primeiro)
      allItems.sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return dateB - dateA;
      });

      setNews(allItems);
      setFilteredNews(allItems);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Filtrar e ordenar notícias
  useEffect(() => {
    let filtered = [...news];

    // Filtro por termo de busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.summary.toLowerCase().includes(term) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(term))
      );
    }

    // Filtro por sentimento
    if (selectedSentiment !== 'all') {
      filtered = filtered.filter(item => item.sentiment === selectedSentiment);
    }

    // Ordenação
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    setFilteredNews(filtered);
  }, [searchTerm, news, selectedSentiment, sortBy]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedSentiment('all');
    setSortBy('newest');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== 'all') count++;
    if (selectedSentiment !== 'all') count++;
    if (sortBy !== 'newest') count++;
    return count;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-3 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              📰 Notícias Cripto
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Resumos inteligentes das principais notícias do mercado
            </p>
          </div>

          {/* Community Buttons */}
          <div className="flex gap-3">
            <a
              href="https://discord.gg/skaX8bFY"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #5865F2, #4752C4)',
                color: 'white'
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Discord</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>

            <a
              href="https://t.me/+Bop_TVFc_mg3Njlh"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #0088cc, #006699)',
                color: 'white'
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21l-1.446 1.394c-.14.18-.357.295-.6.295c-.002 0-.003 0-.005 0l.213-3.054l5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
              <span>Telegram</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        {/* Filtros */}
        <div className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              🔍 Busca e Filtros
              {getActiveFiltersCount() > 0 && (
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-bold">
                  {getActiveFiltersCount()}
                </span>
              )}
            </h3>
            <div className="flex items-center gap-3">
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-semibold transition-colors hover:scale-105"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  Limpar tudo
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-4 py-2 rounded-xl font-semibold transition-all"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
              </button>
            </div>
          </div>

          {/* Campo de Busca */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar notícias por título, resumo ou palavra-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-medium)',
                  color: 'var(--text-primary)'
                }}
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: 'var(--text-tertiary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Limpar busca"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {filteredNews.length} {filteredNews.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            )}
          </div>

          {/* Filtros Avançados */}
          <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Categorias e Filtro */}
            <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
              {/* Categorias */}
              <div>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>Categorias:</h4>
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

              {/* Menu Combinado - Filtrar e Ordenar */}
              <div>
                <label className="block font-semibold mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Filtrar e Ordenar:
                </label>
                <select
                  value={`${sortBy}-${selectedSentiment}`}
                  onChange={(e) => {
                    const [sort, sentiment] = e.target.value.split('-');
                    setSortBy(sort as typeof sortBy);
                    setSelectedSentiment(sentiment);
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary font-semibold cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <optgroup label="Ordenação">
                    <option value="newest-all">🆕 Mais Recentes</option>
                    <option value="oldest-all">⏰ Mais Antigas</option>
                    <option value="alphabetical-all">🔤 Alfabética (A-Z)</option>
                  </optgroup>
                  <optgroup label="Sentimento">
                    <option value="newest-positive">🟢 Positivo</option>
                    <option value="newest-neutral">🟡 Neutro</option>
                    <option value="newest-negative">🔴 Negativo</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Filtros Ativos */}
            {getActiveFiltersCount() > 0 && (
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>Filtros ativos:</h4>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="px-3 py-1 rounded-lg text-sm flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/30" style={{ color: 'var(--text-primary)' }}>
                      🔍 &quot;{searchTerm}&quot;
                      <button onClick={() => setSearchTerm('')} className="hover:scale-110 transition-transform">✕</button>
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="px-3 py-1 rounded-lg text-sm flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/30" style={{ color: 'var(--text-primary)' }}>
                      {categories.find(c => c.id === selectedCategory)?.icon} {categories.find(c => c.id === selectedCategory)?.label}
                      <button onClick={() => setSelectedCategory('all')} className="hover:scale-110 transition-transform">✕</button>
                    </span>
                  )}
                  {selectedSentiment !== 'all' && (
                    <span className="px-3 py-1 rounded-lg text-sm flex items-center gap-2 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 border border-blue-400/30" style={{ color: 'var(--text-primary)' }}>
                      {selectedSentiment === 'positive' ? '🟢 Positivo' : selectedSentiment === 'neutral' ? '🟡 Neutro' : '🔴 Negativo'}
                      <button onClick={() => setSelectedSentiment('all')} className="hover:scale-110 transition-transform">✕</button>
                    </span>
                  )}
                  {sortBy !== 'newest' && (
                    <span className="px-3 py-1 rounded-lg text-sm flex items-center gap-2 bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30" style={{ color: 'var(--text-primary)' }}>
                      {sortBy === 'oldest' ? '⏰ Mais Antigas' : '🔤 Alfabética'}
                      <button onClick={() => setSortBy('newest')} className="hover:scale-110 transition-transform">✕</button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resultado da Busca */}
        {!loading && (
          <div className="flex items-center justify-between px-4">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Mostrando {filteredNews.length} de {news.length} notícias
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-8">
            <div className="text-center py-4">
              <div className="text-4xl mb-2 animate-pulse">📰</div>
              <p className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>Carregando notícias...</p>
            </div>
            <NewsGridSkeleton count={9} />
          </div>
        )}

        {/* News Grid */}
        {!loading && filteredNews.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item, index) => (
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

                {/* Keywords - Clicáveis */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.keywords.slice(0, 3).map((keyword, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleTagClick(keyword);
                      }}
                      className="px-2 py-1 rounded-lg text-xs transition-all hover:scale-105 hover:shadow-md cursor-pointer hover:bg-gradient-to-r hover:from-yellow-400/20 hover:to-amber-500/20"
                      style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}
                      title={`🔍 Buscar por: ${keyword}`}
                    >
                      #{keyword}
                    </button>
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
        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">
              {searchTerm ? '🔍' : '📭'}
            </div>
            <p className="text-xl" style={{ color: 'var(--text-primary)' }}>
              {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhuma notícia encontrada'}
            </p>
            <p className="mt-2" style={{ color: 'var(--text-tertiary)' }}>
              {searchTerm
                ? `Nenhuma notícia corresponde a "${searchTerm}". Tente buscar por outros termos.`
                : 'Tente selecionar outra categoria'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 hover:shadow-lg transition-all"
              >
                Limpar busca
              </button>
            )}
          </div>
        )}

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2"
            style={{
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
              borderColor: 'var(--brand-primary)',
              color: 'var(--text-inverse)'
            }}
            aria-label="Voltar ao topo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
