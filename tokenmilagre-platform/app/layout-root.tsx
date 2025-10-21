'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faNewspaper, faSun, faMoon, faHome, faInfoCircle, faCoins, faBars, faTimes, faBook, faGraduationCap, faStore, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/contexts/ThemeContext';

const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';

export default function RootLayoutNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { href: '/', label: 'Início', icon: faHome },
    { href: '/dashboard/noticias', label: 'Notícias', icon: faNewspaper },
    { href: '/educacao', label: 'Educação', icon: faGraduationCap },
    { href: '/recursos', label: 'Recursos', icon: faStore },
    { href: '/sobre', label: 'Sobre', icon: faInfoCircle },
    { href: '/token', label: 'Token', icon: faCoins },
    { href: '/manifesto', label: 'Manifesto', icon: faBook },
    { href: '/doacoes', label: 'Doações', icon: faHeart },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 shadow-2xl`} style={{
        backgroundColor: 'var(--bg-elevated)',
        borderRight: '1px solid var(--border-medium)'
      }}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b" style={{ borderColor: 'var(--border-medium)' }}>
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition group" onClick={() => setSidebarOpen(false)}>
                <div className="relative w-10 h-10 rounded-full shadow-lg overflow-hidden border-2 group-hover:scale-110 transition-all" style={{
                  borderColor: 'var(--brand-primary)'
                }}>
                  <Image
                    src="/images/TOKEN-MILAGRE-Hero.webp"
                    alt="$MILAGRE"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xl font-bold drop-shadow-lg transition font-[family-name:var(--font-poppins)] text-theme-primary group-hover:text-brand-primary">
                  $MILAGRE
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))
                      ? 'shadow-theme-md'
                      : 'hover:bg-opacity-50'
                  }`}
                  style={{
                    backgroundColor: (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))
                      ? 'var(--brand-primary)'
                      : 'transparent',
                    color: (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))
                      ? 'var(--text-inverse)'
                      : 'var(--text-primary)'
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Theme Toggle in Sidebar */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-medium)' }}>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all hover:shadow-theme-md"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}
              >
                <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-5 h-5" />
                <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
              </button>
            </div>
          </nav>

          {/* Sidebar Footer - CTA */}
          <div className="p-6 border-t" style={{ borderColor: 'var(--border-medium)' }}>
            <a
              href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-6 py-3 rounded-xl transition-all shadow-theme-md hover:shadow-theme-lg font-bold"
              style={{
                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                color: 'var(--text-inverse)'
              }}
            >
              🚀 Comprar $MILAGRE
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="lg:ml-72 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-lg border-b shadow-theme-sm" style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-medium)'
        }}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Hamburger Menu Button - Mobile & Desktop */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
              </button>

              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition group lg:hidden">
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

            {/* Page Title or Logo - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {pathname === '/' && 'Início'}
                {pathname.startsWith('/dashboard/noticias') && 'Notícias'}
                {pathname === '/educacao' && 'Educação'}
                {pathname === '/recursos' && 'Recursos'}
                {pathname === '/sobre' && 'Sobre'}
                {pathname === '/token' && 'Token'}
                {pathname === '/manifesto' && 'Manifesto'}
                {pathname === '/doacoes' && 'Doações'}
              </h1>
            </div>

            {/* Desktop Actions */}
            <nav className="hidden lg:flex items-center gap-4">
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

              <a
                href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-lg transition-all shadow-theme-md hover:shadow-theme-lg font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                  color: 'var(--text-inverse)'
                }}
              >
                🚀 Comprar $MILAGRE
              </a>
            </nav>
            </div>
          </div>
        </header>

        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t mt-12" style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-medium)'
        }}>
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                $MILAGRE é um projeto comunitário criado para conectar pessoas através de apoio mútuo e esperança.
              </p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                © 2025 $MILAGRE Community
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
