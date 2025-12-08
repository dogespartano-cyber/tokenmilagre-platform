import Link from 'next/link';
import { Resource } from '@/lib/domains/resources/legacy-api';
import { getCategoryGradient, getAllCategories } from '@/lib/shared/utils/categories';
import { MAX_VISIBLE_TAGS } from '@/lib/core/constants/ui';

interface ResourceGridProps {
  resources: Resource[];
  searchTerm: string;
  onClearFilters: () => void;
}

export default function ResourceGrid({ resources, searchTerm, onClearFilters }: ResourceGridProps) {
  const categories = getAllCategories();

  if (resources.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🔍</div>
        <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">
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
      {resources.map((resource) => (
        <Link
          key={resource.id}
          href={`/recursos/${resource.slug}`}
          className="glass-card group relative rounded-2xl p-6 overflow-hidden border border-white/5 bg-white/5 hover:bg-white/10 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer block"
          aria-label={`Ver detalhes de ${resource.name} - ${resource.shortDescription}`}
          role="listitem"
        >
          {/* Content wrapper */}
          <div className="relative flex flex-col h-full z-10">

            {/* Categoria Minimalista (Texto Colorido) */}
            <div className="mb-3">
              <span
                className="text-xs font-bold uppercase tracking-widest bg-clip-text text-transparent"
                style={{
                  backgroundImage: getCategoryGradient(resource.category)
                }}
              >
                {categories.find(c => c.id === resource.category)?.label || resource.category}
              </span>
            </div>

            {/* Título */}
            <h3 className="font-bold text-2xl mb-3 group-hover:text-[var(--brand-primary)] transition-colors text-[var(--text-primary)]">
              {resource.name}
            </h3>

            {/* Descrição */}
            <p className="text-sm mb-6 line-clamp-3 leading-relaxed opacity-80 text-[var(--text-secondary)]">
              {resource.shortDescription}
            </p>

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* Footer Minimalista */}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">

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
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[var(--text-tertiary)]"
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
  );
}
