/**
 * RootLayoutNav - Layout Principal Refatorado
 * Orquestrador que usa componentes extraídos
 * 
 * @agi-module: layout-root
 * @refactored De 591 para ~180 linhas
 * 
 * NOTA: O PageHeader NÃO é mais renderizado aqui.
 * Cada página usa <PageWrapper header={...}> para seu header.
 * Veja: components/layout/PageWrapper.tsx
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faBars, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/contexts/ThemeContext';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import NavbarCryptoTicker from '@/components/crypto/NavbarCryptoTicker';
import GlobalBackground from '@/components/layout/GlobalBackground';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import CustomUserButton from '@/components/shared/CustomUserButton';
import ScrollToTop from '@/components/shared/ScrollToTop';
import CookieConsent from '@/components/shared/CookieConsent';

// Componentes extraídos
import { Sidebar, FearGreedGaugeNavbar, Footer } from './components/layout';
import { useFearGreedNavbar } from './components/layout/useFearGreedNavbar';
import { SidebarProvider } from '@/contexts/SidebarContext';

const TickerTapeWidget = dynamic(() => import('@/components/widgets/TickerTapeWidget'), {
  ssr: false,
});

export default function RootLayoutNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { fearGreed, gaugeValue } = useFearGreedNavbar();

  return (
    <SidebarProvider>
      <div className="min-h-screen">
        {/* Sidebar Component */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Wrapper */}
        <div className="min-h-screen flex flex-col lg:ml-72">
          {/* Header */}
          <header className="sticky top-0 z-30 backdrop-blur-xl h-[88px] flex items-center bg-transparent">
            <div className="container mx-auto px-6 h-full">
              <div className="flex justify-between items-center h-full">
                {/* Mobile Header Layout */}
                <div className="flex items-center justify-between w-full lg:hidden">
                  <div className="flex items-center gap-4">
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
                  </div>

                  <button
                    onClick={toggleTheme}
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 glass-card text-[var(--text-primary)]"
                  >
                    <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                    <span className="text-xs font-semibold whitespace-nowrap">{theme === 'light' ? 'Escuro' : 'Claro'}</span>
                  </button>
                </div>

                {/* Desktop: Fear & Greed + Crypto Ticker */}
                <div className="hidden lg:flex flex-1 w-full mx-8 items-center gap-8 justify-center overflow-hidden">
                  {fearGreed && <FearGreedGaugeNavbar value={gaugeValue} />}
                  <div className="flex-1 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <NavbarCryptoTicker />
                  </div>
                </div>

                {/* Desktop Actions */}
                <nav className="hidden lg:flex items-center gap-6 pl-8 h-10 my-auto">
                  <div className="mr-4">
                    <SignedIn>
                      <CustomUserButton />
                    </SignedIn>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-sm font-bold hover:bg-[var(--brand-hover)] transition-colors shadow-lg shadow-[var(--brand-primary)]/20">
                          Entrar
                        </button>
                      </SignInButton>
                    </SignedOut>
                  </div>

                  <button
                    onClick={toggleTheme}
                    className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-white/5 text-[var(--text-primary)]"
                  >
                    <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                    <span className="text-sm font-semibold">{theme === 'light' ? 'Escuro' : 'Claro'}</span>
                  </button>

                  <Link
                    href="/token"
                    className="glass-card group flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 font-bold relative overflow-hidden bg-[var(--brand-primary)]/10 hover:bg-[var(--brand-primary)]/20 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    <FontAwesomeIcon icon={faHeart} className="w-5 h-5 transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse relative z-10" />
                    <span className="relative z-10">$MILAGRE</span>
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1 relative">
            <GlobalBackground />

            {/* Breadcrumbs */}
            <div className="container mx-auto px-4 mt-4 relative z-10">
              <Breadcrumbs inline={true} />
            </div>

            {/* TODO: Ticker Tape desabilitado - revisar se continuar usando
            {!pathname.startsWith('/educacao') && !pathname.startsWith('/recursos') && (
              <div
                suppressHydrationWarning={true}
                className="container mx-auto px-4 my-8 relative z-10 hidden lg:block"
              >
                <div className="rounded-2xl overflow-hidden glass-card">
                  <TickerTapeWidget />
                </div>
              </div>
            )}
            */}

            {/* Page Content - PageHeader agora é renderizado dentro de cada página via PageWrapper */}
            <div className="relative z-10">
              {children}
            </div>
          </main>

          {/* Footer Component */}
          <Footer />

          {/* Mobile Sidebar Toggle FAB */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="glass-card fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex lg:hidden items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
            aria-label="Abrir menu"
          >
            <FontAwesomeIcon icon={faBars} className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
          </button>

          {/* Global Components */}
          <CookieConsent />
          <ScrollToTop />
        </div>
      </div>
    </SidebarProvider>
  );
}
