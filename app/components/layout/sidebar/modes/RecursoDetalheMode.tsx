/**
 * RecursoDetalheMode Component
 * Lista de recursos relacionados da mesma categoria
 * 
 * @agi-domain: layout/sidebar
 * @mode: recurso-detalhe
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import type { SidebarModeProps, RecursoDetalheModeConfig } from '../types';

interface RecursoDetalheModeProps extends SidebarModeProps {
    config: RecursoDetalheModeConfig;
}

export default function RecursoDetalheMode({ onClose, config }: RecursoDetalheModeProps) {
    const { currentResource, relatedResources, categoryLabel } = config;

    return (
        <nav className="flex-1 p-4 overflow-y-auto flex flex-col no-scrollbar">
            {/* Voltar a Recursos */}
            <Link
                href="/recursos"
                onClick={onClose}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--brand-primary)] transition-all mb-2"
            >
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                />
                <span>Voltar a Recursos</span>
            </Link>

            {/* Category Title */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-3 px-2">
                Mais {categoryLabel || 'Recursos'}
            </h3>

            {/* Related Resources Links */}
            <div className="space-y-1">
                {relatedResources?.map((res) => (
                    <Link
                        key={res.slug}
                        href={`/recursos/${res.slug}`}
                        onClick={onClose}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${currentResource?.slug === res.slug
                            ? 'bg-[var(--bg-secondary)] text-[var(--brand-primary)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--brand-primary)]'
                            }`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors shrink-0 ${currentResource?.slug === res.slug
                            ? 'bg-[var(--brand-primary)]'
                            : 'bg-zinc-300 dark:bg-zinc-600 group-hover:bg-[var(--brand-primary)]'
                            }`} />
                        <span className="truncate">{res.name}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
