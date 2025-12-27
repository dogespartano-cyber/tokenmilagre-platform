'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faClock, faArrowRight, faFilter } from '@fortawesome/free-solid-svg-icons';
import PageWrapper from '@/components/layout/PageWrapper';
import NewsTimeline from '@/components/news/NewsTimeline';

// Header config - inline para IA reconhecer
const pageHeader = {
 title: 'Notícias',
 description: 'Análises e atualizações do mercado cripto',
 shortTitle: 'Notícias'
};

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

export default function NoticiasPage() {
 const [news, setNews] = useState<NewsItem[]>([]);
 const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
 const [loading, setLoading] = useState(true);

 const [searchTerm, setSearchTerm] = useState('');

 const [selectedSentiment, setSelectedSentiment] = useState<string>('all');


 // Estados de paginação para infinite scroll
 const [page, setPage] = useState(1);
 const [hasMore, setHasMore] = useState(true);
 const [isLoadingMore, setIsLoadingMore] = useState(false);


 // Estado para sidebar/drawer (agora unificado para desktop e mobile)
 const [showFilters, setShowFilters] = useState(false);

 // Função para buscar notícias (definida cedo para ser usada em useEffect)
 const fetchNews = useCallback(async (pageNum: number = 1, append: boolean = false) => {
  if (append) {
   setIsLoadingMore(true);
  } else {
   setLoading(true);
  }

  try {
   // Cache-busting: adicionar timestamp para garantir requisições frescas
   const timestamp = Date.now();
   const url = `/api/articles?type=news&page=${pageNum}&limit=12&_t=${timestamp}`;

   const articlesRes = await fetch(url, {
    cache: 'no-store',
    next: { revalidate: 0 }
   });
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
 }, []);

 // Capturar parâmetro de busca da URL
 useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  if (searchParam) {
   setSearchTerm(decodeURIComponent(searchParam));
  }
 }, []);

 // Carregar notícias na montagem inicial
 useEffect(() => {
  fetchNews();
 }, [fetchNews]);


 // Carregar mais artigos (infinite scroll)
 const loadMore = useCallback(() => {
  if (!isLoadingMore && hasMore) {
   fetchNews(page + 1, true);
  }
 }, [page, hasMore, isLoadingMore, fetchNews]);



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

  // Ordenação (Padrão: Mais recentes)
  filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  setFilteredNews(filtered);
 }, [searchTerm, news, selectedSentiment]);

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
  setShowFilters(true); // Abrir filtros para mostrar que a busca foi aplicada
  window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const clearAllFilters = () => {
  setSearchTerm('');
  setSelectedSentiment('all');

 };

 // Bloquear scroll do body quando filtros estiverem abertos
 useEffect(() => {
  if (showFilters) {
   document.body.style.overflow = 'hidden';
  } else {
   document.body.style.overflow = 'unset';
  }
  return () => {
   document.body.style.overflow = 'unset';
  };
 }, [showFilters]);

 const getActiveFiltersCount = () => {
  let count = 0;
  if (searchTerm) count++;
  if (selectedSentiment !== 'all') count++;

  return count;
 };

 return (
  <PageWrapper header={pageHeader}>
   <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-4 lg:py-8 relative">
    <button
     onClick={() => setShowFilters(true)}
     className="glass-card fixed bottom-24 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 text-[var(--text-primary)]"
     aria-label="Filtrar notícias"
    >
     <div className="relative">
      <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
      {getActiveFiltersCount() > 0 && (
       <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-[var(--brand-primary)] text-white">
        {getActiveFiltersCount()}
       </span>
      )}
     </div>
    </button>

    <div>

     {/* Modal de Filtros (Redesign Harmonioso - Variáveis Isoladas) */}
     {showFilters && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <div
        className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setShowFilters(false)}
       />

       <div className="relative w-full max-w-4xl bg-[var(--bg-modal)] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in flex flex-col border border-[var(--border-modal)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-modal)]">
<h2 className="title-newtab text-2xl text-[var(--text-modal)]">Filtrar Notícias</h2>
         <div className="flex items-center gap-3">
          {getActiveFiltersCount() > 0 && (
           <button
            onClick={clearAllFilters}
            className="text-sm font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
           >
            Limpar Filtros
           </button>
          )}
          <button
           onClick={() => setShowFilters(false)}
           className="p-2 rounded-lg hover:bg-[var(--bg-modal-hover)] text-[var(--text-modal-muted)] hover:text-[var(--text-modal)] transition-colors"
          >
           <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
          </button>
         </div>
        </div>

        <div className="p-6 space-y-8">

         {/* Busca (Full Width) */}
         <div className="space-y-3">
          <label className="text-xs font-bold text-[var(--text-modal-muted)] uppercase tracking-wider">Buscar</label>
          <div className="relative">
           <input
            type="text"
            placeholder="Pesquisar por palavras-chave, tokens ou temas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--bg-modal-input)] border border-[var(--border-modal)] text-[var(--text-modal)] text-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all placeholder-[var(--text-modal-muted)]"
           />
           <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-modal-muted)] text-lg"
           />
           {searchTerm && (
            <button
             onClick={() => setSearchTerm('')}
             className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-modal-muted)] hover:text-[var(--text-modal)]"
            >
             <FontAwesomeIcon icon={faTimes} />
            </button>
           )}
          </div>
         </div>

         <div className="grid lg:grid-cols-2 gap-8">

          {/* Coluna Esquerda: Filtros (Full width now) */}
          <div className="lg:col-span-2 space-y-6">



           {/* Sentimento */}
           <div className="space-y-3">
            <label className="text-xs font-bold text-[var(--text-modal-muted)] uppercase tracking-wider">Sentimento</label>
            <div className="flex flex-col gap-2">
             <div className="flex flex-wrap gap-2">
              <button
               onClick={() => setSelectedSentiment(selectedSentiment === 'positive' ? 'all' : 'positive')}
               className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all backdrop-blur-md border ${selectedSentiment === 'positive'
                ? 'bg-emerald-500/20 border-emerald-500/30 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-[var(--text-secondary)]'
                }`}
              >
               Positivo
              </button>
              <button
               onClick={() => setSelectedSentiment(selectedSentiment === 'neutral' ? 'all' : 'neutral')}
               className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all backdrop-blur-md border ${selectedSentiment === 'neutral'
                ? 'bg-amber-500/20 border-amber-500/30 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-[var(--text-secondary)]'
                }`}
              >
               Neutro
              </button>
              <button
               onClick={() => setSelectedSentiment(selectedSentiment === 'negative' ? 'all' : 'negative')}
               className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all backdrop-blur-md border ${selectedSentiment === 'negative'
                ? 'bg-red-500/20 border-red-500/30 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-[var(--text-secondary)]'
                }`}
              >
               Negativo
              </button>
             </div>
            </div>
           </div>

          </div>
         </div>

        </div>

       </div>
      </div>
     )}

     {/* Main Content - Grid de 3 Colunas */}
     <main>
      {!loading && filteredNews.length === 0 ? (
       <div className="text-center py-20 glass-card rounded-2xl">
        <div className="text-6xl mb-4">🔍</div>
<h3 className="title-newtab text-xl mb-2">Nenhuma notícia encontrada</h3>
        <p className="text-[var(--text-secondary)] mb-6">Tente ajustar seus filtros ou buscar por outro termo.</p>
        <button
         onClick={clearAllFilters}
         className="px-6 py-2 rounded-lg bg-[var(--brand-primary)] text-white font-semibold hover:opacity-90 transition-opacity"
        >
         Limpar Filtros
        </button>
       </div>
      ) : (
       <>
        {filteredNews.length > 0 && <NewsTimeline items={filteredNews} />}

        {/* Loader Infinite Scroll */}
        <div ref={sentinelRef} className="h-4 mt-8" />
        {(isLoadingMore || loading) && (
         <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-[var(--brand-primary)]" />
         </div>
        )}
       </>
      )}
     </main>

    </div>
   </div>
  </PageWrapper>
 );
}
