/**
 * Sidebar Component
 * Navegação lateral da aplicação
 * 
 * @agi-domain: layout
 * @refactored Extraído de layout-root.tsx
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faNewspaper,
    faHome,
    faInfoCircle,
    faCoins,
    faTimes,
    faGraduationCap,
    faStore,
    faBitcoinSign
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { href: '/', label: 'Início', icon: faHome },
    { href: '/noticias', label: 'Notícias', icon: faNewspaper },
    { href: '/graficos', label: 'Gráficos', icon: faChartLine },
    { href: '/criptomoedas', label: 'Criptomoedas', icon: faBitcoinSign },
    { href: '/educacao', label: 'Educação', icon: faGraduationCap },
    { href: '/recursos', label: 'Recursos', icon: faStore },
    { href: '/token', label: 'Token', icon: faCoins },
    { href: '/sobre', label: 'Sobre', icon: faInfoCircle },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { theme } = useTheme();

    return (
        <>
            {/* Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 bg-white dark:bg-[var(--bg-elevated)]/30 backdrop-blur-xl lg:bg-transparent lg:glass shadow-2xl lg:shadow-none`}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
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
                                        className="w-full h-full object-cover"
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

                    {/* Sidebar Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-2">
                            {menuItems.map((item) => {
                                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 relative overflow-hidden ${isActive
                                                ? 'sidebar-active'
                                                : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:translate-x-1'
                                            }`}
                                    >
                                        {/* Shine Effect */}
                                        {isActive && (
                                            <div
                                                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                                                style={{
                                                    background: `linear-gradient(90deg, transparent, ${theme === 'light' ? 'rgba(13, 148, 136, 0.2)' : 'rgba(255,255,255,0.1)'}, transparent)`
                                                }}
                                            />
                                        )}

                                        <FontAwesomeIcon
                                            icon={item.icon}
                                            className={`w-5 h-5 transition-transform duration-300 relative z-10 ${isActive ? 'scale-110' : 'group-hover:rotate-12'}`}
                                        />
                                        <span className="relative z-10">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
}
