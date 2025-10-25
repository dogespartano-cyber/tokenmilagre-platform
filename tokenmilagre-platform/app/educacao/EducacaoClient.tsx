'use client';

import { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface Resource {
  id: string;
  slug: string;
  title: string;
  category: string;
  level: string | null;
  type: string;
  description: string;
  readTime: string | null;
  tags: string[];
}

interface EducacaoClientProps {
  resources: Resource[];
}

export default function EducacaoClient({ resources }: EducacaoClientProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Estados para infinite scroll
  const [allResources, setAllResources] = useState<Resource[]>(resources);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(resources.length === 12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'blockchain', label: 'Blockchain' },
    { id: 'trading', label: 'Trading' },
    { id: 'defi', label: 'DeFi' },
    { id: 'nfts', label: 'NFTs' },
    { id: 'seguranca', label: 'Segurança' },
    { id: 'desenvolvimento', label: 'Dev Web3' },
  ];

  const levels = [
    { id: 'all', label: 'Todos os Níveis' },
    { id: 'iniciante', label: 'Iniciante' },
    { id: 'intermediario', label: 'Intermediário' },
    { id: 'avancado', label: 'Avançado' },
  ];

  // Função para buscar mais recursos da API
  const fetchMoreResources = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true);
    }

    try {
      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      const levelParam = selectedLevel !== 'all' ? `&level=${selectedLevel}` : '';
      const url = `/api/articles?type=educational&page=${pageNum}&limit=12${categoryParam}${levelParam}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        const newItems: Resource[] = data.data.map((article: any) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          category: article.category,
          level: article.level || 'iniciante',
          type: article.contentType || 'Artigo',
          description: article.summary || '',
          readTime: article.readTime || '5 min',
          tags: article.keywords || []
        }));

        if (append) {
          setAllResources(prev => [...prev, ...newItems]);
        } else {
          setAllResources(newItems);
        }

        setHasMore(data.pagination.hasMore);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Erro ao buscar recursos:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [selectedCategory, selectedLevel]);

  // Carregar mais recursos (infinite scroll)
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchMoreResources(page + 1, true);
    }
  }, [page, hasMore, isLoadingMore, fetchMoreResources]);

  // Hook de infinite scroll
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMore,
    threshold: 300
  });

  // Resetar paginação quando filtros mudarem (categoria ou nível)
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setAllResources([]);
    fetchMoreResources(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedLevel]);

  // Filtrar recursos localmente (apenas por termo de busca)
  const filteredResources = allResources.filter(resource => {
    // Filtro por termo de busca
    const searchMatch = !searchTerm.trim() ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return searchMatch;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLevel('all');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== 'all') count++;
    if (selectedLevel !== 'all') count++;
    return count;
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="educacao-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "$MILAGRE Education",
          "url": "https://tokenmilagre.xyz/educacao",
          "description": "Artigos e tutoriais educacionais gratuitos sobre blockchain, cripto e Web3 criados pela comunidade"
        })}
      </Script>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-16">
          {/* Hero */}
          <div className="space-y-6 max-w-3xl">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold" style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--brand-primary)'
            }}>
              Educação
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Aprenda, Cresça e{' '}
              <span className="text-brand-primary">Compartilhe Conhecimento</span>
            </h1>

            <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Artigos e tutoriais gratuitos criados e curados pela comunidade $MILAGRE.
              Conhecimento livre, acessível a todos.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-brand-primary">{allResources.length}</div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Recursos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-primary">6</div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Categorias</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-primary">100%</div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Gratuito</div>
              </div>
            </div>
          </div>

          {/* Busca e Filtros */}
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
                  placeholder="Buscar por título, descrição ou tag..."
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
            </div>

            {/* Filtros - Desktop sempre visível, Mobile toggle */}
            <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Categorias e Níveis - Lado a Lado */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Categorias */}
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Categorias:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg ${
                          selectedCategory === cat.id
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
                </div>

                {/* Níveis */}
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Nível:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg ${
                          selectedLevel === level.id
                            ? 'shadow-md'
                            : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: selectedLevel === level.id ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                          color: selectedLevel === level.id ? 'var(--text-inverse)' : 'var(--text-secondary)'
                        }}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contador */}
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {filteredResources.length} {filteredResources.length === 1 ? 'recurso encontrado' : 'recursos encontrados'}
              </p>
            </div>
          </div>

          {/* Lista de Recursos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((resource) => (
              <Link
                key={resource.id}
                href={`/educacao/${resource.slug}`}
                className="group backdrop-blur-lg rounded-2xl p-6 border shadow-md transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg cursor-pointer block"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-light)' }}
              >
                {/* Content wrapper */}
                <div className="flex flex-col h-full">
                  {/* Header do Card */}
                  <div className="flex items-start justify-between mb-4">
                    {/* Badge de Nível - Design com barra lateral */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-l-4" style={{
                      backgroundColor: resource.level === 'iniciante' ? '#22c55e15' : resource.level === 'intermediario' ? '#eab30815' : '#ef444415',
                      borderLeftColor: resource.level === 'iniciante' ? '#22c55e' : resource.level === 'intermediario' ? '#eab308' : '#ef4444'
                    }}>
                      <svg className="w-4 h-4" style={{
                        color: resource.level === 'iniciante' ? '#22c55e' : resource.level === 'intermediario' ? '#eab308' : '#ef4444'
                      }} fill="currentColor" viewBox="0 0 20 20">
                        {resource.level === 'iniciante' && (
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        )}
                        {resource.level === 'intermediario' && (
                          <>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </>
                        )}
                        {resource.level === 'avancado' && (
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        )}
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wide" style={{
                        color: resource.level === 'iniciante' ? '#22c55e' : resource.level === 'intermediario' ? '#eab308' : '#ef4444'
                      }}>
                        {resource.level === 'iniciante' ? 'Iniciante' : resource.level === 'intermediario' ? 'Intermediário' : 'Avançado'}
                      </span>
                    </div>

                    <span className="text-xs font-medium px-2 py-1 rounded-md" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-tertiary)'
                    }}>
                      📖 {resource.readTime}
                    </span>
                  </div>

                  {/* Título */}
                  <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors min-h-[3.5rem]" style={{ color: 'var(--text-primary)' }}>
                    {resource.title}
                  </h3>

                  {/* Descrição */}
                  <p className="text-sm mb-4 line-clamp-3 leading-relaxed min-h-[4.5rem]" style={{ color: 'var(--text-secondary)' }}>
                    {resource.description}
                  </p>

                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 rounded text-xs font-medium border"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-light)',
                            color: 'var(--text-tertiary)'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Categoria */}
                  <div className="mb-4 pb-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium border"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-light)',
                          color: 'var(--text-tertiary)'
                        }}
                      >
                        {resource.category}
                      </span>
                    </div>
                  </div>

                  {/* Spacer to push link to bottom */}
                  <div className="flex-grow"></div>

                  {/* Link Ler Mais */}
                  <div className="pt-3">
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all group-hover:shadow-md" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-light)',
                      color: 'var(--text-primary)'
                    }}>
                      <span className="font-bold text-sm">Ler artigo completo</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Elemento sentinela para infinite scroll */}
            {!searchTerm && <div ref={sentinelRef} className="col-span-full h-1" />}

            {/* Loader para infinite scroll */}
            {isLoadingMore && (
              <div className="col-span-full flex justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{
                    borderColor: 'var(--brand-primary)',
                    borderTopColor: 'transparent'
                  }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                    Carregando mais recursos...
                  </p>
                </div>
              </div>
            )}

            {/* Indicador de fim da lista */}
            {!hasMore && !searchTerm && filteredResources.length > 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  📚 Você visualizou todos os {filteredResources.length} recursos disponíveis
                </p>
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
                Nenhum recurso encontrado
              </p>
              <p style={{ color: 'var(--text-tertiary)' }}>
                Tente ajustar os filtros para encontrar o que procura
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Roadmap de Aprendizagem */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              O que você vai aprender
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: 'var(--brand-primary)', color: 'var(--text-inverse)' }}>
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Iniciante</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Fundamentos de blockchain, como criar wallets, primeiros passos em cripto
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: 'var(--brand-primary)', color: 'var(--text-inverse)' }}>
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Intermediário</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Trading, DeFi, análise técnica, estratégias de investimento
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: 'var(--brand-primary)', color: 'var(--text-inverse)' }}>
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Avançado</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Desenvolvimento de smart contracts, programação Web3, arquitetura blockchain
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* CTA */}
          <div className="space-y-6 py-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Contribua com a Comunidade
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Tem conhecimento para compartilhar? Ajude a comunidade escrevendo artigos e tutoriais educacionais.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://discord.gg/skaX8bFY"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: '#5865F2',
                  color: 'white'
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Compartilhe no Discord
              </a>
            </div>
          </div>

          {/* Scroll to top button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--text-inverse)'
              }}
              aria-label="Voltar ao topo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
