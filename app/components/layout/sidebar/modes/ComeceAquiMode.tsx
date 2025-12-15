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
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import type { SidebarModeProps, ComeceAquiModeConfig } from '../types';

interface ComeceAquiModeProps extends SidebarModeProps {
    config: ComeceAquiModeConfig;
}

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
                    className="sidebar-back-link"
                >
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="sidebar-icon"
                    />
                    <span className="sidebar-text-lg">Voltar ao Início</span>
                </Link>

                {sections?.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={onClose}
                        className="sidebar-item"
                    >
                        <span className="sidebar-text">{section.title}</span>
                    </a>
                ))}
            </div>
        </nav>
    );
}
