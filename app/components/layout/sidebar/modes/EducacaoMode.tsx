/**
 * EducacaoMode Component
 * TOC de seções da página de educação + filtros
 * 
 * @agi-domain: layout/sidebar
 * @mode: educacao
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ChevronDown } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { useEducationFiltersOptional, categories, levels } from '@/contexts/EducationFilterContext';
import type { SidebarModeProps, EducacaoModeConfig } from '../types';

interface EducacaoModeProps extends SidebarModeProps {
    config: EducacaoModeConfig;
}

export default function EducacaoMode({ onClose, config }: EducacaoModeProps) {
    const { updateConfig } = useSidebar();
    const educationFilters = useEducationFiltersOptional();
    const { showFilters, sections } = config;

    const toggleFilters = () => {
        updateConfig({ showFilters: !showFilters });
    };

    return (
        <nav className="flex-1 p-4 overflow-y-auto flex flex-col no-scrollbar">
            {/* Back button - only visible when in filters mode */}
            {showFilters && (
                <button
                    onClick={toggleFilters}
                    className="flex items-center gap-2 px-4 py-2 mb-3 text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] transition-all"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                    <span className="text-sm font-medium">Voltar às Seções</span>
                </button>
            )}

            {showFilters ? (
                /* Filters View */
                <div className="space-y-5">
                    {/* Search */}
                    {educationFilters && (
                        <>
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

                            {/* Category Filter */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-3">Categoria</h3>
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

                            {/* Level Filter */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-3">Nível</h3>
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

                            {/* Clear Filters */}
                            {educationFilters.getActiveFiltersCount() > 0 && (
                                <button
                                    onClick={educationFilters.clearAllFilters}
                                    className="w-full py-2 text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] transition-colors"
                                >
                                    Limpar filtros ({educationFilters.getActiveFiltersCount()})
                                </button>
                            )}
                        </>
                    )}
                </div>
            ) : (
                /* Sections TOC View */
                <div className="space-y-1">
                    {/* Voltar ao Início */}
                    <Link
                        href="/"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group mb-2"
                    >
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] transition-colors"
                        />
                        <span className="font-semibold text-base">Voltar ao Início</span>
                    </Link>

                    {sections?.map((section) => (
                        <div key={section.id}>
                            {section.id === 'artigos' ? (
                                /* Artigos item with expandable submenu */
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            updateConfig({ artigosExpanded: !config.artigosExpanded });
                                            const artigosElement = document.getElementById('artigos');
                                            if (artigosElement) {
                                                artigosElement.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group"
                                    >
                                        <span className="font-semibold text-sm flex-1 text-left">{section.title}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform duration-300 ${config.artigosExpanded ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {/* Submenu with animation */}
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${config.artigosExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <button
                                            onClick={() => {
                                                const artigosElement = document.getElementById('artigos');
                                                if (artigosElement) {
                                                    artigosElement.scrollIntoView({ behavior: 'smooth' });
                                                }
                                                toggleFilters();
                                            }}
                                            className="w-full flex items-center gap-3 pl-12 pr-4 py-2.5 text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-all text-left"
                                        >
                                            <span className="text-sm font-medium">Filtrar Artigos</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                /* Regular section link */
                                <a
                                    href={`#${section.id}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group"
                                >
                                    <span className="font-semibold text-sm">{section.title}</span>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
}
