'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faNewspaper, faSun, faMoon, faHome, faInfoCircle, faCoins, faBars, faTimes, faBook, faGraduationCap, faStore, faHeart, faBitcoinSign, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/contexts/ThemeContext';
import Breadcrumbs from '@/components/Breadcrumbs';
import DashboardHeader from '@/app/components/DashboardHeader';
import UserDropdown from '@/components/UserDropdown';
import NavbarCryptoTicker from '@/components/NavbarCryptoTicker';

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
  },
  '/dashboard': {
    title: 'Painel Administrativo',
    description: 'Gerencie todo o conteúdo e configurações da plataforma'
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
  const { data: session } = useSession();


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
      <aside className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 shadow-2xl`} style={{
          backgroundColor: 'var(--bg-elevated)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)' // Softer border
        }}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header - Fixed Height for Alignment */}
          <div className="h-[88px] flex items-center px-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center justify-between w-full">
              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group" onClick={() => setSidebarOpen(false)}>
                <div className="relative w-10 h-10 rounded-full shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.3)] overflow-hidden border-2 group-hover:scale-110 transition-all duration-300 group-hover:rotate-12" style={{
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
                <div className="text-xl font-bold drop-shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.5)] transition-all duration-300 font-[family-name:var(--font-poppins)] text-theme-primary group-hover:text-brand-primary group-hover:scale-105">
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
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 relative overflow-hidden ${isActive
                      ? 'text-brand-primary shadow-theme-sm'
                      : 'text-theme-primary hover:bg-white/5 hover:translate-x-1'
                      }`}
                    style={{
                      backgroundColor: isActive
                        ? 'rgba(var(--brand-primary-rgb), 0.1)' // Soft button background
                        : 'transparent',
                      color: isActive
                        ? 'var(--brand-primary)'
                        : 'var(--text-primary)'
                    }}
                  >
                    {/* Shine Effect - Green in Light Mode, White in Dark Mode */}
                    <div
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${theme === 'light' ? 'rgba(var(--brand-primary-rgb), 0.5)' : 'rgba(255,255,255,0.2)'}, transparent)`
                      }}
                    />

                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`w-5 h-5 transition-transform duration-300 relative z-10 ${isActive ? 'scale-110' : 'group-hover:rotate-12'}`}
                    />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Sidebar Footer - CTA */}
          <div className="p-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
            <a
              href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 w-full text-center px-6 py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(var(--brand-primary-rgb),0.3)] hover:shadow-[0_4px_25px_rgba(var(--brand-primary-rgb),0.5)] hover:scale-[1.02] font-bold relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                color: 'white'
              }}
            >
              {/* Angelical Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

              <FontAwesomeIcon icon={faHeart} className="w-5 h-5 transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse relative z-10" />
              <span className="relative z-10">Comprar $MILAGRE</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="min-h-screen flex flex-col lg:ml-72">
        {/* Header - Fixed Height for Alignment */}
        <header className="sticky top-0 z-30 backdrop-blur-xl border-b h-[88px] flex items-center" style={{
          backgroundColor: 'rgba(var(--bg-elevated-rgb), 0.8)', // More transparency for glass effect
          borderColor: 'rgba(255, 255, 255, 0.05)'
        }}>
          <div className="container mx-auto px-6 h-full">
            <div className="flex justify-between items-center h-full">
              {/* Hamburger Menu Button - Mobile & Desktop */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="group lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-opacity-50"
                style={{ color: 'var(--text-primary)' }}
              >
                <FontAwesomeIcon icon={faBars} className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
              </button>

              <div className="flex items-center gap-4 lg:hidden">
                <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group">
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

                <button
                  onClick={toggleTheme}
                  className="group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="text-xs font-semibold whitespace-nowrap">{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
                </button>
              </div>

              {/* Crypto Ticker - Desktop */}
              <div className="hidden lg:flex flex-1 w-full mx-8 justify-center overflow-hidden">
                <NavbarCryptoTicker />
              </div>

              {/* Desktop Actions */}
              <nav className="hidden lg:flex items-center gap-6 pl-8 border-l h-10 my-auto" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <button
                  onClick={toggleTheme}
                  className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-white/5"
                  style={{
                    color: 'var(--text-primary)'
                  }}
                >
                  <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="text-sm font-semibold">{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
                </button>

                <UserDropdown />

                <a
                  href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.3)] hover:shadow-[0_0_25px_rgba(var(--brand-primary-rgb),0.5)] hover:scale-105 font-bold relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                    color: 'white'
                  }}
                >
                  {/* Angelical Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                  <FontAwesomeIcon icon={faHeart} className="w-5 h-5 transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse relative z-10" />
                  <span className="relative z-10">Comprar $MILAGRE</span>
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Breadcrumbs - Moved to Main Content */}
          <div className="container mx-auto px-4 mt-4">
            <Breadcrumbs inline={true} />
          </div>

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
