'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faChartLine, faNewspaper } from '@fortawesome/free-solid-svg-icons';

const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard/mercado', label: 'Mercado', icon: faChartLine },
    { href: '/dashboard/noticias', label: 'Notícias', icon: faNewspaper },
    { href: '/dashboard', label: 'Portfolio', icon: faBriefcase },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#142841] to-[#1E3A5F]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#142841]/95 backdrop-blur-lg border-b-2 border-[#2A4A6E]/60 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white text-2xl focus:outline-none"
              >
                {sidebarOpen ? '✕' : '☰'}
              </button>

              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition group">
                <div className="relative w-10 h-10 rounded-full shadow-lg overflow-hidden border-2 border-[#10B981]/50 group-hover:border-[#10B981] transition-all group-hover:scale-110">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 blur-sm"></div>
                  <Image
                    src="/images/TOKEN-MILAGRE-Hero.webp"
                    alt="$MILAGRE"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover relative z-10"
                  />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#E0E6ED] drop-shadow-lg group-hover:text-[#34D399] transition font-[family-name:var(--font-poppins)]">
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
                  className={`text-[#E0E6ED] font-semibold transition ${
                    pathname === item.href
                      ? 'text-[#10B981]'
                      : 'hover:text-[#34D399]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/"
                className="text-[#E0E6ED] hover:text-[#34D399] transition font-semibold"
              >
                ← Voltar
              </Link>
            </nav>

            {/* Botão Voltar - Mobile */}
            <Link
              href="/"
              className="md:hidden text-[#E0E6ED] hover:text-[#34D399] transition font-semibold"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-[#0A1628] backdrop-blur-lg border-r-2 border-[#2A4A6E]/60 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          <nav className="p-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === item.href
                    ? 'bg-[#142841] border-l-4 border-[#10B981] text-[#FFFFFF] font-bold shadow-lg'
                    : 'bg-[#142841]/50 border-2 border-[#2A4A6E]/40 text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-[#E0E6ED]'
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </Link>
            ))}

            {/* Comprar $MILAGRE Button */}
            <div className="pt-4 mt-4 border-t-2 border-[#2A4A6E]/60">
              <a
                href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 text-white font-bold shadow-lg hover:scale-105"
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
              className="absolute left-0 top-16 bottom-0 w-64 bg-[#0A1628] backdrop-blur-lg border-r-2 border-[#2A4A6E]/60"
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
                        ? 'bg-[#142841] border-l-4 border-[#10B981] text-[#FFFFFF] font-bold shadow-lg'
                        : 'bg-[#142841]/50 border-2 border-[#2A4A6E]/40 text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-[#E0E6ED]'
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                ))}

                {/* Comprar $MILAGRE Button */}
                <div className="pt-4 mt-4 border-t-2 border-[#2A4A6E]/60">
                  <a
                    href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 text-white font-bold shadow-lg"
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
