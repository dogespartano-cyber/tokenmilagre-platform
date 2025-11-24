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
        <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Nenhum recurso encontrado
        </h3>
        <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
          {searchTerm ? (
            <>Não encontramos recursos para "<span className="font-semibold">{searchTerm}</span>"</>
          ) : (
            <>Não há recursos nesta categoria</>
          )}
        </p>
        <button
          onClick={onClearFilters}
          className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg"
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: 'var(--text-inverse)'
          }}
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
          className="group relative rounded-2xl p-6 overflow-hidden border shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer block"
          style={{
            background: `linear-gradient(135deg, ${getCategoryGradient(resource.category)}, var(--bg-elevated))`,
            borderColor: 'var(--border-light)'
          }}
          aria-label={`Ver detalhes de ${resource.name} - ${resource.shortDescription}`}
          role="listitem"
        >
          {/* Borda verde no topo no hover */}
          <div
            className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'var(--brand-primary)',
              boxShadow: '0 0 20px var(--brand-primary-glow, rgba(245, 158, 11, 0.4))'
            }}
          />

          {/* Content wrapper */}
          <div className="relative flex flex-col h-full">
            {/* Header do Card */}
            <div className="flex items-start justify-between mb-4">
              {/* Badge de Categoria */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-sm" style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)'
              }}>
                <span className="text-xs font-bold uppercase tracking-wide" style={{
                  color: 'var(--text-secondary)'
                }}>
                  {categories.find(c => c.id === resource.category)?.label || resource.category}
                </span>
              </div>
            </div>

            {/* Título */}
            <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors min-h-[3.5rem]" style={{ color: 'var(--text-primary)' }}>
              {resource.name}
            </h3>

            {/* Descrição */}
            <p className="text-sm mb-4 line-clamp-3 leading-relaxed opacity-90 min-h-[4.5rem]" style={{ color: 'var(--text-secondary)' }}>
              {resource.shortDescription}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {resource.tags.slice(0, MAX_VISIBLE_TAGS).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-tertiary)'
                  }}
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
                  className="px-2 py-0.5 rounded text-xs font-semibold backdrop-blur-sm"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-light)'
                  }}
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
