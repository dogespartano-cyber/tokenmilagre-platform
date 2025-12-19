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
import { faArrowLeft, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useSidebar } from '@/contexts/SidebarContext';
import { useEducationFiltersOptional, categories } from '@/contexts/EducationFilterContext';
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
                className="group flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--brand-primary)] transition-all mb-4"
            >
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                />
                <span>Voltar às Seções</span>
            </Link>

            {/* Sections */}
            <div className="space-y-1">
                {sections?.map((section) => (
                    <div key={section.id}>
                        <a
                            href={`#${section.id}`}
                            onClick={onClose}
                            className="group flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--brand-primary)] transition-all"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 group-hover:bg-[var(--brand-primary)] transition-colors shrink-0" />
                            <span>{section.title}</span>
                        </a>
                    </div>
                ))}
            </div>
        </nav>
    );
}


