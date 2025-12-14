'use client';

import { useState, useEffect } from 'react';
import { Resource } from '@/lib/domains/resources/legacy-api';
import { getAllCategories } from '@/lib/shared/utils/categories';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { SEARCH_DEBOUNCE_MS } from '@/lib/core/constants/ui';
import ResourceGrid from './components/ResourceGrid';
import SecurityTips from './components/SecurityTips';
import { useSidebar } from '@/contexts/SidebarContext';


interface RecursosClientProps {
  resources: Resource[];
}

export default function RecursosClient({ resources }: RecursosClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = getAllCategories();
  const { setSidebarMode, resetSidebar, updateConfig } = useSidebar();

  // Configure sidebar for recursos mode
  useEffect(() => {
    setSidebarMode('recursos', {
      categories,
      selectedCategory,
      setSelectedCategory,
      searchTerm,
      setSearchTerm,
    });

    return () => resetSidebar();
  }, [setSidebarMode, resetSidebar]);

  // Update sidebar config when filters change
  useEffect(() => {
    updateConfig({
      selectedCategory,
      searchTerm,
    });
  }, [selectedCategory, searchTerm, updateConfig]);

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
