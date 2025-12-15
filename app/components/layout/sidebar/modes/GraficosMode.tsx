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
                className="sidebar-back-link"
            >
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="sidebar-icon"
                />
                <span className="sidebar-text-lg">Voltar ao Início</span>
            </Link>

            {/* Sections TOC */}
            <div className="space-y-1">
                {sections?.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={onClose}
                        className="sidebar-item"
                    >
                        <span className="sidebar-text">{section.title}</span>
                    </a>
                ))}
            </div>
        </nav>
    );
}
