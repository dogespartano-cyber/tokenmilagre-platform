'use client';

import {
  BookOpen, Shield, FileQuestion, Search, Wallet, Coins, AlertTriangle,
  TrendingUp, GraduationCap, Code, ChevronDown, ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { usePaginationData } from '@/lib/shared/hooks/usePaginationData';
import Pagination from '@/components/shared/Pagination';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowRight, faSearch, faTimes, faArrowUp, faFilter } from '@fortawesome/free-solid-svg-icons';
import { getLevelGradient, getLevelColor, getLevelIcon } from '@/lib/shared/utils/level-helpers';
import { getCategoryIcon } from '@/lib/shared/utils/category-helpers';
import TruthDetector from '@/components/education/TruthDetector';
import SocialLinks from '@/components/shared/SocialLinks';
import { useEducationFilters, categories, levels } from '@/contexts/EducationFilterContext';
import { useSidebar } from '@/contexts/SidebarContext';
import PageWrapper from '@/components/layout/PageWrapper';

// Header config - inline para IA reconhecer
const pageHeader = {
  title: 'Aprenda Cripto do Zero ao Avançado',
  description: 'Artigos e tutoriais gratuitos criados pela comunidade. Sem promessas falsas, apenas conhecimento real.'
};

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

  // Usar filtros do Context (compartilhado com Sidebar)
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    clearAllFilters,
    getActiveFiltersCount
  } = useEducationFilters();

  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  // Hook de paginação com data fetching
  const {
    data: filteredResources,
    loading: isLoading,
    totalPages,
    currentPage,
    goToPage
  } = usePaginationData<Resource>({
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

  // Configurar sidebar com as seções da página
  const { setSidebarMode, resetSidebar } = useSidebar();

  useEffect(() => {
    setSidebarMode('educacao', {
      showFilters: false,
      sections: [
        { id: 'comece-por-aqui', title: 'Comece por aqui', icon: 'book' },
        { id: 'trilhas', title: 'Trilhas de Aprendizado', icon: 'graduation' },
        { id: 'artigos', title: 'Todos os Artigos', icon: 'file' },
        { id: 'faq', title: 'Perguntas Frequentes', icon: 'question' },
        { id: 'truth-detector', title: 'Detector de Mentiras', icon: 'shield' },
        { id: 'contribua', title: 'Contribua', icon: 'heart' },
      ]
    });

    return () => {
      resetSidebar();
    };
  }, [setSidebarMode, resetSidebar]);




  return (
    <PageWrapper header={pageHeader}>
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

          {/* Cards Introdutórios - 8 Temas (Estáticos) */}
          <section id="comece-por-aqui" className="space-y-6 scroll-mt-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: BookOpen, title: 'Comece pelo Básico', desc: 'Entenda o que é cripto e onde as pessoas mais erram', slug: 'fundamentos-cripto' },
                { icon: Shield, title: 'Segurança Primeiro', desc: 'Seed phrase, golpes e hábitos que protegem você', slug: 'seguranca-primeiro' },
                { icon: Wallet, title: 'Carteiras e Custódia', desc: 'Hot vs cold wallet, autocustódia e boas práticas', slug: 'carteiras-e-custodia' },
                { icon: AlertTriangle, title: 'Golpes Comuns', desc: 'Phishing, airdrop falso, links maliciosos e aprovações', slug: 'golpes-comuns-cripto' },
              ].map((card, index) => {
                const Icon = card.icon;
                const cardContent = (
                  <div className="relative z-10">
                    {/* Icon Container */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 bg-[var(--bg-page)] text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="font-bold text-lg text-[var(--text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
                      {card.title}
                    </h3>

                    <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed line-clamp-2">
                      {card.desc}
                    </p>
                  </div>
                );

                const cardClassName = `
                  group p-6 rounded-2xl border text-left relative overflow-hidden transition-all duration-300
                  bg-transparent backdrop-blur-2xl border-[var(--border-light)]
                  hover:border-[var(--brand-primary)]/30 hover:shadow-lg hover:-translate-y-1
                  ${card.slug ? 'cursor-pointer' : ''}
                `;

                return card.slug ? (
                  <Link key={index} href={`/educacao/${card.slug}`} className={cardClassName}>
                    {cardContent}
                  </Link>
                ) : (
                  <div key={index} className={cardClassName}>
                    {cardContent}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-[var(--border-light)]"></div>

          {/* Trilhas de Aprendizado */}
          <section id="trilhas" className="space-y-8 scroll-mt-24">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Trilhas de Aprendizado
              </h2>
              <p className="text-[var(--text-secondary)] mt-1">
                Escolha uma trilha. Ganhe clareza sobre qual nível de conhecimento você está.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Iniciante */}
              <div
                className="group p-6 rounded-2xl border text-left relative overflow-hidden transition-all duration-300
                    bg-transparent backdrop-blur-2xl border-[var(--border-light)]
                    hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-emerald-500/10 text-emerald-500">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Iniciante</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Para quem quer entender o básico com segurança e evitar armadilhas.
                </p>
                <ul className="text-xs text-[var(--text-tertiary)] space-y-1 mb-4">
                  <li>• Fundamentos do Bitcoin</li>
                  <li>• Segurança e autocustódia</li>
                  <li>• Redes e taxas</li>
                  <li>• DYOR e transparência</li>
                </ul>
              </div>

              {/* Intermediário */}
              <div
                className="group p-6 rounded-2xl border text-left relative overflow-hidden transition-all duration-300
                    bg-transparent backdrop-blur-2xl border-[var(--border-light)]
                    hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-amber-500/10 text-amber-500">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-2">Intermediário</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Para quem já entende o básico e quer operar com mais consciência.
                </p>
                <ul className="text-xs text-[var(--text-tertiary)] space-y-1 mb-4">
                  <li>• Stablecoins e riscos reais</li>
                  <li>• DeFi com prudência</li>
                  <li>• Leitura de notícias</li>
                  <li>• Gestão de risco</li>
                </ul>
              </div>

              {/* Avançado */}
              <div
                className="group p-6 rounded-2xl border text-left relative overflow-hidden transition-all duration-300
                    bg-transparent backdrop-blur-2xl border-[var(--border-light)]
                    hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-red-500/10 text-red-500">
                  <Code className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Avançado</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Para quem quer profundidade técnica e pensamento crítico.
                </p>
                <ul className="text-xs text-[var(--text-tertiary)] space-y-1 mb-4">
                  <li>• Análise on-chain</li>
                  <li>• Tokenomics e incentivos</li>
                  <li>• Segurança avançada</li>
                  <li>• Leitura de contratos</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-[var(--border-light)]"></div>


          {/* Filtros e Artigos - Título adicionado */}
          <section id="artigos" className="space-y-6 scroll-mt-24">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  Todos os Artigos
                </h2>
                <p className="text-[var(--text-secondary)] mt-1">
                  Explore todos os conteúdos educacionais ou filtre por categoria e nível.
                </p>
              </div>

              {/* Search + Levels + Clear */}
              <div className="flex items-center gap-3">
                {/* Search input - always visible */}
                <div className="relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    placeholder="Buscar artigos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48 pl-10 pr-8 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Separator */}
                <div className="w-px h-6 bg-[var(--border-light)]" />


                {/* Level icons - 3 separate buttons using original FontAwesome icons */}
                <button
                  onClick={() => setSelectedLevel(selectedLevel === 'iniciante' ? '' : 'iniciante')}
                  className={`p-2.5 rounded-xl border transition-all ${selectedLevel === 'iniciante' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-tertiary)] hover:text-emerald-500 hover:border-emerald-500/30'}`}
                  title="Iniciante"
                >
                  <FontAwesomeIcon icon={getLevelIcon('iniciante')} className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedLevel(selectedLevel === 'intermediario' ? '' : 'intermediario')}
                  className={`p-2.5 rounded-xl border transition-all ${selectedLevel === 'intermediario' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-tertiary)] hover:text-amber-500 hover:border-amber-500/30'}`}
                  title="Intermediário"
                >
                  <FontAwesomeIcon icon={getLevelIcon('intermediario')} className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedLevel(selectedLevel === 'avancado' ? '' : 'avancado')}
                  className={`p-2.5 rounded-xl border transition-all ${selectedLevel === 'avancado' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-tertiary)] hover:text-red-500 hover:border-red-500/30'}`}
                  title="Avançado"
                >
                  <FontAwesomeIcon icon={getLevelIcon('avancado')} className="w-4 h-4" />
                </button>

                {/* Clear level filter - only show when level active */}
                {selectedLevel && (
                  <>
                    <div className="w-px h-6 bg-[var(--border-light)]" />
                    <button
                      onClick={() => setSelectedLevel('')}
                      className="p-2.5 rounded-xl border bg-[var(--error)]/10 border-[var(--error)]/30 text-[var(--error)] hover:bg-[var(--error)]/20 transition-all"
                      title="Limpar nível"
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">


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

                      {/* CTA */}
                      <div className="flex items-center text-sm font-bold text-[var(--brand-primary)] opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        Ler artigo <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Loader minimalista (centralizado) */}
                {isLoading && filteredResources.length === 0 && (
                  <div className="col-span-full flex justify-center py-12">
                    <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin border-[var(--border-article)] border-t-[var(--brand-primary)]" />
                  </div>
                )}

                {/* Mensagem de vazio */}
                {!isLoading && filteredResources.length === 0 && (
                  <div className="col-span-full text-center py-12 text-[var(--text-secondary)]">
                    Nenhum artigo encontrado com esses filtros.
                  </div>
                )}
              </div>

              {/* Paginação */}
              {!isLoading && filteredResources.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                </div>
              )}
            </div>
          </section>



          {/* FAQ */}
          <section id="faq" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              {[
                { q: 'Isso aqui vai me dizer o que comprar?', a: 'Não. O $MILAGRE educa para você entender riscos, evitar golpes e tomar decisões conscientes. Não é aconselhamento financeiro.' },
                { q: 'Eu sou totalmente iniciante. Por onde começo?', a: 'Clique em "Comece pelo Básico" e depois faça "Segurança Primeiro" antes de qualquer ação prática.' },
                { q: 'Como vocês evitam virar "conteúdo de hype"?', a: 'Com regras: sem promessa de lucro, sem FOMO, com fontes e separação clara entre fato e opinião.' },
                { q: 'As informações têm fontes verificáveis?', a: 'Sim. Cada artigo pode ter uma seção "Claims e Fontes". O que for opinião fica rotulado como tal.' },
              ].map((faq, i) => (
                <details key={i} className="group p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)]">
                  <summary className="font-bold text-[var(--text-primary)] cursor-pointer list-none flex items-center justify-between">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-[var(--text-tertiary)] group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-[var(--border-article)]"></div>

          {/* Detector de Mentiras (Operação Êxodo) */}
          {/* Detector de Mentiras (TruthDetector) */}
          <section id="truth-detector" className="scroll-mt-24">
            <TruthDetector />
          </section>

          {/* CTA */}
          <section id="contribua" className="space-y-6 py-8 scroll-mt-24">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
              Contribua com a Comunidade
            </h2>
            <p className="text-lg text-[var(--text-article-body)]">
              Tem conhecimento para compartilhar? Ajude a comunidade escrevendo artigos e tutoriais educacionais.
            </p>
            <div className="flex flex-wrap gap-4">
              <SocialLinks variant="buttons" platforms={['discord', 'telegram']} />
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
