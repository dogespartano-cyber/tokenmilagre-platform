'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { NewsGridSkeleton } from '@/components/SkeletonLoader';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faClock, faArrowRight, faArrowUp } from '@fortawesome/free-solid-svg-icons';

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

// Helper functions for card styling (baseado em sentimento)
const getSentimentGradient = (sentiment: 'positive' | 'neutral' | 'negative') => {
  switch(sentiment) {
    case 'positive': return 'rgba(34, 197, 94, 0.08)';  // Verde
    case 'negative': return 'rgba(239, 68, 68, 0.08)';  // Vermelho
    case 'neutral': return 'rgba(234, 179, 8, 0.08)';   // Amarelo
    default: return 'rgba(100, 116, 139, 0.05)';
  }
};

const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative') => {
  switch(sentiment) {
    case 'positive': return '#22c55e';
    case 'negative': return '#ef4444';
    case 'neutral': return '#eab308';
    default: return '#64748b';
  }
};

const getSentimentIcon = (sentiment: 'positive' | 'neutral' | 'negative') => {
  switch(sentiment) {
    case 'positive': return '🟢';
    case 'negative': return '🔴';
    case 'neutral': return '🟡';
    default: return '⚪';
  }
};

const getSentimentLabel = (sentiment: 'positive' | 'neutral' | 'negative') => {
  switch(sentiment) {
    case 'positive': return 'Positivo';
    case 'negative': return 'Negativo';
    case 'neutral': return 'Neutro';
    default: return 'Neutro';
  }
};

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

  // Estados de paginação para infinite scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

  const fetchNews = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      // Buscar artigos do banco de dados com paginação
      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      const url = `/api/articles?type=news&page=${pageNum}&limit=12${categoryParam}`;

      const articlesRes = await fetch(url);
      const articlesData = await articlesRes.json();

      if (articlesData.success) {
        const newItems: NewsItem[] = articlesData.data;
        const { hasMore: moreAvailable } = articlesData.pagination;

        if (append) {
          // Adicionar aos artigos existentes (infinite scroll)
          setNews(prev => [...prev, ...newItems]);
          setFilteredNews(prev => [...prev, ...newItems]);
        } else {
          // Substituir artigos (primeira carga ou mudança de filtro)
          setNews(newItems);
          setFilteredNews(newItems);
        }

        setHasMore(moreAvailable);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [selectedCategory]);

  // Carregar mais artigos (infinite scroll)
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchNews(page + 1, true);
    }
  }, [page, hasMore, isLoadingMore, fetchNews]);

  // Resetar paginação e carregar primeira página quando categoria mudar
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setNews([]);
    setFilteredNews([]);
    fetchNews(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Hook de infinite scroll
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMore,
    threshold: 300
  });

  // Filtrar e ordenar notícias
  useEffect(() => {
    let filtered = [...news];

    // Filtro por termo de busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.summary.toLowerCase().includes(term) ||
        (item.keywords || []).some(keyword => keyword.toLowerCase().includes(term))
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
        {/* Filtros */}
        <div className="backdrop-blur-lg rounded-2xl p-6 border shadow-md" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-light)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              Busca e Filtros
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
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: 'var(--text-tertiary)' }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Limpar busca"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
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
                      className={`px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg ${
                        selectedCategory === cat.id
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900'
                          : 'hover:opacity-80'
                      }`}
                      style={selectedCategory !== cat.id ? {
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)'
                      } : undefined}
                    >
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
                    <option value="newest-all">Mais Recentes</option>
                    <option value="oldest-all">Mais Antigas</option>
                    <option value="alphabetical-all">Alfabética (A-Z)</option>
                  </optgroup>
                  <optgroup label="Sentimento">
                    <option value="newest-positive">Positivo</option>
                    <option value="newest-neutral">Neutro</option>
                    <option value="newest-negative">Negativo</option>
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
                      {categories.find(c => c.id === selectedCategory)?.label}
                      <button onClick={() => setSelectedCategory('all')} className="hover:scale-110 transition-transform">✕</button>
                    </span>
                  )}
                  {selectedSentiment !== 'all' && (
                    <span className="px-3 py-1 rounded-lg text-sm flex items-center gap-2 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 border border-blue-400/30" style={{ color: 'var(--text-primary)' }}>
                      {selectedSentiment === 'positive' ? 'Positivo' : selectedSentiment === 'neutral' ? 'Neutro' : 'Negativo'}
                      <button onClick={() => setSelectedSentiment('all')} className="hover:scale-110 transition-transform">✕</button>
                    </span>
                  )}
                  {sortBy !== 'newest' && (
                    <span className="px-3 py-1 rounded-lg text-sm flex items-center gap-2 bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30" style={{ color: 'var(--text-primary)' }}>
                      {sortBy === 'oldest' ? 'Mais Antigas' : 'Alfabética'}
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
                className="group block rounded-3xl p-8 border-2 shadow-lg relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                  borderColor: 'var(--border-light)',
                  minHeight: '380px'
                }}
              >
                {/* Glow sutil no topo no hover - Efeito Neon */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${
                      item.sentiment === 'positive' ? '#22c55e' :
                      item.sentiment === 'negative' ? '#ef4444' :
                      '#eab308'
                    }, transparent)`,
                    boxShadow: `0 0 20px ${
                      item.sentiment === 'positive' ? '#22c55e' :
                      item.sentiment === 'negative' ? '#ef4444' :
                      '#eab308'
                    }40`
                  }}
                />

                {/* Número decorativo do índice */}
                <div className="absolute -top-4 -right-4 text-9xl font-black opacity-5 select-none" style={{
                  color: item.sentiment === 'positive' ? '#22c55e' : item.sentiment === 'negative' ? '#ef4444' : '#eab308'
                }}>
                  {index + 1}
                </div>

                {/* Conteúdo */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Header - Sentimento e Badges em linha */}
                  <div className="flex items-center gap-3 mb-6">
                    {/* Badge de Sentimento - Compacto */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm" style={{
                      background: `linear-gradient(135deg, ${
                        item.sentiment === 'positive' ? '#22c55e' :
                        item.sentiment === 'negative' ? '#ef4444' :
                        '#eab308'
                      }, ${
                        item.sentiment === 'positive' ? '#16a34a' :
                        item.sentiment === 'negative' ? '#dc2626' :
                        '#d97706'
                      })`,
                      color: 'white'
                    }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                      <span className="uppercase tracking-wide">
                        {item.sentiment === 'positive' ? 'Positivo' : item.sentiment === 'negative' ? 'Negativo' : 'Neutro'}
                      </span>
                    </div>

                    {/* Tempo - Compacto */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ml-auto" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)'
                    }}>
                      <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" />
                      {getTimeAgo(item.publishedAt)}
                    </div>
                  </div>

                  {/* Título - Grande e Destacado */}
                  <h3 className="font-black text-2xl mb-4 leading-tight line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>

                  {/* Resumo - Maior e mais legível */}
                  <p className="text-base leading-relaxed mb-4 line-clamp-3 flex-grow" style={{ color: 'var(--text-secondary)' }}>
                    {item.summary}
                  </p>

                  {/* Keywords - Clicáveis */}
                  {(item.keywords || []).length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {(item.keywords || []).slice(0, 3).map((keyword, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleTagClick(keyword);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all hover:scale-105 hover:shadow-md cursor-pointer"
                            style={{
                              backgroundColor: 'var(--bg-secondary)',
                              borderColor: 'var(--border-light)',
                              color: 'var(--text-tertiary)'
                            }}
                            title={`🔍 Buscar por: ${keyword}`}
                          >
                            #{keyword}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA - Botão de Ação */}
                  <div className="flex items-center pt-6 border-t-2" style={{
                    borderColor: 'var(--border-light)'
                  }}>
                    <div className="flex items-center gap-2 text-sm font-bold" style={{
                      color: item.sentiment === 'positive' ? '#22c55e' :
                             item.sentiment === 'negative' ? '#ef4444' :
                             '#eab308'
                    }}>
                      <span>Ler Notícia Completa</span>
                      <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Elemento sentinela para infinite scroll */}
            <div ref={sentinelRef} className="col-span-full h-1" />

            {/* Loader para infinite scroll */}
            {isLoadingMore && (
              <div className="col-span-full flex justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{
                    borderColor: 'var(--brand-primary)',
                    borderTopColor: 'transparent'
                  }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                    Carregando mais notícias...
                  </p>
                </div>
              </div>
            )}

            {/* Indicador de fim da lista */}
            {!hasMore && filteredNews.length > 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  📰 Você visualizou todas as {filteredNews.length} notícias disponíveis
                </p>
              </div>
            )}
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
            <FontAwesomeIcon icon={faArrowUp} className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
