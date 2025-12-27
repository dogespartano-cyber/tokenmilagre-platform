'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { usePaginationData } from '@/lib/shared/hooks/usePaginationData';
import Pagination from '@/components/shared/Pagination';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
 faClock, faArrowRight, faSearch, faTimes, faArrowUp, faFilter,
 faBookOpen, faShield, faQuestionCircle, faWallet, faCoins, faExclamationTriangle,
 faChartLine, faGraduationCap, faCode, faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { getLevelGradient, getLevelColor, getLevelIcon } from '@/lib/shared/utils/level-helpers';
import { getCategoryIcon } from '@/lib/shared/utils/category-helpers';
import TruthDetector from '@/components/education/TruthDetector';
import SocialLinks from '@/components/shared/SocialLinks';
import { useEducationFilters, categories, levels } from '@/contexts/EducationFilterContext';
import { useSidebar } from '@/contexts/SidebarContext';
import ZenithCard from '@/components/ui/ZenithCard'; // Imported ZenithCard
import PageWrapper from '@/components/layout/PageWrapper';

// Header config - inline para IA reconhecer
const pageHeader = {
 title: 'Educação',
 description: 'Artigos e tutoriais gratuitos criados pela comunidade. Sem promessas falsas, apenas conhecimento real.',
 shortTitle: 'Educação'
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
 const [showCategoryFilter, setShowCategoryFilter] = useState(false);

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

   <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-4 lg:py-8 relative">
    <div className="space-y-8">

     {/* Cards Introdutórios - 8 Temas (Estáticos) */}
     <section id="comece-por-aqui" className="space-y-6 scroll-mt-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
       {[
        { icon: faBookOpen, title: 'Comece pelo Básico', desc: 'Entenda o que é cripto e onde as pessoas mais erram', slug: 'fundamentos-cripto', variant: 'teal' },
        { icon: faShield, title: 'Segurança Primeiro', desc: 'Seed phrase, golpes e hábitos que protegem você', slug: 'seguranca-primeiro', variant: 'teal' },
        { icon: faWallet, title: 'Carteiras e Custódia', desc: 'Hot vs cold wallet, autocustódia e boas práticas', slug: 'carteiras-e-custodia', variant: 'teal' },
        { icon: faExclamationTriangle, title: 'Golpes Comuns', desc: 'Phishing, airdrop falso, links maliciosos e aprovações', slug: 'golpes-comuns-cripto', variant: 'teal' },
       ].map((card, index) => {
        const CardContent = (
         <div className="relative z-10">
          {/* Icon Container */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 bg-[var(--bg-page)] text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] group-hover:scale-110 transition-all duration-300">
           <FontAwesomeIcon icon={card.icon} className="w-5 h-5" />
          </div>

<h3 className="title-newtab text-lg mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
           {card.title}
          </h3>

          <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed line-clamp-2">
           {card.desc}
          </p>
         </div>
        );

        return card.slug ? (
         <ZenithCard
          key={index}
          as={Link}
          href={`/educacao/${card.slug}`}
          className="cursor-pointer"
          variant={card.variant as any}
         >
          {CardContent}
         </ZenithCard>
        ) : (
         <ZenithCard key={index} variant={card.variant as any}>
          {CardContent}
         </ZenithCard>
        );
       })}
      </div>
     </section>

     {/* Divider */}
     <div className="border-t border-[var(--border-light)]"></div>

     {/* Trilhas de Aprendizado */}
     <section id="trilhas" className="space-y-8 scroll-mt-24">
      <div className="text-left">
<h2 className="title-newtab text-2xl">
        Trilhas de Aprendizado
       </h2>
       <p className="text-[var(--text-secondary)] mt-1">
        Escolha uma trilha. Ganhe clareza sobre qual nível de conhecimento você está.
       </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       {/* Iniciante */}
       <ZenithCard variant="success">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-emerald-500/10 ">
         <FontAwesomeIcon icon={faGraduationCap} className="w-7 h-7" />
        </div>
<h3 className="title-newtab text-xl mb-2">Iniciante</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
         Para quem quer entender o básico com segurança e evitar armadilhas.
        </p>
        <ul className="text-xs text-[var(--text-tertiary)] space-y-1 mb-4">
         <li>• Fundamentos do Bitcoin</li>
         <li>• Segurança e autocustódia</li>
         <li>• Redes e taxas</li>
         <li>• DYOR e transparência</li>
        </ul>
       </ZenithCard>

       {/* Intermediário */}
       <ZenithCard variant="warning">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-amber-500/10 ">
         <FontAwesomeIcon icon={faChartLine} className="w-7 h-7" />
        </div>
<h3 className="title-newtab text-xl mb-2">Intermediário</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
         Para quem já entende o básico e quer operar com mais consciência.
        </p>
        <ul className="text-xs text-[var(--text-tertiary)] space-y-1 mb-4">
         <li>• Stablecoins e riscos reais</li>
         <li>• DeFi com prudência</li>
         <li>• Leitura de notícias</li>
         <li>• Gestão de risco</li>
        </ul>
       </ZenithCard>

       {/* Avançado */}
       <ZenithCard variant="danger">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-red-500/10 ">
         <FontAwesomeIcon icon={faCode} className="w-7 h-7" />
        </div>
<h3 className="title-newtab text-xl mb-2">Avançado</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
         Para quem quer profundidade técnica e pensamento crítico.
        </p>
        <ul className="text-xs text-[var(--text-tertiary)] space-y-1 mb-4">
         <li>• Análise on-chain</li>
         <li>• Tokenomics e incentivos</li>
         <li>• Segurança avançada</li>
         <li>• Leitura de contratos</li>
        </ul>
       </ZenithCard>
      </div>
     </section>

     {/* Divider */}
     <div className="border-t border-[var(--border-light)]"></div>


     {/* Filtros e Artigos - Título adicionado */}
     <section id="artigos" className="space-y-6 scroll-mt-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
       <div className="text-left w-full md:w-auto">
<h2 className="title-newtab text-2xl">
         Todos os Artigos
        </h2>
        <p className="text-[var(--text-secondary)] mt-1">
         Explore todos os conteúdos educacionais ou filtre por categoria e nível.
        </p>
       </div>

       {/* Search + Levels + Clear */}
       {/* Desktop Only Search & Filters (Hidden on Mobile) */}
       <div className="hidden md:flex items-center gap-3">
        {/* Standard Desktop Search */}
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

        <div className="w-px h-6 bg-[var(--border-light)]" />

        {/* Desktop Level Icons */}
        <button
         onClick={() => setSelectedLevel(selectedLevel === 'iniciante' ? '' : 'iniciante')}
         className={`p-2.5 rounded-xl border transition-all ${selectedLevel === 'iniciante' ? 'bg-emerald-500/10 border-emerald-500/30 ' : 'bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-tertiary)] hover:border-emerald-500/30'}`}
         title="Iniciante"
        >
         <FontAwesomeIcon icon={getLevelIcon('iniciante')} className="w-4 h-4" />
        </button>

        <button
         onClick={() => setSelectedLevel(selectedLevel === 'intermediario' ? '' : 'intermediario')}
         className={`p-2.5 rounded-xl border transition-all ${selectedLevel === 'intermediario' ? 'bg-amber-500/10 border-amber-500/30 ' : 'bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-tertiary)] hover:border-amber-500/30'}`}
         title="Intermediário"
        >
         <FontAwesomeIcon icon={getLevelIcon('intermediario')} className="w-4 h-4" />
        </button>

        <button
         onClick={() => setSelectedLevel(selectedLevel === 'avancado' ? '' : 'avancado')}
         className={`p-2.5 rounded-xl border transition-all ${selectedLevel === 'avancado' ? 'bg-red-500/10 border-red-500/30 ' : 'bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-tertiary)] hover:border-red-500/30'}`}
         title="Avançado"
        >
         <FontAwesomeIcon icon={getLevelIcon('avancado')} className="w-4 h-4" />
        </button>

        {/* Desktop Category Filter */}
        <div className="w-px h-6 bg-[var(--border-light)]" />

        <div className="relative">
         <button
          onClick={() => setShowCategoryFilter(!showCategoryFilter)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all font-medium text-sm ${selectedCategory !== 'all'
           ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]/30 text-[var(--brand-primary)]'
           : 'bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)]/30'
           }`}
         >
          <FontAwesomeIcon icon={faFilter} className="w-3.5 h-3.5" />
          <span>{selectedCategory !== 'all' ? categories.find(c => c.id === selectedCategory)?.label : 'Categorias'}</span>
          <FontAwesomeIcon icon={faChevronDown} className={`w-3 h-3 transition-transform duration-300 ${showCategoryFilter ? 'rotate-180' : ''}`} />
         </button>

         {showCategoryFilter && (
          <>
           <div className="fixed inset-0 z-10" onClick={() => setShowCategoryFilter(false)} />
           <div className="absolute right-0 top-full mt-2 w-56 p-2 bg-[var(--bg-elevated)] border border-[var(--border-light)] rounded-xl shadow-xl z-20 animate-fade-in-up flex flex-col gap-1">
            {categories.map((cat) => (
             <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setShowCategoryFilter(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${selectedCategory === cat.id ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:'}`}>
              <span>{cat.label}</span>
              {selectedCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />}
             </button>
            ))}
           </div>
          </>
         )}
        </div>
       </div>

       {/* Mobile-First Search & Filter Section (Visible only on Mobile) */}
       <div className="flex md:hidden flex-col gap-4 w-full mt-4">

        {/* 1. Search Bar - Full Width & Prominent */}
        <div className="relative w-full group">
         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-[var(--text-tertiary)] group-focus-within:text-[var(--brand-primary)] transition-colors" />
         </div>
         <input
          type="text"
          placeholder="O que você quer aprender hoje?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-11 pr-10 py-3.5 rounded-xl bg-[var(--bg-secondary)] border-2 border-transparent focus:border-[var(--brand-primary)]/20 focus:bg-[var(--bg-elevated)] placeholder:text-[var(--text-tertiary)] transition-all outline-none font-medium text-sm shadow-sm"
         />
         {searchTerm && (
          <button
           onClick={() => setSearchTerm('')}
           className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          >
           <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
          </button>
         )}
        </div>

        {/* 2. Horizontal Scrollable Filter Row */}
        <div className="flex flex-wrap items-center gap-2 w-full">

         {/* Category Filter - Main Pill */}
         <div className="relative">
          <button
           onClick={() => setShowCategoryFilter(!showCategoryFilter)}
           className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all font-medium text-sm whitespace-nowrap active:scale-95 touch-manipulation ${selectedCategory !== 'all'
            ? 'bg-[var(--brand-primary)] text-white border-transparent shadow-md shadow-[var(--brand-primary)]/20'
            : 'bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/50'
            }`}
          >
           <FontAwesomeIcon icon={faFilter} className="w-3.5 h-3.5" />
           <span>{selectedCategory !== 'all' ? categories.find(c => c.id === selectedCategory)?.label : 'Categorias'}</span>
           <FontAwesomeIcon icon={faChevronDown} className={`w-3 h-3 ml-1 transition-transform duration-200 ${showCategoryFilter ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown - Mobile Optimized Overlay */}
          {showCategoryFilter && (
           <>
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setShowCategoryFilter(false)} />
            <div className="absolute top-full left-0 mt-2 w-64 max-w-[90vw] p-2 bg-[var(--bg-elevated)] border border-[var(--border-light)] rounded-2xl shadow-xl z-50 animate-scale-in origin-top-left flex flex-col gap-1">
             <div className="px-3 py-2 text-xs font-bold uppercase text-[var(--text-tertiary)] tracking-wider">Filtrar por Categoria</div>
             {categories.map((cat) => (
              <button
               key={cat.id}
               onClick={() => {
                setSelectedCategory(cat.id);
                setShowCategoryFilter(false);
               }}
               className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between ${selectedCategory === cat.id
                ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
               <span>{cat.label}</span>
               {selectedCategory === cat.id && <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />}
              </button>
             ))}
            </div>
           </>
          )}
         </div>

         <div className="w-px h-6 bg-[var(--border-light)] mx-1 hidden sm:block" />

         {/* Level Pills - Visual Selection */}
         <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {[
           { id: 'iniciante', label: 'Iniciante', icon: 'iniciante', color: 'emerald' },
           { id: 'intermediario', label: 'Intermed.', icon: 'intermediario', color: 'amber' },
           { id: 'avancado', label: 'Avançado', icon: 'avancado', color: 'red' }
          ].map((lvl) => {
           const isSelected = selectedLevel === lvl.id;
           const activeClass = isSelected
            ? lvl.id === 'iniciante' ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20 shadow-md'
             : lvl.id === 'intermediario' ? 'bg-amber-500 text-white border-amber-500 shadow-amber-500/20 shadow-md'
              : 'bg-red-500 text-white border-red-500 shadow-red-500/20 shadow-md'
            : 'bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-tertiary)] hover:bg-[var(--bg-elevated)]';

           return (
            <button
             key={lvl.id}
             onClick={() => setSelectedLevel(isSelected ? '' : lvl.id)}
             className={`px-3 py-2.5 rounded-full border text-xs font-bold transition-all flex items-center gap-2 active:scale-95 touch-manipulation ${activeClass}`}
            >
             <FontAwesomeIcon icon={getLevelIcon(lvl.id)} className="w-3.5 h-3.5" />
             <span className="hidden sm:inline">{lvl.label}</span>
            </button>
           );
          })}
         </div>

         {/* Clear Filters (Dynamic) */}
         {(selectedCategory !== 'all' || selectedLevel || searchTerm) && (
          <button
           onClick={clearAllFilters}
           className="p-2.5 rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all ml-auto active:scale-95 flex items-center justify-center"
           title="Limpar filtros"
          >
           <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5" />
          </button>
         )}
        </div>
       </div>
      </div>

      <div className="space-y-6">


       {/* Lista de Recursos - NOVO DESIGN COM GLASSMORPHISM */}
       <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredResources.map((resource) => (
         <ZenithCard
          key={resource.id}
          as={Link}
          href={`/educacao/${resource.slug}`}
          className="flex flex-col h-full"
          variant={resource.level === 'iniciante' ? 'success' : resource.level === 'intermediario' ? 'warning' : resource.level === 'avancado' ? 'danger' : 'default'}
         >

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
<h3 className="title-newtab text-xl mb-3 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
            {resource.title}
           </h3>

           {/* Description */}
           <p className="text-sm mb-4 line-clamp-3 leading-relaxed text-[var(--text-secondary)]">
            {resource.description}
           </p>

           {/* CTA */}
           <div className="flex items-center text-sm font-bold text-[var(--brand-primary)] opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            Ler artigo <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-1" />
           </div>
          </div>
         </ZenithCard>
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
<h2 className="title-newtab text-2xl">
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
         <summary className="font-bold cursor-pointer list-none flex items-center justify-between">
          {faq.q}
          <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5 text-[var(--text-tertiary)] group-open:rotate-180 transition-transform" />
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
<h2 className="text-3xl title-newtab ">
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
