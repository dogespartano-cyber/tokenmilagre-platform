'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSignInAlt,
    faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { ZenithButton } from '@/components/ui/ZenithButton';

export default function UserDropdown() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [userRole, setUserRole] = useState<string | null>(null);

    // Buscar role do usuário
    useEffect(() => {
        async function fetchUserRole() {
            if (!isLoaded || !isSignedIn || !user) return;

            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const data = await response.json();
                    setUserRole(data.role || 'VIEWER');
                }
            } catch (error) {
                console.error('Erro ao buscar role:', error);
            }
        }

        fetchUserRole();
    }, [isLoaded, isSignedIn, user]);

    // Loading state
    if (!isLoaded) {
        return (
            <div
                className="px-4 py-2 rounded-lg animate-pulse"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
                <div className="w-20 h-5 rounded" style={{ backgroundColor: 'var(--border-medium)' }} />
            </div>
        );
    }

    // Not authenticated - Show Login button
    if (!isSignedIn) {
        return (
            <ZenithButton
                as={Link}
                href="/sign-in"
                variant="primary"
                size="md"
                glow
                className="group"
            >
                <FontAwesomeIcon icon={faSignInAlt} className="w-4 h-4 mr-2" />
                <span>Login</span>
            </ZenithButton>
        );
    }

    // Authenticated - Show Admin button (only for ADMIN)
    if (userRole === 'ADMIN') {
        return (
            <ZenithButton
                as={Link}
                href="/dashboard"
                variant="glass"
                size="md"
                className="group border-dashed border-2"
            >
                <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4 mr-2" />
                <span className="hidden sm:block">Admin</span>
            </ZenithButton>
        );
    }

    // Authenticated but not admin - Show nothing
    return null;
}
