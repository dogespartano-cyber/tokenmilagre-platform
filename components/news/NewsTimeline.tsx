'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  content?: string;
  url?: string;
  source?: string;
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords?: string[];
}

interface NewsTimelineProps {
  items: NewsItem[];
}

export default function NewsTimeline({ items }: NewsTimelineProps) {
  // Group items by Date
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: NewsItem[] } = {};
    const now = new Date();

    items.forEach(item => {
      const date = new Date(item.publishedAt);

      // Check if it's today
      const isToday = date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      // Check if it's yesterday
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

      let key;
      if (isToday) {
        key = 'Hoje';
      } else if (isYesterday) {
        key = 'Ontem';
      } else {
        // Format: "20/12 Sábado"
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        // Get Weekday in Portuguese
        const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const weekday = weekdays[date.getDay()];

        key = `${day}/${month} ${weekday}`;
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    return groups;
  }, [items]);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const published = new Date(date);
    const diffMs = now.getTime() - published.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes} min`;
    if (diffHours < 24) return `${diffHours} horas`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} dias`;
  };

  const shareNews = (item: NewsItem, platform: 'twitter' | 'telegram' | 'whatsapp') => {
    const url = window.location.origin + `/noticias/${item.slug || item.id}`;
    const text = item.title;

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0">
      <div className="relative space-y-16 pb-12">
        {Object.entries(groupedItems).map(([dateLabel, groupItems], groupIndex) => (
          <div key={dateLabel} className="relative">
            {/* Date Header with Horizontal Line */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 flex-shrink-0" />
              <span className="text-sm md:text-base font-bold text-[var(--brand-primary)] capitalize whitespace-nowrap">
                {dateLabel}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 dark:from-zinc-800 via-zinc-200/40 dark:via-zinc-800/40 to-transparent" />
            </div>

            {/* Items Layout: Dynamic Flex (Fills space when few items) */}
            <div className="flex flex-col md:flex-row md:flex-wrap gap-8 md:gap-x-12 md:gap-y-10">
              {groupItems.map((item, index) => (
                <div key={item.id} className="relative group w-full md:w-[calc(50%-24px)] lg:w-[calc(33.333%-32px)] flex-grow">

                  {/* Content Container */}
                  <article className="flex flex-col h-full md:p-0 transition-opacity duration-300 hover:opacity-80">

                    {/* Header: Source, Time & Sentiment */}
                    <div className="flex items-center justify-between mb-3 text-sm">
                      <div className="flex items-center gap-2 text-zinc-500 font-medium">
                        <span>{getTimeAgo(item.publishedAt)}</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${item.sentiment === 'positive' ? 'bg-emerald-500' : item.sentiment === 'negative' ? 'bg-red-500' : 'bg-amber-400'}`} title={`Sentimento: ${item.sentiment === 'positive' ? 'Positivo' : item.sentiment === 'negative' ? 'Negativo' : 'Neutro'}`} />
                    </div>

                    {/* Title */}
                    <Link href={`/noticias/${item.slug || item.id}`} className="block mb-2">
                      <h3 className="title-newtab text-xl leading-tight hover:text-[var(--brand-primary)] transition-colors line-clamp-3">
                        {item.title}
                      </h3>
                    </Link>

                    {/* Summary */}
                    <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-4 line-clamp-3 flex-grow">
                      {item.summary}
                    </p>

                    {/* Footer: Tags & Share */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-light)]/50 border-dashed">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {item.category.slice(0, 1).map(cat => (
                          <span key={cat} className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                            {cat}
                          </span>
                        ))}
                      </div>

                      {/* Share Actions */}
                      <div className="flex items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => shareNews(item, 'twitter')} className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors"><FontAwesomeIcon icon={faXTwitter} className="w-3.5 h-3.5" /></button>
                        <button onClick={() => shareNews(item, 'telegram')} className="text-zinc-400 hover:text-[#0088cc] transition-colors"><FontAwesomeIcon icon={faTelegram} className="w-3.5 h-3.5" /></button>
                        <button onClick={() => shareNews(item, 'whatsapp')} className="text-zinc-400 hover:text-[#25D366] transition-colors"><FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
