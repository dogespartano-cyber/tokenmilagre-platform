'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

export default function EducacaoPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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

  const resources = [
    {
      id: 1,
      slug: 'introducao-ao-blockchain',
      title: 'Introdução ao Blockchain',
      category: 'blockchain',
      level: 'iniciante',
      type: 'Artigo',
      description: 'Aprenda os fundamentos da tecnologia blockchain de forma simples e prática.',
      readTime: '8 min',
      tags: ['básico', 'blockchain', 'conceitos']
    },
    {
      id: 2,
      slug: 'como-criar-wallet-segura',
      title: 'Como Criar uma Wallet Segura',
      category: 'seguranca',
      level: 'iniciante',
      type: 'Tutorial',
      description: 'Passo a passo para criar e proteger sua carteira de criptomoedas.',
      readTime: '12 min',
      tags: ['wallet', 'segurança', 'iniciante']
    },
    {
      id: 3,
      slug: 'trading-basico-criptomoedas',
      title: 'Trading Básico de Criptomoedas',
      category: 'trading',
      level: 'intermediario',
      type: 'Artigo',
      description: 'Estratégias fundamentais de trading e análise técnica para iniciantes.',
      readTime: '15 min',
      tags: ['trading', 'análise', 'estratégia']
    },
    {
      id: 4,
      slug: 'defi-financas-descentralizadas',
      title: 'DeFi: Finanças Descentralizadas',
      category: 'defi',
      level: 'intermediario',
      type: 'Tutorial',
      description: 'Entenda como funcionam protocolos DeFi, yields e staking.',
      readTime: '20 min',
      tags: ['defi', 'yield', 'staking']
    },
    {
      id: 5,
      slug: 'desenvolvendo-smart-contracts-solana',
      title: 'Desenvolvendo Smart Contracts em Solana',
      category: 'desenvolvimento',
      level: 'avancado',
      type: 'Tutorial',
      description: 'Aprenda a criar smart contracts em Solana usando Rust e Anchor.',
      readTime: '35 min',
      tags: ['solana', 'rust', 'smart contracts']
    },
    {
      id: 6,
      slug: 'nfts-ecossistema-solana',
      title: 'NFTs no Ecossistema Solana',
      category: 'nfts',
      level: 'intermediario',
      type: 'Artigo',
      description: 'Criação, venda e estratégias de NFTs no ecossistema Solana.',
      readTime: '18 min',
      tags: ['nft', 'arte digital', 'marketplace']
    },
  ];

  const filteredResources = resources.filter(resource => {
    // Filtro por categoria
    const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory;

    // Filtro por nível
    const levelMatch = selectedLevel === 'all' || resource.level === selectedLevel;

    // Filtro por termo de busca
    const searchMatch = !searchTerm.trim() ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return categoryMatch && levelMatch && searchMatch;
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

      <div className="py-8 max-w-4xl" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
        <div className="space-y-16">
          {/* Breadcrumbs */}
          <Breadcrumbs />

          {/* Hero */}
          <div className="space-y-6">
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
                <div className="text-3xl font-bold text-brand-primary">{resources.length}</div>
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

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Busca e Filtros */}
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
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
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
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
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

              {/* Contador */}
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {filteredResources.length} {filteredResources.length === 1 ? 'recurso encontrado' : 'recursos encontrados'}
              </p>
            </div>
          </div>

          {/* Lista de Recursos */}
          <div className="space-y-6">
            {filteredResources.map((resource) => (
              <Link
                key={resource.id}
                href={`/educacao/${resource.slug}`}
                className="block p-6 rounded-xl border transition-all hover:shadow-lg cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-light)'
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: 'var(--text-inverse)'
                      }}>
                        {resource.type}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        📖 {resource.readTime} de leitura
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                      {resource.title}
                    </h3>
                    <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {resource.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: 'var(--bg-elevated)',
                            color: 'var(--text-tertiary)'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
              Trilha de Aprendizagem
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  🌱
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Iniciante</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Fundamentos de blockchain, como criar wallets, primeiros passos em cripto
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  🚀
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Intermediário</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Trading, DeFi, análise técnica, estratégias de investimento
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  💎
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
