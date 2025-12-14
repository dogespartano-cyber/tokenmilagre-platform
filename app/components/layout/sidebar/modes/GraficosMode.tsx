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
import {
    faArrowLeft,
    faChartLine,
    faGlobe,
    faFire,
    faHeart,
} from '@fortawesome/free-solid-svg-icons';
import type { SidebarModeProps, GraficosModeConfig } from '../types';

interface GraficosModeProps extends SidebarModeProps {
    config: GraficosModeConfig;
}

const sectionIcons: Record<string, any> = {
    chart: faChartLine,
    globe: faGlobe,
    fire: faFire,
    bubble: faChartLine,
    heart: faHeart,
};

export default function GraficosMode({ onClose, config }: GraficosModeProps) {
    const { sections } = config;

    return (
        <nav className="flex-1 p-4 overflow-y-auto flex flex-col no-scrollbar">
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

            {/* Sections TOC */}
            <div className="space-y-1">
                {sections?.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group"
                    >
                        <FontAwesomeIcon
                            icon={sectionIcons[section.icon || ''] || faChartLine}
                            className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] transition-colors"
                        />
                        <span className="font-semibold text-base">{section.title}</span>
                    </a>
                ))}
            </div>
        </nav>
    );
}
