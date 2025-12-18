/**
 * @module home/FeaturedResourcesSection
 * @description Seção de Recursos Recomendados - Design harmonioso
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faCheckCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { ResourceItem } from './types';

interface FeaturedResourcesSectionProps {
    resources: ResourceItem[];
}

export function FeaturedResourcesSection({ resources }: FeaturedResourcesSectionProps) {
    if (!resources || resources.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href="/recursos"
                    className="group inline-flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
                    title="Ver Todas as Ferramentas"
                >
                    <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)] group-hover:scale-110 transition-transform">
                        <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                    </div>
                    <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                        Ferramentas Essenciais
                    </h2>
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((resource, index) => (
                    <Link
                        key={index}
                        href={resource.url}
                        className={`
                            group relative overflow-hidden rounded-3xl
                            zenith-glass
                            p-6 flex flex-col justify-between
                            h-full min-h-[180px]
                            transition-all duration-300
                        `}
                    >
                        <div className="relative z-10">
                            {/* Header: Category */}
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                                    {resource.category}
                                </span>
                            </div>

                            {/* Title & Description */}
                            <div>
                                <h3 className="font-[family-name:var(--font-poppins)] font-bold text-lg mb-2 text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors flex items-center gap-2">
                                    {resource.name}
                                    <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-tertiary)]" />
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] font-medium line-clamp-2">
                                    {resource.description}
                                </p>
                            </div>
                        </div>

                        {/* Decorative Gradient */}
                        <div className={`
                            hidden dark:block
                            absolute -bottom-20 -right-20 w-40 h-40 blur-[60px] rounded-full
                            opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none
                            bg-gray-500/10
                        `} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
