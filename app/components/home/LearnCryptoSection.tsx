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
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {education.slice(0, 6).map((item) => (
                    <Link
                        key={item.id}
                        href={`/educacao/${item.slug}`}
                        className="group relative overflow-hidden rounded-3xl backdrop-blur-md bg-gradient-to-br from-gray-500/10 to-slate-500/5 border border-gray-500/20 hover:border-[var(--brand-primary)]/50 hover:shadow-xl hover:shadow-[var(--brand-primary)]/10 transition-all duration-300"
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-light)]" style={{ boxShadow: '0 0 20px var(--brand-primary)' }} />
                        {/* Inner padding container */}
                        <div className="p-6 h-full flex flex-col gap-4 relative z-10">
                            <div className="flex flex-col gap-3">
                                <h3 className="text-xl font-bold leading-tight text-[var(--text-primary)] font-[family-name:var(--font-poppins)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] line-clamp-3">
                                    {item.summary}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-500/20 flex items-center gap-2 text-[var(--text-tertiary)] group-hover:text-[var(--brand-primary)] text-xs font-bold uppercase tracking-wider transition-colors">
                                Ler Guia <FontAwesomeIcon icon={faArrowRight} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
