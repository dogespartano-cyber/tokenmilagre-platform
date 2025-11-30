'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useInfiniteScrollData } from '@/hooks/useInfiniteScrollData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowRight, faSearch, faTimes, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { getLevelGradient, getLevelColor, getLevelIcon } from '@/lib/utils/level-helpers';
import { getCategoryIcon } from '@/lib/utils/category-helpers';
import DashboardHeader from '@/app/components/DashboardHeader';

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
  stats: {
    totalArticles: number;
    totalCategories: number;
  };
}

// Tipo para dados brutos da API (antes da transformação)
interface RawArticleData {
  id: string;
  slug: string;
  title: string;
  category: string;
  level?: string;
  contentType?: string;
  summary?: string;
  readTime?: string;
  keywords?: string[];
}

export default function EducacaoClient({ resources, stats }: EducacaoClientProps) {

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

  // Hook de infinite scroll com data fetching
  const {
    data: allResources,
    isLoadingMore,
    sentinelRef
  } = useInfiniteScrollData<Resource>({
    endpoint: '/api/articles',
    filters: {
      type: 'educational',
      category: selectedCategory,
      level: selectedLevel
    },
    initialData: resources,
    pageSize: 12,
    transform: (rawData: unknown) => {
      const article = rawData as RawArticleData;
      return {
        id: article.id,
        slug: article.slug,
        title: article.title,
        category: article.category,
        level: article.level || 'iniciante',
        type: article.contentType || 'Artigo',
        description: article.summary || '',
        readTime: article.readTime || '5 min',
        tags: article.keywords || []
      };
    }
  });

  // Filtrar recursos localmente (apenas por termo de busca)
  const filteredResources = allResources.filter(resource => {
    // Filtro por termo de busca
    const searchMatch = !searchTerm.trim() ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return searchMatch;
  });



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
          {/* Header with Discord/Telegram Buttons */}
          <DashboardHeader
            title="Educação Cripto"
            description="Artigos e tutoriais gratuitos criados pela comunidade $MILAGRE. Conhecimento livre para todos."
          />

          {/* Cards Principais em Destaque (Removido conforme solicitado) */}

          {/* Busca e Filtros */}
          <div className="space-y-6">
            {/* Campo de Busca + Botão Limpar */}
            <div className="flex items-center gap-3 max-w-2xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar por título, descrição ou tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] glass-card text-[var(--text-article-body)] placeholder-[var(--text-article-muted)]"
                  style={{
                    borderColor: 'var(--border-article)',
                  }}
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: 'var(--text-article-muted)' }}
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
                  className="px-4 py-3 rounded-xl font-semibold transition-all hover:opacity-80 whitespace-nowrap glass-card border border-[var(--border-article)] text-[var(--brand-primary)]"
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
                      ? 'shadow-md bg-[var(--brand-primary)] text-white'
                      : 'hover:opacity-80 glass-card border border-[var(--border-article)] text-[var(--text-article-body)]'
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-[var(--border-article)]"></div>

              {/* Níveis */}
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${selectedLevel === level.id
                      ? 'shadow-md bg-[var(--brand-primary)] text-white'
                      : 'hover:opacity-80 glass-card border border-[var(--border-article)] text-[var(--text-article-body)]'
                      }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de Recursos - NOVO DESIGN COM GLASSMORPHISM */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((resource) => (
              <Link
                key={resource.id}
                href={`/educacao/${resource.slug}`}
                className="glass-card group relative rounded-2xl p-6 overflow-hidden border border-[var(--border-article)] shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer block hover:border-[var(--brand-primary)]/50"
              >
                {/* Glow sutil no topo no hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${getLevelColor(resource.level)}, transparent)`,
                    boxShadow: `0 0 20px ${getLevelColor(resource.level)}40`
                  }}
                />

                {/* Content wrapper */}
                <div className="relative flex flex-col h-full">
                  {/* Header do Card */}
                  <div className="flex items-start justify-between mb-4">
                    {/* Badge de Nível com ícone (sem borda lateral) */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-sm" style={{
                      backgroundColor: `${getLevelColor(resource.level)}15`,
                      border: `1px solid ${getLevelColor(resource.level)}30`
                    }}>
                      <FontAwesomeIcon
                        icon={getLevelIcon(resource.level)}
                        className="w-3.5 h-3.5"
                        style={{ color: getLevelColor(resource.level) }}
                      />
                      <span className="text-xs font-bold uppercase tracking-wide" style={{
                        color: getLevelColor(resource.level)
                      }}>
                        {resource.level === 'iniciante' ? 'Iniciante' : resource.level === 'intermediario' ? 'Intermediário' : resource.level === 'avancado' ? 'Avançado' : 'Geral'}
                      </span>
                    </div>

                    {/* Tempo de leitura */}
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-sm flex items-center gap-1.5 bg-[var(--bg-article-tag)] text-[var(--text-article-muted)]">
                      <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                      {resource.readTime || '5 min'}
                    </span>
                  </div>

                  {/* Título */}
                  <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors min-h-[3.5rem] text-[var(--text-article-title)]">
                    {resource.title}
                  </h3>

                  {/* Descrição */}
                  <p className="text-sm mb-4 line-clamp-3 leading-relaxed opacity-90 min-h-[4.5rem] text-[var(--text-article-body)]">
                    {resource.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm bg-[var(--bg-article-tag)] text-[var(--text-article-muted)]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Spacer to push footer to bottom */}
                  <div className="flex-grow"></div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-[var(--border-article)]">
                    <div className="flex items-center justify-end">
                      {/* CTA com seta animada */}
                      <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all text-[var(--text-article-title)] group-hover:text-[var(--brand-primary)]">
                        Ler artigo
                        <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Elemento sentinela para infinite scroll */}
            {!searchTerm && <div ref={sentinelRef} className="col-span-full h-1" />}

            {/* Loader minimalista */}
            {(isLoadingMore || filteredResources.length === 0) && (
              <div className="col-span-full flex justify-center py-12">
                <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin border-[var(--border-article)] border-t-[var(--brand-primary)]" />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--border-article)]"></div>

          {/* Roadmap de Aprendizagem */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
              O que você vai aprender
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold bg-[var(--brand-primary)] text-white">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1 text-[var(--text-article-title)]">Iniciante</h3>
                  <p className="text-sm text-[var(--text-article-body)]">
                    Fundamentos de blockchain, como criar wallets, primeiros passos em cripto
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold bg-[var(--brand-primary)] text-white">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1 text-[var(--text-article-title)]">Intermediário</h3>
                  <p className="text-sm text-[var(--text-article-body)]">
                    Trading, DeFi, análise técnica, estratégias de investimento
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold bg-[var(--brand-primary)] text-white">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1 text-[var(--text-article-title)]">Avançado</h3>
                  <p className="text-sm text-[var(--text-article-body)]">
                    Desenvolvimento de smart contracts, programação Web3, arquitetura blockchain
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--border-article)]"></div>

          {/* CTA */}
          <div className="space-y-6 py-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
              Contribua com a Comunidade
            </h2>
            <p className="text-lg text-[var(--text-article-body)]">
              Tem conhecimento para compartilhar? Ajude a comunidade escrevendo artigos e tutoriais educacionais.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://discord.gg/xk4zrz8j"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 bg-[#5865F2] text-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Compartilhe no Discord
              </a>
            </div>
          </div>


        </div>
      </div>
    </>
  );
}
