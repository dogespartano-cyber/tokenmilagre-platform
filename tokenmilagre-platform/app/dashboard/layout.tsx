'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Portfolio', icon: '💼' },
    { href: '/dashboard/mercado', label: 'Mercado', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5DD4D4] via-[#4DB8D8] to-[#E8F4F4]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#4DB8D8]/95 to-[#5DD4D4]/95 backdrop-blur-lg border-b-2 border-white/20 shadow-xl">
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

              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
                <div className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg font-[family-name:var(--font-poppins)]">
                  $MILAGRE Dashboard
                </div>
              </Link>
            </div>
            <Link
              href="/"
              className="text-white hover:text-yellow-300 transition font-semibold"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 min-h-screen bg-white/10 backdrop-blur-lg border-r-2 border-white/20">
          <nav className="p-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-yellow-400/30 to-amber-400/30 border-2 border-yellow-300/50 text-white font-bold'
                    : 'bg-white/5 border-2 border-white/10 text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
            <aside
              className="absolute left-0 top-16 bottom-0 w-64 bg-gradient-to-br from-[#4DB8D8] to-[#5DD4D4] backdrop-blur-lg border-r-2 border-white/20"
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
                        ? 'bg-gradient-to-r from-yellow-400/30 to-amber-400/30 border-2 border-yellow-300/50 text-white font-bold'
                        : 'bg-white/5 border-2 border-white/10 text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                ))}
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
