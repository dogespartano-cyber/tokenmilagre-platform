'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => { },
  mounted: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage and system preference
    // Check localStorage only, default to light to avoid system conflict
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    // Add smooth transition class
    document.documentElement.classList.add('theme-transition');

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);

    // Show toast notification
    setShowToast(true);

    // Remove transition class after animation
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);

    // Hide toast after 2 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}

      {/* Theme Change Toast */}
      {showToast && mounted && (
        <div
          className="fixed bottom-20 right-8 z-[9999] px-6 py-3 rounded-xl shadow-2xl border-2 flex items-center gap-3 animate-fade-in-up backdrop-blur-lg"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--brand-primary)',
            color: 'var(--text-primary)'
          }}
        >
          <span className="text-2xl">{theme === 'light' ? '☀️' : '🌙'}</span>
          <span className="font-semibold">
            Tema {theme === 'light' ? 'Claro' : 'Escuro'} ativado
          </span>
        </div>
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
