'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminChatContextType {
  pageData: Record<string, any> | undefined;
  setPageData: (data: Record<string, any> | undefined) => void;
}

const AdminChatContext = createContext<AdminChatContextType | undefined>(undefined);

export function AdminChatProvider({ children }: { children: ReactNode }) {
  const [pageData, setPageData] = useState<Record<string, any> | undefined>(undefined);

  return (
    <AdminChatContext.Provider value={{ pageData, setPageData }}>
      {children}
    </AdminChatContext.Provider>
  );
}

export function useAdminChatContext() {
  const context = useContext(AdminChatContext);
  if (!context) {
    throw new Error('useAdminChatContext must be used within AdminChatProvider');
  }
  return context;
}
