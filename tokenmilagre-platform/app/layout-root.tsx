'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faNewspaper, faSun, faMoon, faHome, faInfoCircle, faCoins, faBars, faTimes, faBook, faGraduationCap, faStore, faHeart, faBitcoinSign } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/contexts/ThemeContext';
import Breadcrumbs from '@/components/Breadcrumbs';
import DashboardHeader from '@/app/components/DashboardHeader';

const TickerTapeWidget = dynamic(() => import('@/components/TickerTapeWidget'), {
  ssr: false,
});

const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';

// Configuração do DashboardHeader por pathname
const dashboardHeaderConfig: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Token Milagre',
    description: 'Educação financeira descentralizada para todos'
  },
  '/graficos': {
    title: 'Gráficos e Análises de Mercado',
    description: 'Acompanhe o mercado em tempo real com gráficos avançados, análise técnica e indicadores profissionais'
  },
  '/criptomoedas': {
    title: 'Criptomoedas',
    description: 'Rastreador completo das principais criptomoedas do mercado em tempo real'
  },
  '/dashboard/noticias': {
    title: 'Notícias Cripto',
    description: 'Resumos inteligentes das principais notícias do mercado'
  }
};

export default function RootLayoutNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Verificar se deve mostrar o DashboardHeader
  const headerConfig = dashboardHeaderConfig[pathname];

  const menuItems = [
    { href: '/', label: 'Início', icon: faHome },
    { href: '/dashboard/noticias', label: 'Notícias', icon: faNewspaper },
    { href: '/graficos', label: 'Gráficos', icon: faChartLine },
    { href: '/criptomoedas', label: 'Criptomoedas', icon: faBitcoinSign },
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
              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group" onClick={() => setSidebarOpen(false)}>
                <div className="relative w-10 h-10 rounded-full shadow-lg overflow-hidden border-2 group-hover:scale-110 transition-all duration-300 group-hover:rotate-12" style={{
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
                <div className="text-xl font-bold drop-shadow-lg transition-all duration-300 font-[family-name:var(--font-poppins)] text-theme-primary group-hover:text-brand-primary group-hover:scale-105">
                  $MILAGRE
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="group lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-opacity-50"
                style={{ color: 'var(--text-primary)' }}
              >
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
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
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))
                      ? 'shadow-theme-md'
                      : 'hover:bg-opacity-50 hover:scale-105 hover:translate-x-2'
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
                  <FontAwesomeIcon icon={item.icon} className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Theme Toggle in Sidebar */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-medium)' }}>
              <button
                onClick={toggleTheme}
                className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-theme-md hover:scale-105 hover:translate-x-2"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}
              >
                <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
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
              className="group flex items-center justify-center gap-2 w-full text-center px-6 py-3 rounded-xl transition-all duration-300 shadow-theme-md hover:shadow-theme-lg hover:scale-110 font-bold"
              style={{
                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                color: 'white'
              }}
            >
              <FontAwesomeIcon icon={faHeart} className="w-5 h-5 transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse" />
              <span>Comprar $MILAGRE</span>
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
                className="group lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-opacity-50"
                style={{ color: 'var(--text-primary)' }}
              >
                <FontAwesomeIcon icon={faBars} className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
              </button>

              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group lg:hidden">
                <div className="relative w-10 h-10 rounded-full shadow-lg overflow-hidden border-2 group-hover:scale-110 transition-all duration-300 group-hover:rotate-12" style={{
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
                <div className="text-xl sm:text-2xl font-bold drop-shadow-lg transition-all duration-300 font-[family-name:var(--font-poppins)] text-theme-primary group-hover:text-brand-primary group-hover:scale-105">
                  $MILAGRE
                </div>
              </Link>

            {/* Breadcrumbs - Desktop */}
            <div className="hidden lg:flex items-center">
              <Breadcrumbs inline={true} />
            </div>

            {/* Desktop Actions */}
            <nav className="hidden lg:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="group px-4 py-2 rounded-lg border-2 transition-all duration-300 shadow-theme-sm hover:shadow-theme-md hover:scale-110"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-medium)',
                  color: 'var(--text-primary)'
                }}
                title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
              >
                <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
              </button>

              <a
                href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300 shadow-theme-md hover:shadow-theme-lg hover:scale-110 font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                  color: 'white'
                }}
              >
                <FontAwesomeIcon icon={faHeart} className="w-5 h-5 transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse" />
                <span>Comprar $MILAGRE</span>
              </a>
            </nav>
            </div>
          </div>
        </header>

        <main>
          {/* Renderizar DashboardHeader apenas nas páginas configuradas */}
          {headerConfig && (
            <div className="container mx-auto px-4 py-8">
              <DashboardHeader
                title={headerConfig.title}
                description={headerConfig.description}
              />
            </div>
          )}

          {/* Ticker Tape - Sempre montado para evitar recarregamento */}
          <div
            className="container mx-auto px-4"
            style={{
              display: headerConfig ? 'block' : 'none',
            }}
          >
            <div
              className="rounded-2xl overflow-hidden shadow-md border"
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'var(--bg-elevated)',
              }}
            >
              <TickerTapeWidget />
            </div>
          </div>

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
