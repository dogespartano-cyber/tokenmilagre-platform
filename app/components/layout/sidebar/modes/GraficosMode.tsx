/**
 * GraficosMode Component
 * TOC de seções da página de gráficos
 * 
 * @agi-domain: layout/sidebar
 * @mode: graficos
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import type { SidebarModeProps, GraficosModeConfig } from '../types';

interface GraficosModeProps extends SidebarModeProps {
    config: GraficosModeConfig;
}

export default function GraficosMode({ onClose, config }: GraficosModeProps) {
    const { sections } = config;

    return (
        <nav className="flex-1 p-4 overflow-y-auto flex flex-col no-scrollbar">
            {/* Voltar ao Início */}
            <Link
                href="/"
                onClick={onClose}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--brand-primary)] transition-all mb-2"
            >
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                />
                <span>Voltar ao Início</span>
            </Link>

            {/* Sections TOC */}
            <div className="space-y-1">
                {sections?.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={onClose}
                        className="group flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--brand-primary)] transition-all"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 group-hover:bg-[var(--brand-primary)] transition-colors shrink-0" />
                        <span>{section.title}</span>
                    </a>
                ))}
            </div>
        </nav>
    );
}
