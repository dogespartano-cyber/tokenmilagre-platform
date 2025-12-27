import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/domains/resources/legacy-api';
import { useState, useEffect, useRef } from 'react';

interface RelatedResourcesProps {
 relatedResources: Resource[];
}

export default function RelatedResources({ relatedResources }: RelatedResourcesProps) {
 if (!relatedResources || relatedResources.length === 0) return null;

 // Limit to 6 items
 const displayResources = relatedResources.slice(0, 6);

 const scrollRef = useRef<HTMLDivElement>(null);
 const [isPaused, setIsPaused] = useState(false);

 // Auto-scroll effect
 useEffect(() => {
  const container = scrollRef.current;
  if (!container || displayResources.length <= 3) return;

  let scrollAmount = 0;
  const cardWidth = 320; // Approximate card width + gap
  const maxScroll = container.scrollWidth - container.clientWidth;

  const interval = setInterval(() => {
   if (!isPaused && container) {
    scrollAmount += cardWidth;
    if (scrollAmount > maxScroll) {
     scrollAmount = 0;
    }
    container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
   }
  }, 4000);

  return () => clearInterval(interval);
 }, [isPaused, displayResources.length]);

 return (
  <>
   <section className="space-y-8">
<h2 className="text-2xl title-newtab" style={{ color: 'var(--text-primary)' }}>
     Você Também Pode Gostar
    </h2>
    <div
     ref={scrollRef}
     className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
     onMouseEnter={() => setIsPaused(true)}
     onMouseLeave={() => setIsPaused(false)}
    >
     {displayResources.map((relatedResource) => (
      <Link
       key={relatedResource.slug}
       href={`/recursos/${relatedResource.slug}`}
       className="group block flex-shrink-0 w-[280px]"
       aria-label={`Ver detalhes de ${relatedResource.name}`}
      >
       <div className="space-y-4 h-full flex flex-col p-4 rounded-2xl border border-[var(--border-light)] hover:border-[var(--brand-primary)]/50 transition-all backdrop-blur-xl bg-white/5 hover:bg-white/10">
        <div className="flex items-center justify-between">
         <span
          className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
          style={{
           backgroundColor: 'var(--bg-elevated)',
           color: 'var(--text-tertiary)'
          }}
         >
          {relatedResource.category === 'browsers' ? 'Navegador' : relatedResource.category}
         </span>
         <div
          className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
          style={{
           backgroundColor: 'var(--bg-elevated)',
           color: 'var(--text-secondary)'
          }}
          aria-hidden="true"
         >
          <svg
           className="w-4 h-4"
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24"
          >
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
         </div>
        </div>
        <div>
<h3 className="title-newtab text-lg mb-2 font-inter group-hover:text-[var(--brand-primary)] transition-colors" style={{ color: 'var(--text-primary)' }}>
          {relatedResource.name}
         </h3>
         <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {relatedResource.shortDescription}
         </p>
        </div>
       </div>
      </Link>
     ))}
    </div>
   </section>
  </>
 );
}
