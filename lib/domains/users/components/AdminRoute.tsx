'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface AdminRouteProps {
    children: React.ReactNode;
    allowEditor?: boolean;
}

/**
 * @agi-domain users
 * @agi-purpose Client-side protection for admin routes
 * @agi-note Uses /api/auth/me to get the actual DB role, not Clerk publicMetadata
 */
export default function AdminRoute({ children, allowEditor = false }: AdminRouteProps) {
    const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();
    const [dbRole, setDbRole] = useState<string | null>(null);
    const [isCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn) {
            router.push('/auth/signin');
            return;
        }

        // Fetch the actual role from the database via API
        async function fetchUserRole() {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setDbRole(data.role || 'VIEWER');
                } else {
                    // API returned error - redirect to home
                    console.error('Failed to fetch user role');
                    router.push('/');
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
                router.push('/');
            } finally {
                setIsCheckingRole(false);
            }
        }

        fetchUserRole();
    }, [isLoaded, isSignedIn, router]);

    // Redirect logic based on DB role
    useEffect(() => {
        if (isCheckingRole || !dbRole) return;

        const isAllowed =
            dbRole === 'ADMIN' ||
            (allowEditor && dbRole === 'EDITOR');

        if (!isAllowed) {
            router.push('/');
        }
    }, [dbRole, isCheckingRole, router, allowEditor]);

    // Loading state
    if (!isLoaded || isCheckingRole) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-teal-500" />
            </div>
        );
    }

    // Permission check for render
    const isAllowed =
        dbRole === 'ADMIN' ||
        (allowEditor && dbRole === 'EDITOR');

    if (!isSignedIn || !isAllowed) {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
}
