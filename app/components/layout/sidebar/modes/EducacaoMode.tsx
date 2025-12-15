/**
 * EducacaoMode Component
 * TOC de seções da página de educação + filtros em submenu
 * 
 * @agi-domain: layout/sidebar
 * @mode: educacao
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useSidebar } from '@/contexts/SidebarContext';
import { useEducationFiltersOptional, categories, levels } from '@/contexts/EducationFilterContext';
import type { SidebarModeProps, EducacaoModeConfig } from '../types';

interface EducacaoModeProps extends SidebarModeProps {
    config: EducacaoModeConfig;
}

export default function EducacaoMode({ onClose, config }: EducacaoModeProps) {
    const { updateConfig } = useSidebar();
    const educationFilters = useEducationFiltersOptional();
    const { sections, artigosExpanded } = config;

    const toggleArtigos = () => {
        updateConfig({ artigosExpanded: !artigosExpanded });
    };

    return (
        <nav className="flex-1 p-4 overflow-y-auto flex flex-col no-scrollbar">
            {/* Voltar ao Início */}
            <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group mb-4"
            >
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] transition-colors"
                />
                <span className="font-semibold text-base">Voltar às Seções</span>
            </Link>

            {/* Sections */}
            <div className="space-y-1">
                {sections?.map((section) => (
                    <div key={section.id}>
                        {section.id === 'artigos' ? (
                            /* Todos os Artigos - Expandable with filters */
                            <>
                                <button
                                    onClick={toggleArtigos}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
                                >
                                    <span className="font-semibold text-sm flex-1 text-left">{section.title}</span>
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`w-3 h-3 text-[var(--text-tertiary)] transition-transform duration-300 ${artigosExpanded ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Expandable content with filters */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${artigosExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="pl-4 pr-2 py-3 space-y-4">
                                        {/* Search */}
                                        {educationFilters && (
                                            <div className="relative">
                                                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                                                <input
                                                    type="text"
                                                    placeholder="Buscar artigos..."
                                                    value={educationFilters.searchTerm}
                                                    onChange={(e) => educationFilters.setSearchTerm(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50"
                                                />
                                            </div>
                                        )}

                                        {/* Category Filter */}
                                        {educationFilters && (
                                            <div>
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">Categoria</h3>
                                                <div className="space-y-1">
                                                    {categories.map((cat) => (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => educationFilters.setSelectedCategory(educationFilters.selectedCategory === cat.id ? '' : cat.id)}
                                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${educationFilters.selectedCategory === cat.id
                                                                ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                                                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                                                }`}
                                                        >
                                                            {cat.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Level Filter */}
                                        {educationFilters && (
                                            <div>
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">Nível</h3>
                                                <div className="space-y-1">
                                                    {levels.map((level) => (
                                                        <button
                                                            key={level.id}
                                                            onClick={() => educationFilters.setSelectedLevel(educationFilters.selectedLevel === level.id ? '' : level.id)}
                                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${educationFilters.selectedLevel === level.id
                                                                ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                                                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                                                }`}
                                                        >
                                                            {level.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Clear Filters */}
                                        {educationFilters && educationFilters.getActiveFiltersCount() > 0 && (
                                            <button
                                                onClick={educationFilters.clearAllFilters}
                                                className="w-full py-2 text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] transition-colors"
                                            >
                                                Limpar filtros ({educationFilters.getActiveFiltersCount()})
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Regular section link */
                            <a
                                href={`#${section.id}`}
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all"
                            >
                                <span className="font-semibold text-sm">{section.title}</span>
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    );
}


