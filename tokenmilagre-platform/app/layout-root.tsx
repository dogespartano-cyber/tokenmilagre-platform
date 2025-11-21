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

        {/* Footer */ }
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
      </div >
    </div >
  );
}
