/**
 * SidebarOverlay Component
 * Overlay escuro para mobile quando sidebar está aberta
 * 
 * @agi-domain: layout/sidebar
 */

'use client';

interface SidebarOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SidebarOverlay({ isOpen, onClose }: SidebarOverlayProps) {
    return (
        <div
            className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            onClick={onClose}
        />
    );
}
