'use client';

import { ReactNode } from 'react';
import DebugPanel from '@/components/admin/DebugPanel';

interface DashboardLayoutClientProps {
  children: ReactNode;
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  return (
    <>
      {children}

      {/* Debug Panel - Disponível em todo o dashboard */}
      <DebugPanel />
    </>
  );
}
