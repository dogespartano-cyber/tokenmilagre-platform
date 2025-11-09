'use client';

import { ReactNode } from 'react';
import BuildInfoBadge from '@/app/components/BuildInfoBadge';

interface DashboardLayoutClientProps {
  children: ReactNode;
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  return (
    <>
      {children}
      <BuildInfoBadge />
    </>
  );
}
