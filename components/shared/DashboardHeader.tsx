'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SocialLinks from '@/components/shared/SocialLinks';

interface DashboardHeaderProps {
  title: string;
  description: string;
}

interface FearGreedData {
  value: string;
  value_classification: string;
}

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
  const [gaugeValue, setGaugeValue] = useState(0);
  const [animateTitle, setAnimateTitle] = useState(false);

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

    // Pequeno delay para resetar e depois ativar com efeito suave
    const timer = setTimeout(() => {
      setAnimateTitle(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [title, pathname]); // Anima quando título ou pathname mudar

  // Animação do ponteiro do velocímetro
  // Reinicia quando fearGreed muda OU quando a página muda (pathname)
  useEffect(() => {
    if (fearGreed) {
      const targetValue = parseInt(fearGreed.value);
      const duration = 2500;
      const steps = 60;
      const stepValue = targetValue / steps;
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1
              className={`text-4xl font-bold mb-1 font-[family-name:var(--font-poppins)] ${pathname === '/' ? 'hidden lg:block text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}
              style={{
                opacity: animateTitle ? 1 : 0,
                transform: animateTitle ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
              }}
            >
              {title}
            </h1>
            <p
              className={`text-lg ${pathname === '/' ? 'text-[var(--text-primary)] text-xl lg:text-lg lg:text-[var(--text-secondary)] font-bold lg:font-normal' : 'text-[var(--text-secondary)]'}`}
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

        {/* Community Buttons - Now using centralized SocialLinks */}
        <div
          style={{
            opacity: animateTitle ? 1 : 0,
            transform: animateTitle ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s'
          }}
        >
          <SocialLinks
            variant="glass"
            platforms={['discord', 'telegram']}
            size="md"
          />
        </div>
      </div>
    </div>
  );
}
