/**
 * SidebarHeader Component
 * Header reutilizável com logo e botão fechar
 * 
 * @agi-domain: layout/sidebar
 * @eliminates: 450 linhas duplicadas do original
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface SidebarHeaderProps {
    onClose: () => void;
}

export default function SidebarHeader({ onClose }: SidebarHeaderProps) {
    return (
        <div className="h-[88px] flex items-center px-6">
            <div className="flex items-center justify-between w-full">
                <Link
                    href="/"
                    className="flex items-center gap-3 hover:opacity-100 transition-all duration-300 group px-2 py-1 rounded-xl"
                    onClick={onClose}
                >
                    <div className="relative w-10 h-10 rounded-full shadow-lg overflow-hidden border-2 group-hover:scale-110 transition-all duration-300 group-hover:rotate-12" style={{
                        borderColor: 'var(--brand-primary)'
                    }}>
                        <div className="absolute inset-0 blur-sm" style={{
                            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                            opacity: 0.2
                        }}></div>
                        <Image
                            src="/images/TOKEN-MILAGRE-Hero.webp"
                            alt="$MILAGRE"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover relative z-10"
                        />
                    </div>
                    <div className="text-xl sm:text-lg font-bold drop-shadow-lg transition-all duration-300 font-[family-name:var(--font-poppins)] text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] group-hover:scale-105">
                        $MILAGRE
                    </div>
                </Link>
                <button
                    onClick={onClose}
                    className="group lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-opacity-50 text-[var(--text-primary)]"
                >
                    <FontAwesomeIcon icon={faTimes} className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                </button>
            </div>
        </div>
    );
}
