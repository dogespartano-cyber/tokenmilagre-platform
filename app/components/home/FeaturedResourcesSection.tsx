/**
 * @module home/FeaturedResourcesSection
 * @description Seção de Recursos Recomendados - Design limpo sem cards
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
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
          <h2 className="text-2xl title-newtab group-hover:text-[var(--brand-primary)] transition-colors">
            Ferramentas Essenciais
          </h2>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {resources.map((resource, index) => (
          <Link
            key={index}
            href={resource.url}
            className="group flex flex-col justify-start h-full p-2 transition-all duration-300 hover:opacity-80"
          >
            <div className="relative">
              {/* Header: Category */}
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest opacity-60">
                  {resource.category}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="title-newtab text-lg mb-2 group-hover:text-[var(--brand-primary)] transition-colors flex items-center gap-2 underline underline-offset-4 decoration-4 decoration-[var(--brand-primary)]/30 dark:decoration-[var(--success)]/50">
                  {resource.name}
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-tertiary)]" />
                </h3>
                <p className="text-sm text-[var(--text-secondary)] font-medium line-clamp-3 leading-relaxed">
                  {resource.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
