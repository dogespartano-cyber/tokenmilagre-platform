'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faChartLine, faNewspaper, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/contexts/ThemeContext';

const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { href: '/dashboard/mercado', label: 'Mercado', icon: faChartLine },
    { href: '/dashboard/noticias', label: 'Notícias', icon: faNewspaper },
    { href: '/dashboard', label: 'Portfolio', icon: faBriefcase },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg border-b shadow-theme-sm" style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-medium)'
      }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-2xl focus:outline-none text-theme-primary"
              >
                {sidebarOpen ? '✕' : '☰'}
              </button>

              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition group">
                <div className="relative w-10 h-10 rounded-full shadow-lg overflow-hidden border-2 group-hover:scale-110 transition-all" style={{
                  borderColor: 'var(--brand-primary)'
                }}>
                  <div className="absolute inset-0 blur-sm" style={{
                    background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                    opacity: 0.2
                  }}></div>
                  <Image
                    src="/images/TOKEN-MILAGRE-Hero.webp"
                    alt="$MILAGRE"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover relative z-10"
                  />
                </div>
                <div className="text-xl sm:text-2xl font-bold drop-shadow-lg transition font-[family-name:var(--font-poppins)] text-theme-primary group-hover:text-brand-primary">
                  $MILAGRE
                </div>
              </Link>
            </div>

            {/* Menu Horizontal - Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-semibold transition ${
                    pathname === item.href
                      ? 'text-brand-primary'
                      : 'text-theme-tertiary hover:text-brand-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-lg border-2 transition-all shadow-theme-sm hover:shadow-theme-md"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-medium)',
                  color: 'var(--text-primary)'
                }}
                title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
              >
                <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-5 h-5" />
              </button>
              <Link
                href="/"
                className="font-semibold transition text-theme-tertiary hover:text-brand-primary"
              >
                ← Voltar
              </Link>
            </nav>

            {/* Theme Toggle + Voltar - Mobile */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="px-3 py-2 rounded-lg border-2 transition-all"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-medium)',
                  color: 'var(--text-primary)'
                }}
                title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
              >
                <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-4 h-4" />
              </button>
              <Link
                href="/"
                className="transition font-semibold text-theme-tertiary hover:text-brand-primary"
              >
                ← Voltar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 backdrop-blur-lg border-r sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto" style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-medium)'
        }}>
          <nav className="p-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === item.href
                    ? 'font-bold shadow-theme-md'
                    : 'border-2 hover:shadow-theme-sm'
                }`}
                style={pathname === item.href ? {
                  backgroundColor: 'var(--brand-bg)',
                  borderLeft: '4px solid var(--brand-primary)',
                  color: 'var(--brand-primary)'
                } : {
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-medium)',
                  color: 'var(--text-tertiary)'
                }}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </Link>
            ))}

            {/* Comprar $MILAGRE Button */}
            <div className="pt-4 mt-4 border-t-2" style={{ borderColor: 'var(--border-medium)' }}>
              <a
                href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all shadow-theme-md hover:shadow-theme-lg hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                  color: 'var(--text-inverse)',
                  fontWeight: 'bold'
                }}
              >
                <span className="text-2xl">🚀</span>
                <span className="font-semibold">Comprar $MILAGRE</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/70" onClick={() => setSidebarOpen(false)}>
            <aside
              className="absolute left-0 top-16 bottom-0 w-64 backdrop-blur-lg border-r"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="p-6 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      pathname === item.href
                        ? 'font-bold shadow-theme-md'
                        : 'border-2 hover:shadow-theme-sm'
                    }`}
                    style={pathname === item.href ? {
                      backgroundColor: 'var(--brand-bg)',
                      borderLeft: '4px solid var(--brand-primary)',
                      color: 'var(--brand-primary)'
                    } : {
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-medium)',
                      color: 'var(--text-tertiary)'
                    }}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                ))}

                {/* Comprar $MILAGRE Button */}
                <div className="pt-4 mt-4 border-t-2" style={{ borderColor: 'var(--border-medium)' }}>
                  <a
                    href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all shadow-theme-md"
                    style={{
                      background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                      color: 'var(--text-inverse)',
                      fontWeight: 'bold'
                    }}
                  >
                    <span className="text-2xl">🚀</span>
                    <span className="font-semibold">Comprar $MILAGRE</span>
                  </a>
                </div>
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
