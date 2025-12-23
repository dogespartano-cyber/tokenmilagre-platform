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
import ZenithLogo from '@/components/ui/ZenithLogo';

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
                    title="$MILAGRE - Voltar para página inicial"
                >
                    <ZenithLogo size="md" showTagline={true} />
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
