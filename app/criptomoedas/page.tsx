'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faNewspaper, faClock } from '@fortawesome/free-solid-svg-icons';
import CustomCryptoScreener from '@/components/crypto/CustomCryptoScreener';
import PageWrapper from '@/components/layout/PageWrapper';

// Header config - inline para IA reconhecer
const pageHeader = {
 title: 'Criptomoedas',
 description: 'Acompanhe o preço, volume e tendências das principais criptomoedas do mercado.',
 shortTitle: 'Criptomoedas'
};

interface NewsItem {
 id: string;
 slug: string;
 title: string;
 summary: string;
 url: string;
 source: string;
 publishedAt: string;
 category: string[];
 sentiment: 'positive' | 'neutral' | 'negative';
 keywords: string[];
}

export default function CriptomoedasPage() {
 const [news, setNews] = useState<NewsItem[]>([]);
 const [loadingNews, setLoadingNews] = useState(false);

 // Forçar scroll para o topo ao montar (fix para bug de scroll)
 useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
 }, []);

 // Buscar notícias
 useEffect(() => {
  const fetchNews = async () => {
   setLoadingNews(true);
   try {
    const response = await fetch('/api/news');
    const result = await response.json();

    if (result.success) {
     // Limitar a 6 notícias
     setNews(result.data.slice(0, 6));
    }
   } catch (error) {
    console.error('Erro ao buscar notícias:', error);
   } finally {
    setLoadingNews(false);
   }
  };

  fetchNews();
 }, []);

 const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `Há ${diffMins}min`;
  if (diffHours < 24) return `Há ${diffHours}h`;
  return `Há ${diffDays}d`;
 };

 const getSentimentColorClass = (sentiment: string) => {
  switch (sentiment) {
   case 'positive': return 'bg-emerald-500 text-white';
   case 'negative': return 'bg-red-500 text-white';
   default: return 'bg-amber-500 text-white';
  }
 };

 const getSentimentLabel = (sentiment: string) => {
  switch (sentiment) {
   case 'positive': return 'Positiva';
   case 'negative': return 'Negativa';
   default: return 'Neutra';
  }
 };

 return (
  <PageWrapper header={pageHeader}>
   <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-4 lg:py-8">
    <div className="space-y-16">
     {/* Rastreador de Mercado */}
     <div className="space-y-8">
      <CustomCryptoScreener />

      {/* Notícias Relacionadas */}
      {!loadingNews && news.length > 0 && (
       <div className="space-y-6">
        <div className="pl-2 border-l-4 border-[var(--brand-primary)]">
<h2 className="title-newtab text-2xl">
          Notícias
         </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {news.map((newsItem) => (
          <Link
           key={newsItem.id}
           href={newsItem.url}
           className="glass-card group flex flex-col p-5 rounded-2xl border border-[var(--border-article)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--brand-primary)]/50"
          >
           {/* Header: Category + Sentiment */}
           <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[var(--bg-article-tag)] text-[var(--text-article-muted)] uppercase tracking-wide">
             {newsItem.category[0]}
            </span>
            <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md ${newsItem.sentiment === 'positive' ? ' bg-emerald-500/10' :
             newsItem.sentiment === 'negative' ? ' bg-red-500/10' :
              ' bg-amber-500/10'
             }`}>
             <div className={`w-1.5 h-1.5 rounded-full ${newsItem.sentiment === 'positive' ? 'bg-emerald-500' :
              newsItem.sentiment === 'negative' ? 'bg-red-500' :
               'bg-amber-500'
              }`} />
             {newsItem.sentiment === 'positive' ? 'Positivo' : newsItem.sentiment === 'negative' ? 'Negativo' : 'Neutro'}
            </div>
           </div>

           {/* Title */}
<h3 className="title-newtab text-lg mb-3 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
            {newsItem.title}
           </h3>

           {/* Summary */}
           <p className="text-sm mb-4 line-clamp-3 text-[var(--text-article-body)] flex-grow">
            {newsItem.summary}
           </p>

           {/* Footer: Time + Arrow */}
           <div className="flex items-center justify-between pt-4 border-t border-[var(--border-article)] mt-auto">
            <div className="flex items-center gap-2 text-xs text-[var(--text-article-muted)]">
             <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
             {getTimeAgo(newsItem.publishedAt)}
            </div>
            <FontAwesomeIcon
             icon={faArrowRight}
             className="w-4 h-4 text-[var(--brand-primary)] transition-transform group-hover:translate-x-1"
            />
           </div>
          </Link>
         ))}
        </div>

        {/* Ver mais notícias */}
        <div className="flex justify-start pt-4">
         <Link
          href="/noticias"
          className="glass-card inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all hover:gap-3 bg-[var(--brand-primary)]/10 hover:bg-[var(--brand-primary)]/20 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] shadow-lg hover:shadow-xl hover:opacity-90 transform hover:-translate-y-0.5"
         >
          Ver todas as notícias
          <FontAwesomeIcon icon={faArrowRight} />
         </Link>
        </div>
       </div>
      )}
     </div>
    </div>
   </div>
  </PageWrapper>
 );
}
