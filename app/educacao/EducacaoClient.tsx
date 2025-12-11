'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useInfiniteScrollData } from '@/hooks/useInfiniteScrollData';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowRight, faSearch, faTimes, faArrowUp, faFilter } from '@fortawesome/free-solid-svg-icons';
import { getLevelGradient, getLevelColor, getLevelIcon } from '@/lib/shared/utils/level-helpers';
import { getCategoryIcon } from '@/lib/shared/utils/category-helpers';
import DashboardHeader from '@/components/shared/DashboardHeader';
import TruthDetector from '@/components/education/TruthDetector';
import SocialLinks from '@/components/shared/SocialLinks';

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
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
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
      level: selectedLevel,
      search: debouncedSearchTerm
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

  // Filtrar recursos localmente (apenas por termo de busca) - REMOVIDO EM FAVOR DO SERVER-SIDE SEARCH
  const filteredResources = allResources;



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

      <div className="container mx-auto px-4 py-8 relative">
        <div className="space-y-8">
          {/* Header with Discord/Telegram Buttons */}
          {/* Header with Discord/Telegram Buttons - REMOVIDO (Agora gerenciado pelo layout-root) */}

          {/* Filtros Inline */}
          {/* Filtros Inline */}
          <div className="space-y-6">
            {getActiveFiltersCount() > 0 && (
              <div className="flex items-center justify-end mb-4">
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-bold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Limpar Filtros
                </button>
              </div>
            )}

            <div className="grid lg:grid-cols-12 gap-6">
              {/* Busca */}
              <div className="lg:col-span-12">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por título, descrição ou tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-article)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all placeholder-[var(--text-secondary)]"
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
                </div>
              </div>

              {/* Categorias */}
              <div className="lg:col-span-7 space-y-3">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Categorias</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border hover:scale-105 active:scale-95 ${selectedCategory === cat.id
                        ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border-[var(--brand-primary)]/30 shadow-sm hover:bg-[var(--brand-primary)]/30'
                        : 'bg-[var(--bg-page)] hover:bg-[var(--bg-hover)] border-[var(--border-article)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/50 hover:text-[var(--text-primary)]'
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Níveis */}
              <div className="lg:col-span-5 space-y-3">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Nível</label>
                <div className="flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedLevel(level.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border hover:scale-105 active:scale-95 ${selectedLevel === level.id
                        ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border-[var(--brand-primary)]/30 shadow-sm hover:bg-[var(--brand-primary)]/30'
                        : 'bg-[var(--bg-page)] hover:bg-[var(--bg-hover)] border-[var(--border-article)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/50 hover:text-[var(--text-primary)]'
                        }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Recursos - NOVO DESIGN COM GLASSMORPHISM */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((resource) => (
              <Link
                key={resource.id}
                href={`/educacao/${resource.slug}`}
                className="glass-card group relative flex flex-col p-6 rounded-2xl border border-[var(--border-light)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl overflow-hidden"
              >
                {/* Hover Glow Effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: getLevelColor(resource.level)
                  }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Header: Level & Read Time */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      <FontAwesomeIcon
                        icon={getLevelIcon(resource.level)}
                        className="w-2.5 h-2.5"
                        style={{ color: getLevelColor(resource.level) }}
                      />
                      <span className="text-[10px] font-bold tracking-wide" style={{
                        color: getLevelColor(resource.level)
                      }}>
                        {resource.level === 'iniciante' ? 'Iniciante' : resource.level === 'intermediario' ? 'Intermediário' : resource.level === 'avancado' ? 'Avançado' : 'Geral'}
                      </span>
                    </div>

                    <span className="text-xs font-medium flex items-center gap-1.5 text-[var(--text-tertiary)]">
                      <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                      {resource.readTime || '5 min'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors text-[var(--text-primary)]">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm mb-4 line-clamp-3 leading-relaxed text-[var(--text-secondary)]">
                    {resource.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs font-medium text-[var(--text-tertiary)]"
                      >
                        #{tag}
                      </span>
                    ))}
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

          {/* Detector de Mentiras (Operação Êxodo) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TruthDetector />
          </div>

          {/* CTA */}
          <div className="space-y-6 py-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
              Contribua com a Comunidade
            </h2>
            <p className="text-lg text-[var(--text-article-body)]">
              Tem conhecimento para compartilhar? Ajude a comunidade escrevendo artigos e tutoriais educacionais.
            </p>
            <div className="flex flex-wrap gap-4">
              <SocialLinks variant="buttons" platforms={['discord', 'telegram']} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
