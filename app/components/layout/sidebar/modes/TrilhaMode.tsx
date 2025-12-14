/**
 * TrilhaMode Component
 * Navegação de trilha/curso de aprendizado com progress bar
 * 
 * @agi-domain: layout/sidebar
 * @mode: trilha
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { CheckCircle2, PlayCircle, Clock } from 'lucide-react';
import type { SidebarModeProps, TrilhaModeConfig } from '../types';

interface TrilhaModeProps extends SidebarModeProps {
    config: TrilhaModeConfig;
}

export default function TrilhaMode({ onClose, config }: TrilhaModeProps) {
    return (
        <>
            {/* Trilha Info Section */}
            <div className="px-6 py-4 border-b border-[var(--border-light)]/50">
                <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)] block mb-1">
                        {config.title || 'Trilha de Aprendizado'}
                    </span>
                    <h2 className="text-xl font-bold leading-tight text-[var(--text-primary)]">
                        {config.subtitle || 'Fundamentos'}
                    </h2>
                </div>

                {/* Progress Bar */}
                {config.progress !== undefined && (
                    <div className="w-full bg-[var(--bg-tertiary)] h-2 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--brand-primary)] transition-all duration-500 ease-out"
                            style={{ width: `${config.progress}%` }}
                        />
                    </div>
                )}
                <div className="flex justify-between mt-2 text-xs text-[var(--text-tertiary)]">
                    <span>{config.progress}% Concluído</span>
                    <span>{Math.round((config.progress || 0) / 100 * (config.steps?.length || 0))}/{config.steps?.length || 0} Aulas</span>
                </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                <Link
                    href="/educacao"
                    className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] mb-6 px-2 transition-colors"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
                    Voltar para Educação
                </Link>

                {config.steps?.map((step, index) => {
                    const isCompleted = config.currentSlug !== step.slug && index < config.steps.findIndex((s) => s.slug === config.currentSlug);
                    const isCurrent = config.currentSlug === step.slug;

                    return (
                        <Link
                            key={step.slug}
                            href={`/educacao/${step.slug}`}
                            onClick={() => onClose()}
                            className={`
                                group flex items-start gap-3 p-3 rounded-xl transition-all border
                                ${isCurrent
                                    ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]/30'
                                    : 'bg-transparent border-transparent hover:bg-[var(--bg-secondary)]'
                                }
                            `}
                        >
                            <div className="mt-0.5 min-w-[20px]">
                                {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : isCurrent ? (
                                    <PlayCircle className="w-5 h-5 text-[var(--brand-primary)] animate-pulse" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-[var(--text-tertiary)] text-[var(--text-tertiary)] flex items-center justify-center text-[10px] font-bold">
                                        {index + 1}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-medium leading-snug mb-1 ${isCurrent ? 'text-[var(--brand-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                                    {step.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-[var(--text-tertiary)]">
                                    <Clock className="w-3 h-3" />
                                    {step.duration || '5 min'}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
