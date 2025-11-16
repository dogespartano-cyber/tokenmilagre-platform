'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Category {
  id: string;
  label: string;
}

interface ResourceFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  categories: Category[];
  totalResults: number;
  activeFiltersCount: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onClearFilters: () => void;
}

export default function ResourceFilters({
  searchTerm,
  selectedCategory,
  categories,
  totalResults,
  activeFiltersCount,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
}: ResourceFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Campo de Busca + Botão Limpar */}
      <div className="flex items-center gap-3 max-w-2xl">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Buscar por nome, descrição ou tag..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-medium)',
              color: 'var(--text-primary)'
            }}
            aria-label="Buscar recursos por nome, descrição ou tag"
            role="searchbox"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--text-tertiary)' }}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:scale-110"
              style={{ color: 'var(--text-tertiary)' }}
              aria-label="Limpar busca"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="px-4 py-3 rounded-xl font-semibold transition-all hover:scale-105 whitespace-nowrap"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--brand-primary)',
              border: '2px solid var(--border-medium)'
            }}
            aria-label={`Limpar ${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} ativo${activeFiltersCount > 1 ? 's' : ''}`}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Categorias */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg ${
                selectedCategory === cat.id
                  ? 'shadow-md'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: selectedCategory === cat.id ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                color: selectedCategory === cat.id ? 'var(--text-inverse)' : 'var(--text-secondary)'
              }}
              aria-label={`Filtrar por categoria: ${cat.label}`}
              aria-pressed={selectedCategory === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Separador */}
        <div className="h-8 w-px" style={{ backgroundColor: 'var(--border-light)' }}></div>

        {/* Contador */}
        <div className="ml-auto" role="status" aria-live="polite">
          <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
            {totalResults} {totalResults === 1 ? 'recurso' : 'recursos'}
          </p>
        </div>
      </div>
    </div>
  );
}
