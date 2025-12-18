/**
 * @module home/LearnCryptoSection
 * @description Seção educacional com artigos em grid - Design padronizado com QuickStartGrid
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { EducationItem } from './types';

interface LearnCryptoSectionProps {
    education: EducationItem[];
}

export function LearnCryptoSection({ education }: LearnCryptoSectionProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href="/educacao"
                    className="group inline-flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
                    title="Explorar Conteúdo Educativo"
                >
                    <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)] group-hover:scale-110 transition-transform">
                        <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                    </div>
                    <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                        Entenda Criptomoedas
                    </h2>
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {education.slice(0, 6).map((item) => (
                    <Link
                        key={item.id}
                        href={`/educacao/${item.slug}`}
                        className={`
                            group relative overflow-hidden rounded-3xl
                            bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-gray-500/10 dark:to-slate-500/5 border border-gray-200 dark:border-gray-500/20 
                            hover:shadow-xl hover:shadow-gray-500/10
                            p-6 flex flex-col justify-center
                            h-full min-h-[180px]
                            transition-all duration-300
                        `}
                    >
                        {/* Content Layer */}
                        <div className="relative z-10">
                            <h3 className="font-[family-name:var(--font-poppins)] font-bold text-lg mb-3 text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)] font-medium line-clamp-3">
                                {item.summary}
                            </p>
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

