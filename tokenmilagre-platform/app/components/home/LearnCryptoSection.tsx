/**
 * @module home/LearnCryptoSection
 * @description Seção educacional com artigos em grid
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { getLevelGradient, getLevelColor, getLevelIcon } from '@/lib/shared/utils/level-helpers';
import type { EducationItem } from './types';

interface LearnCryptoSectionProps {
    education: EducationItem[];
}

export function LearnCryptoSection({ education }: LearnCryptoSectionProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-primary)]">
                    Entenda Criptomoedas
                </h2>
                <Link href="/educacao" className="text-sm font-semibold hover:text-[var(--brand-primary)] text-[var(--text-tertiary)]">
                    Academia
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {education.slice(0, 6).map((item) => (
                    <Link
                        key={item.id}
                        href={`/educacao/${item.slug}`}
                        className="group relative overflow-hidden zenith-card bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-orange-500/10 dark:to-amber-500/5 backdrop-blur-md dark:border-orange-500/20 hover:border-orange-500/50 dark:hover:border-orange-500/20 hover:shadow-orange-500/10"
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-500 to-amber-500" style={{ boxShadow: '0 0 20px #f9731640' }} />
                        {/* Inner padding container */}
                        <div className="p-6 h-full flex flex-col gap-4 relative z-10">
                            <div className="flex flex-col gap-3">
                                <h3 className="text-xl font-bold leading-tight text-orange-600 dark:text-[var(--text-primary)] font-[family-name:var(--font-poppins)] group-hover:text-orange-700 dark:group-hover:text-orange-500 transition-colors line-clamp-2">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] line-clamp-3">
                                    {item.summary}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-[var(--border-light)] dark:border-orange-500/10 flex items-center gap-2 text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)] group-hover:text-orange-600 dark:group-hover:text-orange-500 text-xs font-bold uppercase tracking-wider transition-colors">
                                Ler Guia <FontAwesomeIcon icon={faArrowRight} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
