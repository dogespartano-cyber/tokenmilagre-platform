import Link from 'next/link';
import { Resource } from '@/lib/resources';
import { getCategoryGradient, getAllCategories } from '@/lib/category-helpers';
import { MAX_VISIBLE_TAGS } from '@/lib/constants';

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
          className="glass-card group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer block border-t-4"
          style={{
            borderTopColor: getCategoryGradient(resource.category).split(',')[0] // Use the first color of the gradient for the top border
          }}
          aria-label={`Ver detalhes de ${resource.name} - ${resource.shortDescription}`}
          role="listitem"
        >
          {/* Hover Glow Effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
            style={{
              background: getCategoryGradient(resource.category)
            }}
          />

          {/* Content wrapper */}
          <div className="relative flex flex-col h-full z-10">
            {/* Header do Card */}
            <div className="flex items-start justify-between mb-4">
              {/* Badge de Categoria */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-light)]">
                <span className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
                  {categories.find(c => c.id === resource.category)?.label || resource.category}
                </span>
              </div>
            </div>

            {/* Título */}
            <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors min-h-[3.5rem] text-[var(--text-primary)]">
              {resource.name}
            </h3>

            {/* Descrição */}
            <p className="text-sm mb-4 line-clamp-3 leading-relaxed opacity-90 min-h-[4.5rem] text-[var(--text-secondary)]">
              {resource.shortDescription}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {resource.tags.slice(0, MAX_VISIBLE_TAGS).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Plataformas */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {resource.platforms.map((platform, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded text-xs font-semibold bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-light)]"
                >
                  {platform}
                </span>
              ))}
            </div>

            {/* Spacer to push content to bottom */}
            <div className="flex-grow"></div>
          </div>
        </Link>
      ))}
    </div>
  );
}
