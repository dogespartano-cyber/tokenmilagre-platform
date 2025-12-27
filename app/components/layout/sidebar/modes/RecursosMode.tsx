/**
 * RecursosMode Component
 * Filtros por categoria para listagem de recursos
 * 
 * @agi-domain: layout/sidebar
 * @mode: recursos
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { SidebarModeProps, RecursosModeConfig } from '../types';

interface RecursosModeProps extends SidebarModeProps {
  config: RecursosModeConfig;
}

export default function RecursosMode({ onClose, config }: RecursosModeProps) {
  const { categories, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm } = config;

  return (
    <nav className="flex-1 p-4 overflow-y-auto flex flex-col no-scrollbar">
      {/* Voltar ao Início */}
      <Link
        href="/"
        onClick={onClose}
        className="group flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--brand-primary)] transition-all mb-4"
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
        />
        <span>Voltar ao Início</span>
      </Link>

      {/* Search */}
      <div className="relative mb-4">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
        <input
          type="text"
          placeholder="Buscar recursos..."
          value={searchTerm || ''}
          onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50"
        />
      </div>

      {/* Categories Title */}
<h3 className="title-newtab text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3 px-2">
        Categorias
      </h3>

      {/* Category Filters */}
      <div className="space-y-1">
        {categories?.filter((cat) => !['news', 'education'].includes(cat.id)).map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              if (setSelectedCategory) {
                setSelectedCategory(cat.id);
                onClose();
              }
            }}
            className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${selectedCategory === cat.id
              ? 'bg-[var(--bg-secondary)] text-[var(--brand-primary)]'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--brand-primary)]'
              }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full transition-colors shrink-0 ${selectedCategory === cat.id
              ? 'bg-[var(--brand-primary)]'
              : 'bg-zinc-300 dark:bg-zinc-600 group-hover:bg-[var(--brand-primary)]'
              }`} />
            <span>{cat.label}</span>
          </button>
        ))}

        {/* Limpar Filtros */}
        {(selectedCategory !== 'all' || searchTerm) && (
          <button
            onClick={() => {
              if (setSelectedCategory) setSelectedCategory('all');
              if (setSearchTerm) setSearchTerm('');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 mt-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-all group border-t border-[var(--border-light)] pt-4"
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="w-5 h-5"
            />
            <span className="sidebar-text">Limpar Filtros</span>
          </button>
        )}
      </div>
    </nav>
  );
}
