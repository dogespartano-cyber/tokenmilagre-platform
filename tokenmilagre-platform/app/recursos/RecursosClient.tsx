'use client';

import { useState, useEffect } from 'react';
import { Resource } from '@/lib/resources';
import { getAllCategories } from '@/lib/category-helpers';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
// import ResourceFilters from './components/ResourceFilters'; // Removed
import ResourceGrid from './components/ResourceGrid';
import SecurityTips from './components/SecurityTips';
import DashboardHeader from '@/app/components/DashboardHeader';


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
      <div className="space-y-16">
        {/* Header with Discord/Telegram Buttons */}
        <DashboardHeader
          title="Recursos Verificados"
          description="Ferramentas essenciais com links oficiais verificados pela comunidade $MILAGRE. Acesse com segurança."
        />



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

      {/* Floating Filter Button */}
      <button
        onClick={() => setShowFilters(true)}
        className="glass-card fixed bottom-24 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 text-[var(--text-primary)]"
        aria-label="Filtrar recursos"
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

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowFilters(false)}
          />

          <div className="relative w-full max-w-4xl bg-[var(--bg-modal)] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in flex flex-col border border-[var(--border-modal)]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-modal)]">
              <h2 className="text-2xl font-bold text-[var(--text-modal)]">Filtrar Recursos</h2>
              <div className="flex items-center gap-3">
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm font-bold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
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
              {/* Busca */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[var(--text-modal-muted)] uppercase tracking-wider">Buscar</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por nome, descrição ou tag..."
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

              {/* Categorias */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-[var(--text-modal-muted)] uppercase tracking-wider">Categorias</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center justify-center px-4 py-2.5 rounded-xl transition-all duration-200 border ${selectedCategory === cat.id
                        ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-md'
                        : 'bg-[var(--bg-modal-input)] border-transparent text-[var(--text-modal-muted)] hover:bg-[var(--bg-modal-hover)]'
                        }`}
                    >
                      <span className="font-medium text-sm">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
