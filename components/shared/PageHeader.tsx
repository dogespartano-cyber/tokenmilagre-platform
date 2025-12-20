'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FearGreedDesktop } from '@/app/components/home/FearGreedDesktop';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { useSidebar } from '@/contexts/SidebarContext';

interface PageHeaderProps {
  title: string;
  description: string;
  shortTitle?: string;
}

interface FearGreedData {
  value: string;
  value_classification: string;
}

export default function PageHeader({ title, description, shortTitle }: PageHeaderProps) {
  const pathname = usePathname();
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
  const [gaugeValue, setGaugeValue] = useState(0);
  const [animateTitle, setAnimateTitle] = useState(false);
  const { setDynamicTitle, setShortTitle } = useSidebar();

  // Buscar Fear & Greed Index
  useEffect(() => {
    const CACHE_KEY = 'fear_greed_index';

    // Carregar do cache imediatamente (elimina flash visual)
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
          // Salvar no cache
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
        } else {
          console.error('Erro ao buscar Fear & Greed Index:', result.error);
        }
      } catch (error) {
        console.error('Erro ao buscar Fear & Greed Index:', error);
      }
    };

    fetchFearGreed();
  }, []);

  // Animação do título quando muda de página
  useEffect(() => {
    // Desativa a animação
    setAnimateTitle(false);

    // Atualiza o título dinâmico no contexto (para a navbar mobile)
    setDynamicTitle(title);
    if (shortTitle) {
      setShortTitle(shortTitle);
    } else if (title === '$MILAGRE') {
      setShortTitle('');
    } else {
      setShortTitle(title);
    }

    // Pequeno delay para resetar e depois ativar com efeito suave
    const timer = setTimeout(() => {
      setAnimateTitle(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [title, pathname, setDynamicTitle]); // Anima quando título ou pathname mudar

  // Animação do ponteiro do velocímetro
  // Reinicia quando fearGreed muda OU quando a página muda (pathname)
  useEffect(() => {
    if (fearGreed) {
      const targetValue = parseInt(fearGreed.value);
      const duration = 2500;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;

      // Resetar para 0 para iniciar a animação
      setGaugeValue(0);

      // Easing function
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
  }, [fearGreed, pathname]); // Adiciona pathname como dependência

  return (
    <div className="space-y-2 lg:space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div
            className="hidden lg:block relative w-28 h-28 group cursor-pointer"
            style={{
              opacity: animateTitle ? 1 : 0,
              transform: animateTitle ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
            }}
          >
            <Image
              src="/images/TOKEN-MILAGRE-Hero.webp"
              alt="$MILAGRE Logo"
              fill
              sizes="112px"
              className="object-contain transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          <div>
            {/* Título - sempre clicável, posts de notícias voltam para /noticias */}
            <Link href={pathname.startsWith('/noticias/') && pathname !== '/noticias' ? '/noticias' : pathname}>
              <h1
                className={`text-4xl font-bold mb-1 font-[family-name:var(--font-poppins)] text-[#ebb60b] cursor-pointer hover:text-[var(--brand-primary)] transition-colors hidden lg:block uppercase ${pathname === '/' ? '' : ''}`}
                style={{
                  opacity: animateTitle ? 1 : 0,
                  transform: animateTitle ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, color 0.3s ease'
                }}
              >
                {title}
              </h1>
            </Link>
            <p
              className="text-xl lg:text-lg text-[var(--text-primary)] font-bold"
              style={{
                opacity: animateTitle ? 1 : 0,
                transform: animateTitle ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s'
              }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Fear & Greed Gauge - Desktop Only */}
        <div
          style={{
            opacity: animateTitle ? 1 : 0,
            transform: animateTitle ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s'
          }}
        >
          <FearGreedDesktop
            fearGreed={fearGreed}
            gaugeValue={gaugeValue}
          />
        </div>
      </div>

      {/* Breadcrumbs - última posição do header */}
      <div className="sr-only">
        <Breadcrumbs inline={true} />
      </div>
    </div>
  );
}
