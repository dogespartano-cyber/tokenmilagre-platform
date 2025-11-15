'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Resource } from '@/lib/resources';
import { getCategoryGradient, getCategoryColor, getAllCategories } from '@/lib/category-helpers';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useThrottle } from '@/hooks/useThrottle';
import { SCROLL_TOP_THRESHOLD, SEARCH_DEBOUNCE_MS, MAX_VISIBLE_TAGS, SCROLL_THROTTLE_MS } from '@/lib/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faCheckCircle, faArrowRight, faArrowUp } from '@fortawesome/free-solid-svg-icons';

interface RecursosClientProps {
  resources: Resource[];
}

export default function RecursosClient({ resources }: RecursosClientProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = getAllCategories();

  // Debounce search term - only filter after user stops typing
  const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS);

  const filteredResources = resources.filter(resource => {
    // Filtro por categoria
    const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory;

    // Filtro por termo de busca (usando debouncedSearchTerm para performance)
    const searchMatch = !debouncedSearchTerm.trim() ||
      resource.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      resource.shortDescription.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

    return categoryMatch && searchMatch;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Throttled scroll handler - improves performance (100x less calls)
  const handleScroll = useThrottle(() => {
    setShowScrollTop(window.scrollY > SCROLL_TOP_THRESHOLD);
  }, SCROLL_THROTTLE_MS);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Read URL params on mount (one-way sync to avoid SSR issues)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category');

    if (searchParam) setSearchTerm(searchParam);
    if (categoryParam) setSelectedCategory(categoryParam);
  }, []);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (debouncedSearchTerm) count++;
    if (selectedCategory !== 'all') count++;
    return count;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-16">
        {/* Hero */}
        <div className="space-y-6 max-w-3xl">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold" style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--brand-primary)'
          }}>
            Recursos Verificados
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
            Acesse com Segurança os{' '}
            <span className="text-brand-primary">Links Oficiais Verificados</span>
          </h1>

          <p className="text-xl leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            Wallets, exchanges e ferramentas essenciais com links oficiais verificados pela comunidade $MILAGRE.
            Proteja-se contra sites falsos e golpes.
          </p>

          {/* Alerta de Segurança */}
          <div className="p-4 rounded-xl border-2" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: '#f59e0b'
          }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Sempre Verifique a URL
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Golpistas criam sites falsos para roubar suas informações. Sempre confirme que você está no site oficial antes de conectar sua carteira ou inserir dados pessoais.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="space-y-6">
          {/* Campo de Busca + Botão Limpar */}
          <div className="flex items-center gap-3 max-w-2xl">
            <div className="relative flex-1">
              <input
                type="search"
                placeholder="Buscar por nome, descrição ou tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-medium)',
                  color: 'var(--text-primary)'
                }}
                aria-label="Buscar recursos por nome, descrição ou tag"
                role="searchbox"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: 'var(--text-tertiary)' }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:scale-110"
                  style={{ color: 'var(--text-tertiary)' }}
                  aria-label="Limpar busca"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              )}
            </div>
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-3 rounded-xl font-semibold transition-all hover:scale-105 whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--brand-primary)',
                  border: '2px solid var(--border-medium)'
                }}
                aria-label={`Limpar ${getActiveFiltersCount()} filtro${getActiveFiltersCount() > 1 ? 's' : ''} ativo${getActiveFiltersCount() > 1 ? 's' : ''}`}
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
                  className={`px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg ${
                    selectedCategory === cat.id
                      ? 'shadow-md'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === cat.id ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                    color: selectedCategory === cat.id ? 'var(--text-inverse)' : 'var(--text-secondary)'
                  }}
                  aria-label={`Filtrar por categoria: ${cat.label}`}
                  aria-pressed={selectedCategory === cat.id}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Separador */}
            <div className="h-8 w-px" style={{ backgroundColor: 'var(--border-light)' }}></div>

            {/* Contador */}
            <div className="ml-auto" role="status" aria-live="polite">
              <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                {filteredResources.length} {filteredResources.length === 1 ? 'recurso' : 'recursos'}
              </p>
            </div>
          </div>
        </div>

        {/* Grid de Recursos - NOVO DESIGN COM GRADIENTES SUTIS */}
        {filteredResources.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list">
            {filteredResources.map((resource) => (
            <Link
              key={resource.id}
              href={`/recursos/${resource.slug}`}
              className="group relative rounded-2xl p-6 overflow-hidden border shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer block"
              style={{
                background: `linear-gradient(135deg, ${getCategoryGradient(resource.category)}, var(--bg-elevated))`,
                borderColor: 'var(--border-light)'
              }}
              aria-label={`Ver detalhes de ${resource.name} - ${resource.shortDescription}`}
              role="listitem"
            >
              {/* Glow sutil no topo no hover */}
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${getCategoryColor(resource.category)}, transparent)`,
                  boxShadow: `0 0 20px ${getCategoryColor(resource.category)}40`
                }}
              />

              {/* Content wrapper */}
              <div className="relative flex flex-col h-full">
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-4">
                  {/* Badge de Categoria */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-sm" style={{
                    backgroundColor: `${getCategoryColor(resource.category)}15`,
                    border: `1px solid ${getCategoryColor(resource.category)}30`
                  }}>
                    <span className="text-xs font-bold uppercase tracking-wide" style={{
                      color: getCategoryColor(resource.category)
                    }}>
                      {categories.find(c => c.id === resource.category)?.label || resource.category}
                    </span>
                  </div>

                  {/* Verificado */}
                  {resource.verified && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-md backdrop-blur-sm" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: '#10B981'
                    }}>
                      <FontAwesomeIcon icon={faCheckCircle} className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">Oficial</span>
                    </div>
                  )}
                </div>

                {/* Título */}
                <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors min-h-[3.5rem]" style={{ color: 'var(--text-primary)' }}>
                  {resource.name}
                </h3>

                {/* Descrição */}
                <p className="text-sm mb-4 line-clamp-3 leading-relaxed opacity-90 min-h-[4.5rem]" style={{ color: 'var(--text-secondary)' }}>
                  {resource.shortDescription}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {resource.tags.slice(0, MAX_VISIBLE_TAGS).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-tertiary)'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Plataformas */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {resource.platforms.map((platform, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 rounded text-xs font-semibold backdrop-blur-sm"
                      style={{
                        backgroundColor: `${getCategoryColor(resource.category)}10`,
                        color: getCategoryColor(resource.category),
                        border: `1px solid ${getCategoryColor(resource.category)}20`
                      }}
                    >
                      {platform}
                    </span>
                  ))}
                </div>

                {/* Spacer to push footer to bottom */}
                <div className="flex-grow"></div>

                {/* Footer */}
                <div className="pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="flex items-center justify-end">
                    {/* CTA com seta animada */}
                    <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all" style={{ color: 'var(--text-primary)' }}>
                      Ver recurso
                      <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            ))}
          </div>
        ) : (
          /* Mensagem de "sem resultados" */
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Nenhum recurso encontrado
            </h3>
            <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
              {debouncedSearchTerm ? (
                <>Não encontramos recursos para "<span className="font-semibold">{debouncedSearchTerm}</span>"</>
              ) : (
                <>Não há recursos nesta categoria</>
              )}
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--text-inverse)'
              }}
              aria-label="Limpar todos os filtros e mostrar todos os recursos"
            >
              Limpar filtros e ver todos
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

        {/* Dicas de Segurança */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
            Dicas de Segurança
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Verifique o Cadeado HTTPS
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Sites legítimos sempre usam conexão segura (https://)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔗</span>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Salve nos Favoritos
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Salve sites oficiais nos favoritos do navegador
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Evite Links Suspeitos
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Não clique em links de e-mails ou mensagens diretas
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">👀</span>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Confira a URL Completa
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Golpistas usam URLs parecidas (ex: metarnask.io)
                  </p>
                </div>
              </div>
            </div>
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
            <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
