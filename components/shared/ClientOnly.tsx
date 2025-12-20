'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ClientOnlyProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * ClientOnly - Wrapper para componentes que só devem renderizar no cliente
 * Usado para evitar hydration mismatch em componentes que dependem de estado do cliente
 * 
 * @example
 * <ClientOnly fallback={<Skeleton />}>
 *   <SignedIn><UserButton /></SignedIn>
 * </ClientOnly>
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
