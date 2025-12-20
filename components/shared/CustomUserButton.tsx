'use client';

import { useUser, useClerk } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUser, faCog, faQuestionCircle, faSignOutAlt, faChevronRight, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from '@/lib/core/theme';


export default function CustomUserButton() {
    const { user, isLoaded } = useUser();
    const { signOut, openUserProfile } = useClerk();
    const { theme, mounted, setTheme, accent, setAccent, depth, setDepth } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Marcar como montado após hidratação
    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Skeleton placeholder - sempre renderizado no servidor e até montar no cliente
    // Isso garante consistência entre SSR e cliente, evitando hydration mismatch
    if (!hasMounted || !isLoaded || !user) {
        return (
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-glass)] animate-pulse border-2 border-[var(--border-glass)]" />
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-full border-2 border-[var(--brand-primary)] overflow-hidden hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2"
            >
                <Image
                    src={user.imageUrl}
                    alt={user.fullName || "User"}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                />
            </button>

            {/* Dropdown Menu (The User's Custom Design) */}
            {isOpen && (
                <div className="absolute right-0 top-14 w-80 z-50 origin-top-right">
                    <div className="flex flex-col rounded-xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ backgroundColor: 'var(--bg-modal)', borderColor: 'var(--border-modal)' }}>

                        {/* TopAppBar / Dismiss Control */}
                        <div className="flex items-center justify-end p-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors" style={{ color: 'var(--text-modal-muted)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-modal-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-lg" />
                            </button>
                        </div>

                        {/* ProfileHeader */}
                        <div className="flex flex-col gap-4 px-6 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 shrink-0 rounded-full border-2 border-[var(--brand-primary)] overflow-hidden">
                                    <Image
                                        src={user.imageUrl}
                                        alt="Profile"
                                        width={64}
                                        height={64}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex flex-col justify-center overflow-hidden">
                                    <p className="text-lg font-bold leading-tight truncate" style={{ color: 'var(--text-modal)' }}>
                                        {user.fullName}
                                    </p>
                                    <p className="text-sm font-normal leading-normal truncate" style={{ color: 'var(--text-modal-muted)' }}>
                                        {user.primaryEmailAddress?.emailAddress}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px mx-6" style={{ backgroundColor: 'var(--border-modal)' }}></div>

                        {/* Action List */}
                        <div className="flex flex-col py-4">

                            {/* Account Settings */}
                            <button
                                onClick={() => { setIsOpen(false); openUserProfile(); }}
                                className="flex cursor-pointer items-center gap-4 px-6 min-h-[56px] justify-between transition-colors text-left"
                                style={{ color: 'var(--text-modal)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-modal-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-[var(--brand-primary)] flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10">
                                        <FontAwesomeIcon icon={faUser} className="text-xl" />
                                    </div>
                                    <p className="text-base font-medium leading-normal" style={{ color: 'var(--text-modal)' }}>
                                        Gerenciar Conta
                                    </p>
                                </div>
                                <div className="shrink-0" style={{ color: 'var(--text-modal-muted)' }}>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </button>

                            {/* Admin Dashboard */}
                            <Link
                                href="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="flex cursor-pointer items-center gap-4 px-6 min-h-[56px] justify-between transition-colors"
                                style={{ color: 'var(--text-modal)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-modal-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-[var(--brand-primary)] flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10">
                                        <FontAwesomeIcon icon={faCog} className="text-xl" />
                                    </div>
                                    <p className="text-base font-medium leading-normal" style={{ color: 'var(--text-modal)' }}>
                                        Dashboard
                                    </p>
                                </div>
                                <div className="shrink-0" style={{ color: 'var(--text-modal-muted)' }}>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </Link>

                            {/* App Settings */}
                            <Link
                                href="/membro"
                                onClick={() => setIsOpen(false)}
                                className="flex cursor-pointer items-center gap-4 px-6 min-h-[56px] justify-between transition-colors"
                                style={{ color: 'var(--text-modal)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-modal-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-[var(--brand-primary)] flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10">
                                        <FontAwesomeIcon icon={faUser} className="text-xl" />
                                    </div>
                                    <p className="text-base font-medium leading-normal" style={{ color: 'var(--text-modal)' }}>
                                        Minha Conta
                                    </p>
                                </div>
                                <div className="shrink-0" style={{ color: 'var(--text-modal-muted)' }}>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </Link>

                            {/* Help & Support */}
                            <div
                                className="flex cursor-pointer items-center gap-4 px-6 min-h-[56px] justify-between transition-colors"
                                style={{ color: 'var(--text-modal)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-modal-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-[var(--brand-primary)] flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10">
                                        <FontAwesomeIcon icon={faQuestionCircle} className="text-xl" />
                                    </div>
                                    <p className="text-base font-medium leading-normal" style={{ color: 'var(--text-modal)' }}>
                                        Ajuda & Suporte
                                    </p>
                                </div>
                                <div className="shrink-0" style={{ color: 'var(--text-modal-muted)' }}>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </div>

                        </div>

                        {/* Theme & Accent Selection */}
                        {mounted && (
                            <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border-modal)' }}>
                                {/* Light/Dark Toggle */}
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-modal-muted)' }}>
                                        Aparência
                                    </p>
                                    <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--bg-modal-input)' }}>
                                        <button
                                            onClick={() => setTheme('light')}
                                            className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${theme === 'light'
                                                ? 'bg-[var(--brand-primary)] text-white shadow-sm'
                                                : 'hover:bg-[var(--bg-modal-hover)]'
                                                }`}
                                            style={{ color: theme === 'light' ? 'white' : 'var(--text-modal-muted)' }}
                                            title="Modo Claro"
                                        >
                                            <FontAwesomeIcon icon={faSun} className="text-sm" />
                                        </button>
                                        <button
                                            onClick={() => setTheme('dark')}
                                            className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${theme === 'dark'
                                                ? 'bg-[var(--brand-primary)] text-white shadow-sm'
                                                : 'hover:bg-[var(--bg-modal-hover)]'
                                                }`}
                                            style={{ color: theme === 'dark' ? 'white' : 'var(--text-modal-muted)' }}
                                            title="Modo Escuro"
                                        >
                                            <FontAwesomeIcon icon={faMoon} className="text-sm" />
                                        </button>
                                    </div>
                                </div>

                                {/* Accent Colors */}
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-modal-muted)' }}>
                                        Cor de Destaque
                                    </p>
                                    {/* Milagre (Original) - Default/First */}
                                    <button
                                        onClick={() => setAccent('milagre')}
                                        className={`w-7 h-7 rounded-full transition-all hover:scale-110 ring-offset-[var(--bg-modal)] ${accent === 'milagre' ? 'ring-2 ring-offset-2 ring-[#0D9488]' : ''}`}
                                        style={{ background: 'linear-gradient(135deg, #14B8A6, #0D9488)' }}
                                        title="Milagre (Teal)"
                                    />
                                    {/* Titanium (Blue/Silver) */}
                                    <button
                                        onClick={() => setAccent('ocean')}
                                        className={`w-7 h-7 rounded-full transition-all hover:scale-110 ring-offset-[var(--bg-modal)] ${accent === 'ocean' ? 'ring-2 ring-offset-2 ring-[#38BDF8]' : ''}`}
                                        style={{ background: 'linear-gradient(135deg, #94A3B8, #0EA5E9)' }}
                                        title="Titanium (Blue)"
                                    />
                                    {/* Amethyst (Purple/Violet) */}
                                    <button
                                        onClick={() => setAccent('forest')}
                                        className={`w-7 h-7 rounded-full transition-all hover:scale-110 ring-offset-[var(--bg-modal)] ${accent === 'forest' ? 'ring-2 ring-offset-2 ring-[#8B5CF6]' : ''}`}
                                        style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED)' }}
                                        title="Amethyst (Purple)"
                                    />
                                    {/* Copper (Orange/Bronze) */}
                                    <button
                                        onClick={() => setAccent('sunset')}
                                        className={`w-7 h-7 rounded-full transition-all hover:scale-110 ring-offset-[var(--bg-modal)] ${accent === 'sunset' ? 'ring-2 ring-offset-2 ring-[#F97316]' : ''}`}
                                        style={{ background: 'linear-gradient(135deg, #FDBA74, #EA580C)' }}
                                        title="Copper (Orange)"
                                    />
                                </div>

                                {/* Depth Slider */}
                                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-modal)' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-modal-muted)' }}>
                                            Profundidade
                                        </p>
                                        <span className="text-xs font-mono" style={{ color: 'var(--text-modal-muted)' }}>
                                            {depth}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={depth}
                                        onChange={(e) => setDepth(parseInt(e.target.value))}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, var(--brand-primary) ${depth}%, var(--bg-modal-input) ${depth}%)`
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="h-px mx-6" style={{ backgroundColor: 'var(--border-modal)' }}></div>

                        {/* Logout Button */}
                        <div className="p-6">
                            <button
                                onClick={() => signOut({ redirectUrl: '/' })}
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
                                <span className="text-base font-semibold">Sair</span>
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
