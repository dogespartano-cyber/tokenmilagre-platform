import Link from 'next/link';
import { Resource } from '@/lib/domains/resources/legacy-api';
import { getCategoryGradient, getAllCategories } from '@/lib/shared/utils/categories';
import { MAX_VISIBLE_TAGS } from '@/lib/core/constants/ui';
import ZenithCard from '@/components/ui/ZenithCard';

interface ResourceGridProps {
 resources: Resource[];
 searchTerm: string;
 onClearFilters: () => void;
}

const VARIANT_MAP: Record<string, 'teal' | 'orange' | 'danger' | 'indigo' | 'violet' | 'warning' | 'success' | 'info' | 'slate'> = {
 // Wallets
 'wallet': 'orange',
 'wallets': 'orange',
 // Exchanges
 'exchange': 'teal',
 'exchanges': 'teal',
 // DeFi
 'defi': 'indigo',
 'defi-protocol': 'indigo',
 // Tools & Dev
 'development-tools': 'info',
 'tools': 'info',
 'analytics': 'info',
 'explorers': 'slate',
 'browsers': 'slate',
 'portfolio-tracker': 'success',
 // Content
 'education': 'violet',
 'news': 'violet',
 // Others
 'nfts': 'warning',
 'games': 'success',
 'utilities': 'info'
};

const BADGE_STYLES: Record<string, string> = {
 teal: 'bg-teal-500/10 border-teal-500/20',
 orange: 'bg-orange-500/10 border-orange-500/20',
 danger: 'bg-red-500/10 border-red-500/20',
 indigo: 'bg-indigo-500/10 border-indigo-500/20',
 violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
 warning: 'bg-amber-500/10 border-amber-500/20',
 success: 'bg-emerald-500/10 border-emerald-500/20',
 info: 'bg-cyan-500/10 border-cyan-500/20',
 slate: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
};

export default function ResourceGrid({ resources, searchTerm, onClearFilters }: ResourceGridProps) {
 const categories = getAllCategories();

 if (resources.length === 0) {
  return (
   <div className="text-center py-20">
    <div className="text-6xl mb-6">🔍</div>
<h3 className="title-newtab text-2xl mb-3">
     Nenhum recurso encontrado
    </h3>
    <p className="text-lg mb-6 text-[var(--text-secondary)]">
     {searchTerm ? (
      <>Não encontramos recursos para "<span className="font-semibold">{searchTerm}</span>"</>
     ) : (
      <>Não há recursos nesta categoria</>
     )}
    </p>
    <button
     onClick={onClearFilters}
     className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg bg-[var(--brand-primary)] text-[var(--text-inverse)]"
     aria-label="Limpar todos os filtros e mostrar todos os recursos"
    >
     Limpar filtros e ver todos
    </button>
   </div>
  );
 }

 return (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list">
   {resources.map((resource) => {
    const variant = VARIANT_MAP[resource.category] || 'slate';
    const badgeClass = BADGE_STYLES[variant] || BADGE_STYLES.slate;

    return (
     <ZenithCard
      key={resource.id}
      as={Link}
      href={`/recursos/${resource.slug}`}
      className="flex flex-col h-full cursor-pointer"
      aria-label={`Ver detalhes de ${resource.name} - ${resource.shortDescription}`}
      role="listitem"
      variant={variant}
     >
      {/* Content wrapper */}
      <div className="relative flex flex-col h-full z-10">

       {/* Categoria Minimalista (Badge com Fundo) */}
       <div className="mb-3">
        <span
         className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${badgeClass}`}
        >
         {categories.find(c => c.id === resource.category)?.label || resource.category}
        </span>
       </div>

       {/* Título */}
<h3 className="title-newtab text-2xl mb-3 group-hover:text-[var(--brand-primary)] transition-colors">
        {resource.name}
       </h3>

       {/* Descrição */}
       <p className="text-sm mb-6 line-clamp-3 leading-relaxed opacity-80 text-[var(--text-secondary)]">
        {resource.shortDescription}
       </p>

       {/* Spacer */}
       <div className="flex-grow"></div>

       {/* Footer Minimalista */}
       <div className="flex flex-col gap-3 pt-4 border-t border-zinc-200/20 dark:border-white/5">

        {/* Plataformas (Texto Simples) */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
         <span className="font-semibold opacity-50">PLATAFORMAS:</span>
         <div className="flex flex-wrap gap-2">
          {resource.platforms.map((platform, index) => (
           <span key={index}>{platform}</span>
          ))}
         </div>
        </div>

        {/* Tags (Pills muito sutis) */}
        <div className="flex flex-wrap gap-1.5">
         {resource.tags.slice(0, 3).map((tag, index) => (
          <span
           key={index}
           className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/5 text-[var(--text-tertiary)]"
          >
           #{tag}
          </span>
         ))}
        </div>
       </div>

      </div>
     </ZenithCard>
    );
   })}
  </div>
 );
}
