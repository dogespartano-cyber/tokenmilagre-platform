'use client';

import { useState, useEffect } from 'react';
import { Resource } from '@/lib/domains/resources/legacy-api';
import { getAllCategories } from '@/lib/shared/utils/categories';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { SEARCH_DEBOUNCE_MS } from '@/lib/core/constants/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
// import ResourceFilters from './components/ResourceFilters'; // Removed
import ResourceGrid from './components/ResourceGrid';
import SecurityTips from './components/SecurityTips';
import DashboardHeader from '@/components/shared/DashboardHeader';


interface RecursosClientProps {
  resources: Resource[];
}

export default function RecursosClient({ resources }: RecursosClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = getAllCategories();

  // Debounce search term - only filter after user stops typing
  const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS);

  const filteredResources = resources.filter(resource => {
    // Filtro por categoria
    const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory;

    // Filtro por termo de busca (usando debouncedSearchTerm para performance)
    const searchMatch = !debouncedSearchTerm.trim() ||
      resource.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      resource.shortDescription.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

    return categoryMatch && searchMatch;
  });

  // Read URL params on mount (one-way sync to avoid SSR issues)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category');

    if (searchParam) setSearchTerm(searchParam);
    if (categoryParam) setSelectedCategory(categoryParam);
  }, []);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (debouncedSearchTerm) count++;
    if (selectedCategory !== 'all') count++;
    return count;
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="space-y-8">
        {/* Header with Discord/Telegram Buttons */}
        {/* Header with Discord/Telegram Buttons - REMOVIDO (Agora gerenciado pelo layout-root) */}

        {/* Filtros Inline */}
        <div className="space-y-6">
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center justify-end mb-4">
              <button
                onClick={clearAllFilters}
                className="text-sm font-bold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faTimes} />
                Limpar Filtros
              </button>
            </div>
          )}

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Busca */}
            <div className="lg:col-span-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nome, descrição ou tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-article)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all placeholder-[var(--text-secondary)]"
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>
            </div>

            {/* Categorias */}
            <div className="lg:col-span-12 space-y-3">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Categorias</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border hover:scale-105 active:scale-95 ${selectedCategory === cat.id
                      ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border-[var(--brand-primary)]/30 shadow-sm hover:bg-[var(--brand-primary)]/30'
                      : 'bg-[var(--bg-page)] hover:bg-[var(--bg-hover)] border-[var(--border-article)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/50 hover:text-[var(--text-primary)]'
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Recursos */}
        <ResourceGrid
          resources={filteredResources}
          searchTerm={debouncedSearchTerm}
          onClearFilters={clearAllFilters}
        />

        {/* Divider */}
        <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

        {/* Dicas de Segurança */}
        <SecurityTips />


      </div>
    </div>
  );
}
