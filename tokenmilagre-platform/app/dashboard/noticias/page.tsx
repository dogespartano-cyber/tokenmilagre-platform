'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  switch (sentiment) {
    case 'positive': return 'rgba(34, 197, 94, 0.08)';  // Verde
    case 'negative': return 'rgba(239, 68, 68, 0.08)';  // Vermelho
    case 'neutral': return 'rgba(234, 179, 8, 0.08)';   // Amarelo
    default: return 'rgba(100, 116, 139, 0.05)';
  }
};

const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative') => {
  switch (sentiment) {
    case 'positive': return '#22c55e';
    case 'negative': return '#ef4444';
    case 'neutral': return '#eab308';
    default: return '#64748b';
  }
};

const getSentimentIcon = (sentiment: 'positive' | 'neutral' | 'negative') => {
  switch (sentiment) {
    case 'positive': return '🟢';
    case 'negative': return '🔴';
    case 'neutral': return '🟡';
    default: return '⚪';
  }
};

const getSentimentLabel = (sentiment: 'positive' | 'neutral' | 'negative') => {
  switch (sentiment) {
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

  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

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
    <div className="container mx-auto px-4">
      <div className="space-y-8">
        {/* Busca e Filtros */}
        <div className="space-y-6">
          {/* Campo de Busca + Botão Limpar */}
          <div className="flex items-center gap-3 max-w-2xl">
            <div className="relative flex-1">
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

            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-3 rounded-xl font-semibold transition-all hover:opacity-80 whitespace-nowrap"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--brand-primary)' }}
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Categorias */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${selectedCategory === cat.id
                      ? 'shadow-md'
                      : 'hover:opacity-80'
                    }`}
                  style={{
                    backgroundColor: selectedCategory === cat.id ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                    color: selectedCategory === cat.id ? 'var(--text-inverse)' : 'var(--text-secondary)'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-8 w-px" style={{ backgroundColor: 'var(--border-light)' }}></div>

            {/* Select Ordenar/Sentimento */}
            <select
              value={`${sortBy}-${selectedSentiment}`}
              onChange={(e) => {
                const [sort, sentiment] = e.target.value.split('-');
                setSortBy(sort as typeof sortBy);
                setSelectedSentiment(sentiment);
              }}
              className="px-4 py-2 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium cursor-pointer"
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

            {/* Contador */}
            <div className="ml-auto">
              <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                {filteredNews.length} {filteredNews.length === 1 ? 'notícia' : 'notícias'}
              </p>
            </div>
          </div>
        </div>

        {/* News Grid */}
        {!loading && (
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
                    background: `linear-gradient(90deg, transparent, ${item.sentiment === 'positive' ? '#22c55e' :
                        item.sentiment === 'negative' ? '#ef4444' :
                          '#eab308'
                      }, transparent)`,
                    boxShadow: `0 0 20px ${item.sentiment === 'positive' ? '#22c55e' :
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
                      background: `linear-gradient(135deg, ${item.sentiment === 'positive' ? '#22c55e' :
                          item.sentiment === 'negative' ? '#ef4444' :
                            '#eab308'
                        }, ${item.sentiment === 'positive' ? '#16a34a' :
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

            {/* Loader minimalista */}
            {(isLoadingMore || loading || filteredNews.length === 0) && (
              <div className="col-span-full flex justify-center py-12">
                <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin" style={{
                  borderColor: 'var(--border-medium)',
                  borderTopColor: 'var(--brand-primary)'
                }} />
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
}
