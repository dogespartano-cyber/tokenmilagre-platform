/**
 * @module home/LearnCryptoSection
 * @description Seção educacional com artigos + TruthDetector
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getLevelGradient, getLevelColor, getLevelIcon } from '@/lib/shared/utils/level-helpers';
import TruthDetector from '@/components/education/TruthDetector';
import type { EducationItem } from './types';

interface LearnCryptoSectionProps {
    education: EducationItem[];
}

export function LearnCryptoSection({ education }: LearnCryptoSectionProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-primary)] pl-1 border-l-4 border-purple-500">
                    Base de Conhecimento
                </h2>
                <Link href="/educacao" className="text-sm font-semibold hover:text-[var(--brand-primary)] text-[var(--text-tertiary)]">
                    Academia
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {education.map((item) => (
                    <Link
                        key={item.id}
                        href={`/educacao/${item.slug}`}
                        className="group relative p-6 rounded-3xl zenith-card overflow-hidden flex flex-col justify-between"
                    >
                        <div className="mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`} style={{ background: getLevelGradient(item.level) }}>
                                <FontAwesomeIcon icon={getLevelIcon(item.level)} style={{ color: getLevelColor(item.level) }} className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 line-clamp-2 text-[var(--text-primary)] font-[family-name:var(--font-poppins)] group-hover:text-[var(--brand-primary)] transition-colors">
                                {item.title}
                            </h3>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-tertiary)] border-t border-[var(--border-light)] pt-4">
                            <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faClock} />
                                {item.readTime}
                            </span>
                            <span style={{ color: getLevelColor(item.level) }} className="font-bold uppercase">
                                {item.level}
                            </span>
                        </div>
                    </Link>
                ))}

                {/* Detector de Mentiras - integrado como card */}
                <div className="md:col-span-2 lg:col-span-4 mt-8 zenith-card p-2 bg-[var(--bg-tertiary)]/30 rounded-3xl">
                    <TruthDetector frameless />
                </div>
            </div>
        </div>
    );
}
