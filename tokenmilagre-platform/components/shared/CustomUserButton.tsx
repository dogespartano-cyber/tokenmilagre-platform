
'use client';

import { useUser, useClerk } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUser, faCog, faQuestionCircle, faSignOutAlt, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function CustomUserButton() {
    const { user, isLoaded } = useUser();
    const { signOut, openUserProfile } = useClerk();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    if (!isLoaded || !user) return null;

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
                    <div className="flex flex-col rounded-xl bg-white dark:bg-[#101922] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* TopAppBar / Dismiss Control */}
                        <div className="flex items-center justify-end p-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
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
                                    <p className="text-[#111418] dark:text-white text-lg font-bold leading-tight truncate">
                                        {user.fullName}
                                    </p>
                                    <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal truncate">
                                        {user.primaryEmailAddress?.emailAddress}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200 dark:bg-gray-700 mx-6"></div>

                        {/* Action List */}
                        <div className="flex flex-col py-4">

                            {/* Account Settings */}
                            <button
                                onClick={() => { setIsOpen(false); openUserProfile(); }}
                                className="flex cursor-pointer items-center gap-4 px-6 min-h-[56px] justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-[var(--brand-primary)] flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10">
                                        <FontAwesomeIcon icon={faUser} className="text-xl" />
                                    </div>
                                    <p className="text-[#111418] dark:text-gray-100 text-base font-medium leading-normal">
                                        Gerenciar Conta
                                    </p>
                                </div>
                                <div className="shrink-0 text-[#617589] dark:text-gray-400">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </button>

                            {/* App Settings */}
                            <Link
                                href="/membro"
                                onClick={() => setIsOpen(false)}
                                className="flex cursor-pointer items-center gap-4 px-6 min-h-[56px] justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-[var(--brand-primary)] flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10">
                                        <FontAwesomeIcon icon={faCog} className="text-xl" />
                                    </div>
                                    <p className="text-[#111418] dark:text-gray-100 text-base font-medium leading-normal">
                                        Dashboard Membro
                                    </p>
                                </div>
                                <div className="shrink-0 text-[#617589] dark:text-gray-400">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </Link>

                            {/* Help & Support */}
                            <div className="flex cursor-pointer items-center gap-4 px-6 min-h-[56px] justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="text-[var(--brand-primary)] flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10">
                                        <FontAwesomeIcon icon={faQuestionCircle} className="text-xl" />
                                    </div>
                                    <p className="text-[#111418] dark:text-gray-100 text-base font-medium leading-normal">
                                        Ajuda & Suporte
                                    </p>
                                </div>
                                <div className="shrink-0 text-[#617589] dark:text-gray-400">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </div>

                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200 dark:bg-gray-700 mx-6"></div>

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
