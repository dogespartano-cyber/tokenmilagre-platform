'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Resource } from '@/lib/resources';

interface RecursosClientProps {
  resources: Resource[];
}

export default function RecursosClient({ resources }: RecursosClientProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'wallets', label: 'Wallets' },
    { id: 'exchanges', label: 'Exchanges' },
    { id: 'explorers', label: 'Exploradores' },
    { id: 'defi', label: 'DeFi' },
    { id: 'tools', label: 'Ferramentas' },
    { id: 'browsers', label: 'Navegadores' },
  ];

  const filteredResources = resources.filter(resource => {
    // Filtro por categoria
    const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory;

    // Filtro por termo de busca
    const searchMatch = !searchTerm.trim() ||
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return categoryMatch && searchMatch;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para retornar gradiente baseado na categoria
  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      'wallets': 'linear-gradient(135deg, #F6851B 0%, #E2761B 100%)', // Laranja (MetaMask)
      'exchanges': 'linear-gradient(135deg, #F3BA2F 0%, #EAA42D 100%)', // Dourado (Binance)
      'defi': 'linear-gradient(135deg, #FF007A 0%, #E6006E 100%)', // Rosa (Uniswap)
      'explorers': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', // Azul
      'tools': 'linear-gradient(135deg, #10B981 0%, #059669 100%)', // Verde
      'browsers': 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)', // Roxo-azul
    };
    return gradients[category] || 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'; // Roxo padrão
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ler parâmetro de busca da URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, []);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
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
                placeholder="Buscar por nome, descrição ou tag..."
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

            {/* Contador */}
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {filteredResources.length} {filteredResources.length === 1 ? 'recurso encontrado' : 'recursos encontrados'}
            </p>
          </div>
        </div>

        {/* Grid de Recursos - DESIGN GRADIENTE */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map((resource) => {
            const CardWrapper = Link;
            const cardProps = { href: `/recursos/${resource.slug}` };

            return (
              <CardWrapper
                key={resource.id}
                {...cardProps}
                className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  background: getCategoryGradient(resource.category),
                  minHeight: '240px'
                }}
              >
              {/* Overlay escuro sutil */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>

              {/* Conteúdo */}
              <div className="relative z-10 h-full flex flex-col justify-between text-white">
                <div>
                  {/* Header - Badge categoria e verificado */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-block px-2 py-1 rounded-md text-xs font-bold bg-white/20 backdrop-blur-sm">
                      {categories.find(c => c.id === resource.category)?.label || resource.category}
                    </div>
                    {resource.verified && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* Nome */}
                  <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform origin-left">
                    {resource.name}
                  </h3>

                  {/* Descrição */}
                  <p className="text-sm opacity-90 mb-4 line-clamp-2">
                    {resource.shortDescription}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 rounded text-xs font-medium bg-white/15 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="space-y-3">
                  {/* Plataformas */}
                  <div className="flex flex-wrap gap-1.5">
                    {resource.platforms.map((platform, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 rounded text-xs font-semibold bg-white/20 backdrop-blur-sm"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>

                  {/* CTA com seta */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-sm font-bold">Ver detalhes</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </CardWrapper>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
              Nenhum recurso encontrado
            </p>
            <p style={{ color: 'var(--text-tertiary)' }}>
              Tente ajustar os filtros
            </p>
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
