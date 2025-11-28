'use client';

import { useState, useEffect } from 'react';
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
import AnimatedBackground from '@/components/AnimatedBackground';
import ScrollToTop from '@/app/components/ScrollToTop';

const TickerTapeWidget = dynamic(() => import('@/components/TickerTapeWidget'), {
  ssr: false,
});

const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';

interface FearGreedData {
  value: string;
  value_classification: string;
}

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
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
  const [gaugeValue, setGaugeValue] = useState(0);

  // Buscar Fear & Greed Index
  useEffect(() => {
    const CACHE_KEY = 'fear_greed_index';

    // Carregar do cache imediatamente
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        setFearGreed(cachedData);
      } catch (error) {
        console.error('Erro ao carregar cache:', error);
      }
    }

    // Buscar dados atualizados em background
    const fetchFearGreed = async () => {
      try {
        const response = await fetch('/api/fear-greed');
        const result = await response.json();

        if (result.success && result.data) {
          setFearGreed(result.data);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
        }
      } catch (error) {
        console.error('Erro ao buscar Fear & Greed Index:', error);
      }
    };

    fetchFearGreed();
  }, []);

  // Animação do ponteiro do velocímetro
  useEffect(() => {
    if (fearGreed) {
      const targetValue = parseInt(fearGreed.value);
      const duration = 2500;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      setGaugeValue(0);

      const easeOutCubic = (t: number): number => {
        return 1 - Math.pow(1 - t, 3);
      };

      const animate = () => {
        currentStep++;
        const progress = currentStep / steps;
        const easedProgress = easeOutCubic(progress);
        const newValue = Math.floor(easedProgress * targetValue);

        setGaugeValue(newValue);

        if (currentStep < steps) {
          setTimeout(animate, stepDuration);
        } else {
          setGaugeValue(targetValue);
        }
      };

      animate();
    }
  }, [fearGreed, pathname]);

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
          borderRight: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header - Fixed Height for Alignment */}
          <div className="h-[88px] flex items-center px-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center justify-between w-full">
              <Link href="/" className="flex items-center gap-3 hover:opacity-100 transition-all duration-300 group px-2 py-1 rounded-xl" onClick={() => setSidebarOpen(false)}>
                <div className="relative w-10 h-10 rounded-full shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.3)] border-2 group-hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(var(--brand-primary-rgb),0.6)]" style={{
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
                <div className="text-xl font-bold drop-shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.5)] transition-all duration-300 font-[family-name:var(--font-poppins)] text-theme-primary group-hover:text-brand-primary group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.8)]">
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
                        ? 'rgba(13, 148, 136, 0.1)' // Soft button background (Teal 600)
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
                        background: `linear-gradient(90deg, transparent, ${theme === 'light' ? 'rgba(13, 148, 136, 0.5)' : 'rgba(255,255,255,0.2)'}, transparent)`
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
          </nav >
        </div >
      </aside >

      {/* Main Content Wrapper */}
      < div className="min-h-screen flex flex-col lg:ml-72" >
        {/* Header - Fixed Height for Alignment */}
        < header className="sticky top-0 z-30 backdrop-blur-xl border-b h-[88px] flex items-center" style={{
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

              {/* Fear & Greed Velocímetro + Crypto Ticker - Desktop */}
              <div className="hidden lg:flex flex-1 w-full mx-8 items-center gap-8 justify-center overflow-hidden">
                {/* Velocímetro Fear & Greed - Versão Compacta */}
                {fearGreed && (
                  <div
                    className="flex items-center shrink-0 mr-12 relative"
                    style={{ marginLeft: '-8px', marginRight: '-8px' }}
                  >
                    <div
                      className="relative flex items-center justify-center group cursor-pointer"
                      style={{ width: '120px', height: '90px', marginTop: '-28px' }}
                      title="Fear & Greed - Sentimento de mercado"
                    >
                      <svg viewBox="20 -25 140 140" className="w-full h-full" style={{ overflow: 'visible' }}>
                        <defs>
                          {/* Gradiente arco-íris */}
                          <linearGradient id="rainbowGradientNavbar" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#DC2626" />
                            <stop offset="20%" stopColor="#EA580C" />
                            <stop offset="40%" stopColor="#F59E0B" />
                            <stop offset="60%" stopColor="#84CC16" />
                            <stop offset="80%" stopColor="#22C55E" />
                            <stop offset="100%" stopColor="#10B981" />
                          </linearGradient>

                          {/* Filtros */}
                          <filter id="softShadowNavbar" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                            <feOffset dx="0" dy="1" result="offsetblur" />
                            <feComponentTransfer>
                              <feFuncA type="linear" slope="0.3" />
                            </feComponentTransfer>
                            <feMerge>
                              <feMergeNode />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>

                          <filter id="intensiveGlowNavbar" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        {/* Arco de fundo */}
                        <path
                          d="M 30 100 A 60 60 0 0 1 150 100"
                          fill="none"
                          stroke="var(--border-medium)"
                          strokeWidth="16"
                          strokeLinecap="butt"
                          opacity="0.2"
                        />

                        {/* Arco colorido */}
                        <path
                          d="M 30 100 A 60 60 0 0 1 150 100"
                          fill="none"
                          stroke="url(#rainbowGradientNavbar)"
                          strokeWidth="16"
                          strokeLinecap="butt"
                          filter="url(#intensiveGlowNavbar)"
                        />

                        {/* Marcações principais */}
                        {[
                          { value: 0, label: '0', color: '#DC2626' },
                          { value: 25, label: '25', color: '#F59E0B' },
                          { value: 50, label: '50', color: '#84CC16' },
                          { value: 75, label: '75', color: '#22C55E' },
                          { value: 100, label: '100', color: '#10B981' }
                        ].map((mark, idx) => {
                          const angle = -180 + (mark.value * 1.8);
                          const radian = (angle * Math.PI) / 180;
                          const innerRadius = 52;
                          const outerRadius = 58;
                          const labelRadius = 70;

                          const x1 = 90 + innerRadius * Math.cos(radian);
                          const y1 = 100 + innerRadius * Math.sin(radian);
                          const x2 = 90 + outerRadius * Math.cos(radian);
                          const y2 = 100 + outerRadius * Math.sin(radian);
                          const labelX = 90 + labelRadius * Math.cos(radian);
                          const labelY = 100 + labelRadius * Math.sin(radian);

                          return (
                            <g key={idx}>
                              <line
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={mark.color}
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <text
                                x={labelX}
                                y={labelY}
                                fill="var(--text-primary)"
                                fontSize="10"
                                fontWeight="700"
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                {mark.label}
                              </text>
                            </g>
                          );
                        })}

                        {/* Ponteiro */}
                        <g
                          style={{
                            transform: `rotate(${(gaugeValue * 1.8) - 90}deg)`,
                            transformOrigin: '90px 100px',
                            transition: 'transform 0.05s linear'
                          }}
                        >
                          <path
                            d="M 90 100 L 87 97 L 88 50 L 90 47 L 92 50 L 93 97 Z"
                            fill="#000000"
                            opacity="0.15"
                            transform="translate(1, 2)"
                          />
                          <path
                            d="M 90 100 L 87 97 L 88 50 L 90 47 L 92 50 L 93 97 Z"
                            fill={
                              gaugeValue <= 20 ? '#DC2626' :
                                gaugeValue <= 40 ? '#F59E0B' :
                                  gaugeValue <= 60 ? '#84CC16' :
                                    gaugeValue <= 80 ? '#22C55E' : '#10B981'
                            }
                            filter="url(#softShadowNavbar)"
                          />
                        </g>

                        {/* Base do ponteiro */}
                        <circle
                          cx="90"
                          cy="100"
                          r="10"
                          fill="var(--bg-elevated)"
                          stroke="var(--border-medium)"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="90"
                          cy="100"
                          r="6"
                          fill={
                            gaugeValue <= 20 ? '#DC2626' :
                              gaugeValue <= 40 ? '#F59E0B' :
                                gaugeValue <= 60 ? '#84CC16' :
                                  gaugeValue <= 80 ? '#22C55E' : '#10B981'
                          }
                          filter="url(#intensiveGlowNavbar)"
                        />

                        {/* Valor numérico */}
                        <text
                          x="90"
                          y="80"
                          fill="var(--text-primary)"
                          fontSize="20"
                          fontWeight="900"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {gaugeValue}
                        </text>
                      </svg>
                    </div>
                  </div>
                )}

                {/* Crypto Ticker */}
                <div className="flex-1 overflow-hidden">
                  <NavbarCryptoTicker />
                </div>
              </div>

              {/* Desktop Actions */}
              <nav className="hidden lg:flex items-center gap-6 pl-8 h-10 my-auto">
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

                <Link
                  href="/token"
                  className="group flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.3)] hover:shadow-[0_0_25px_rgba(var(--brand-primary-rgb),0.5)] hover:scale-105 font-bold relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                    color: 'white'
                  }}
                >
                  {/* Angelical Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                  <FontAwesomeIcon icon={faHeart} className="w-5 h-5 transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse relative z-10" />
                  <span className="relative z-10">$MILAGRE</span>
                </Link>
              </nav>
            </div>
          </div>
        </header >

        <main className="flex-1 relative">
          {/* Animated Background - Global */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <AnimatedBackground variant="hero" opacity={0.08} />
          </div>

          {/* Breadcrumbs - Moved to Main Content */}
          <div className="container mx-auto px-4 mt-4 relative z-10">
            <Breadcrumbs inline={true} />
          </div>

          {/* Renderizar DashboardHeader apenas nas páginas configuradas */}
          {headerConfig && (
            <div className="container mx-auto px-4 py-8 relative z-10">
              <DashboardHeader
                title={headerConfig.title}
                description={headerConfig.description}
              />
            </div>
          )}

          {/* Ticker Tape - Sempre montado para evitar recarregamento */}
          <div
            className="container mx-auto px-4 mb-8 relative z-10"
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

          <div className="relative z-10">
            {children}
          </div>
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

        {/* Global Scroll to Top Button */}
        <ScrollToTop />
      </div >
    </div >
  );
}
