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
                    <div
                        className="relative w-10 h-10 rounded-full shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.3)] border-2 group-hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(var(--brand-primary-rgb),0.6)]"
                        style={{ borderColor: 'var(--brand-primary)' }}
                    >
                        <Image
                            src="/images/TOKEN-MILAGRE-Hero.webp"
                            alt="$MILAGRE"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <div className="text-xl font-bold drop-shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.5)] transition-all duration-300 font-[family-name:var(--font-poppins)] text-theme-primary group-hover:text-brand-primary group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.8)]">
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
