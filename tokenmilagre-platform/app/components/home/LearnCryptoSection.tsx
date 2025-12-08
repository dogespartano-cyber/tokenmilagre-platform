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
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    Aprenda sobre Cripto
                </h2>
                <Link href="/educacao" className="text-sm font-semibold hover:underline" style={{ color: 'var(--brand-primary)' }}>
                    Ver todos
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {education.map((item) => (
                    <Link key={item.id} href={`/educacao/${item.slug}`} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform">
                        <div className="mb-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3`} style={{ background: getLevelGradient(item.level) }}>
                                <FontAwesomeIcon icon={getLevelIcon(item.level)} style={{ color: getLevelColor(item.level) }} />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2 line-clamp-2 text-[var(--text-primary)]">
                            {item.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                            <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faClock} />
                                {item.readTime}
                            </span>
                            <span style={{ color: getLevelColor(item.level) }}>
                                {item.level}
                            </span>
                        </div>
                    </Link>
                ))}

                {/* Detector de Mentiras - integrado como card */}
                <TruthDetector frameless />
            </div>
        </div>
    );
}
