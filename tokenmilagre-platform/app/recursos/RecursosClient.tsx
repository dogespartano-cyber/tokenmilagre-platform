'use client';

import { useState, useEffect } from 'react';
import { Resource } from '@/lib/resources';
import { getAllCategories } from '@/lib/category-helpers';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';
import ResourceFilters from './components/ResourceFilters';
import ResourceGrid from './components/ResourceGrid';
import SecurityTips from './components/SecurityTips';
import ScrollToTop from './components/ScrollToTop';

interface RecursosClientProps {
  resources: Resource[];
}

export default function RecursosClient({ resources }: RecursosClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-16">
        {/* Hero */}
        <div className="space-y-6 max-w-3xl">


          <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
            Acesse com Segurança os{' '}
            <span className="text-brand-primary">Links Oficiais Verificados</span>
          </h1>

          <p className="text-xl leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            Wallets, exchanges e ferramentas essenciais com links oficiais verificados pela comunidade $MILAGRE.
            Proteja-se contra sites falsos e golpes.
          </p>

          {/* Alerta de Segurança */}
          <div className="p-4 rounded-xl border-2" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: '#f59e0b'
          }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Sempre Verifique a URL
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Golpistas criam sites falsos para roubar suas informações. Sempre confirme que você está no site oficial antes de conectar sua carteira ou inserir dados pessoais.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Busca e Filtros */}
        <ResourceFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          categories={categories}
          totalResults={filteredResources.length}
          activeFiltersCount={getActiveFiltersCount()}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onClearFilters={clearAllFilters}
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

        {/* Scroll to top button */}
        <ScrollToTop />
      </div>
    </div>
  );
}
