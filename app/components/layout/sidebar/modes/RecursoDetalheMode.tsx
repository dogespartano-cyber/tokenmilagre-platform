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
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group mb-4"
            >
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] transition-colors"
                />
                <span className="font-semibold text-base">Voltar a Recursos</span>
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${currentResource?.slug === res.slug
                                ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)]'
                                : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:translate-x-1'
                            }`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${currentResource?.slug === res.slug
                                    ? 'bg-[var(--brand-primary)]'
                                    : 'bg-green-500'
                                }`}
                        />
                        <span className="font-medium text-sm truncate">{res.name}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
