/**
 * SidebarWrapper Component
 * Wrapper do aside com estilos comuns a todos os modos
 * 
 * @agi-domain: layout/sidebar
 */

'use client';

import { ReactNode } from 'react';

interface SidebarWrapperProps {
    isOpen: boolean;
    children: ReactNode;
}

export default function SidebarWrapper({ isOpen, children }: SidebarWrapperProps) {
    return (
        <aside
            className={`fixed top-0 left-0 h-full w-72 z-50 transition-[transform,background-color] duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 backdrop-blur-2xl shadow-2xl lg:shadow-none`}
            style={{
                backgroundColor: 'var(--sidebar-bg)',
                borderRight: '1px solid var(--sidebar-border)'
            }}
        >
            <div className="flex flex-col h-full">
                {children}
            </div>
        </aside>
    );
}
