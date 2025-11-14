'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Resource } from '@/lib/resources';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faCheckCircle, faArrowRight, faArrowUp } from '@fortawesome/free-solid-svg-icons';

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
    { id: 'wallet', label: 'Wallets' },
    { id: 'exchange', label: 'Exchanges' },
    { id: 'defi-protocol', label: 'DeFi' },
    { id: 'explorers', label: 'Exploradores' },
    { id: 'browsers', label: 'Navegadores' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'portfolio-tracker', label: 'Portfolio' },
    { id: 'development-tools', label: 'Dev Tools' },
    { id: 'news', label: 'Notícias' },
    { id: 'education', label: 'Educação' },
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

  // Função para retornar cor RGBA inicial do gradiente (usado no background)
  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      'wallet': 'rgba(246, 133, 27, 0.08)',          // Laranja (MetaMask) 8%
      'exchange': 'rgba(243, 186, 47, 0.08)',        // Dourado (Binance) 8%
      'defi-protocol': 'rgba(255, 0, 122, 0.08)',    // Rosa (Uniswap) 8%
      'explorers': 'rgba(59, 130, 246, 0.08)',       // Azul 8%
      'browsers': 'rgba(139, 92, 246, 0.08)',        // Roxo-azul 8%
      'analytics': 'rgba(16, 185, 129, 0.08)',       // Verde 8%
      'portfolio-tracker': 'rgba(236, 72, 153, 0.08)', // Rosa-vivo 8%
      'development-tools': 'rgba(156, 163, 175, 0.08)', // Cinza 8%
      'news': 'rgba(239, 68, 68, 0.08)',             // Vermelho 8%
      'education': 'rgba(34, 197, 94, 0.08)',        // Verde-educação 8%
    };
    return gradients[category] || 'rgba(99, 102, 241, 0.05)'; // Roxo padrão 5%
  };

  // Função para retornar cor sólida baseada na categoria
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'wallet': '#F6851B',          // Laranja (MetaMask)
      'exchange': '#F3BA2F',        // Dourado (Binance)
      'defi-protocol': '#FF007A',   // Rosa (Uniswap)
      'explorers': '#3B82F6',       // Azul
      'browsers': '#8B5CF6',        // Roxo-azul
      'analytics': '#10B981',       // Verde
      'portfolio-tracker': '#EC4899', // Rosa-vivo
      'development-tools': '#9CA3AF', // Cinza
      'news': '#EF4444',            // Vermelho
      'education': '#22C55E',       // Verde-educação
    };
    return colors[category] || '#6366F1'; // Roxo padrão
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
        <div className="space-y-6">
          {/* Campo de Busca + Botão Limpar */}
          <div className="flex items-center gap-3 max-w-2xl">
            <div className="relative flex-1">
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
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Separador */}
            <div className="h-8 w-px" style={{ backgroundColor: 'var(--border-light)' }}></div>

            {/* Contador */}
            <div className="ml-auto">
              <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                {filteredResources.length} {filteredResources.length === 1 ? 'recurso' : 'recursos'}
              </p>
            </div>
          </div>
        </div>

        {/* Grid de Recursos - NOVO DESIGN COM GRADIENTES SUTIS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map((resource) => (
            <Link
              key={resource.id}
              href={`/recursos/${resource.slug}`}
              className="group relative rounded-2xl p-6 overflow-hidden border shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer block"
              style={{
                background: `linear-gradient(135deg, ${getCategoryGradient(resource.category)}, var(--bg-elevated))`,
                borderColor: 'var(--border-light)'
              }}
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
                  {resource.tags.slice(0, 3).map((tag, index) => (
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

        {/* Loader minimalista */}
        {filteredResources.length === 0 && (
          <div className="flex justify-center py-12">
            <div
              className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent' }}
            ></div>
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
