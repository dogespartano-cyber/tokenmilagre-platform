'use client';

import { ReactNode } from 'react';

interface DashboardLayoutClientProps {
  children: ReactNode;
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  return <>{children}</>;
}
