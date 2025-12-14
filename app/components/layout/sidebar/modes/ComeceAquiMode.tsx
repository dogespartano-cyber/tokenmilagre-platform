/**
 * ComeceAquiMode Component
 * TOC de seções da página Comece Aqui
 * 
 * @agi-domain: layout/sidebar
 * @mode: comece-aqui
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faShield,
    faUsers,
    faGraduationCap,
    faCompass,
    faQuestion,
    faHeart,
} from '@fortawesome/free-solid-svg-icons';
import type { SidebarModeProps, ComeceAquiModeConfig } from '../types';

interface ComeceAquiModeProps extends SidebarModeProps {
    config: ComeceAquiModeConfig;
}

const sectionIcons: Record<string, any> = {
    shield: faShield,
    users: faUsers,
    graduation: faGraduationCap,
    compass: faCompass,
    question: faQuestion,
    heart: faHeart,
};

export default function ComeceAquiMode({ onClose, config }: ComeceAquiModeProps) {
    const { sections } = config;

    return (
        <nav className="flex-1 p-4 overflow-y-auto flex flex-col no-scrollbar">
            {/* Sections TOC View */}
            <div className="space-y-1">
                {/* Voltar ao Início */}
                <Link
                    href="/"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group mb-2"
                >
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] transition-colors"
                    />
                    <span className="font-semibold text-base">Voltar ao Início</span>
                </Link>

                {sections?.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group"
                    >
                        <FontAwesomeIcon
                            icon={sectionIcons[section.icon || ''] || faShield}
                            className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] transition-colors"
                        />
                        <span className="font-semibold text-base">{section.title}</span>
                    </a>
                ))}
            </div>
        </nav>
    );
}
