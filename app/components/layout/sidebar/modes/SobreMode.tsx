/**
 * SobreMode Component
 * Menu de navegação para seções da página "Sobre"
 * 
 * @agi-domain: layout/sidebar
 * @mode: sobre
 * @follows: EducacaoMode pattern
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faHome,
    faProjectDiagram,
    faScroll,
    faGem,
    faEye,
    faUser
} from '@fortawesome/free-solid-svg-icons';
import { SidebarModeProps } from '../types';

export default function SobreMode({ onClose }: SidebarModeProps) {
    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: 'smooth'
            });
            onClose(); // Close sidebar on mobile after click
        }
    };

    const items = [
        { id: 'hero', label: 'Topo', icon: faHome },
        { id: 'conexoes', label: 'Conexões', icon: faProjectDiagram },
        { id: 'manifesto', label: 'Manifesto', icon: faScroll },
        { id: 'valores', label: 'Valores', icon: faGem },
        { id: 'transparencia', label: 'Transparência', icon: faEye },
        { id: 'criador', label: 'Criador', icon: faUser }
    ];

    return (
        <nav className="flex-1 p-4 overflow-y-auto flex flex-col no-scrollbar">
            {/* Voltar ao Início */}
            <Link
                href="/"
                onClick={onClose}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--brand-primary)] transition-all mb-4"
            >
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                />
                <span>Voltar ao Início</span>
            </Link>

            {/* Sections */}
            <div className="space-y-1">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollTo(item.id)}
                        className="group flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--brand-primary)] transition-all w-full text-left"
                    >
                        <FontAwesomeIcon
                            icon={item.icon}
                            className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                        />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
