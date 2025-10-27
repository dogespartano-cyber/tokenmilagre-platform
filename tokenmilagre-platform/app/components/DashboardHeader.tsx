'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

const TickerTapeWidget = dynamic(() => import('@/components/TickerTapeWidget'), {
  ssr: false,
});

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
    const fetchFearGreed = async () => {
      try {
        const response = await fetch('/api/fear-greed');
        const result = await response.json();

        if (result.success && result.data) {
          setFearGreed(result.data);
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
          {/* Velocímetro Fear & Greed */}
          {fearGreed && (
            <div className="hidden lg:flex items-center">
              {/* Velocímetro SVG */}
              <div className="relative flex items-center justify-center" style={{ width: '240px', height: '160px' }}>
                <svg viewBox="-20 -30 320 250" className="w-full h-full" style={{ overflow: 'visible' }}>
                  <defs>
                    {/* Gradiente arco-íris */}
                    <linearGradient id="rainbowGradientDashboard" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#DC2626" />
                      <stop offset="20%" stopColor="#EA580C" />
                      <stop offset="40%" stopColor="#F59E0B" />
                      <stop offset="60%" stopColor="#84CC16" />
                      <stop offset="80%" stopColor="#22C55E" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>

                    {/* Filtros */}
                    <filter id="softShadowDashboard" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                      <feOffset dx="0" dy="2" result="offsetblur"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>

                    <filter id="intensiveGlowDashboard" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Arco de fundo */}
                  <path
                    d="M 50 170 A 90 90 0 0 1 230 170"
                    fill="none"
                    stroke="var(--border-medium)"
                    strokeWidth="26"
                    strokeLinecap="butt"
                    opacity="0.2"
                  />

                  {/* Arco colorido */}
                  <path
                    d="M 50 170 A 90 90 0 0 1 230 170"
                    fill="none"
                    stroke="url(#rainbowGradientDashboard)"
                    strokeWidth="26"
                    strokeLinecap="butt"
                    filter="url(#intensiveGlowDashboard)"
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
                    const innerRadius = 76;
                    const outerRadius = 87;
                    const labelRadius = 105;

                    const x1 = 140 + innerRadius * Math.cos(radian);
                    const y1 = 170 + innerRadius * Math.sin(radian);
                    const x2 = 140 + outerRadius * Math.cos(radian);
                    const y2 = 170 + outerRadius * Math.sin(radian);
                    const labelX = 140 + labelRadius * Math.cos(radian);
                    const labelY = 170 + labelRadius * Math.sin(radian);

                    return (
                      <g key={idx}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={mark.color}
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <text
                          x={labelX}
                          y={labelY}
                          fill="var(--text-primary)"
                          fontSize="13"
                          fontWeight="700"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {mark.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Marcações secundárias */}
                  {[10, 20, 30, 40, 60, 70, 80, 90].map((val, idx) => {
                    const angle = -180 + (val * 1.8);
                    const radian = (angle * Math.PI) / 180;
                    const x1 = 140 + 81 * Math.cos(radian);
                    const y1 = 170 + 81 * Math.sin(radian);
                    const x2 = 140 + 87 * Math.cos(radian);
                    const y2 = 170 + 87 * Math.sin(radian);

                    return (
                      <line
                        key={idx}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="var(--text-tertiary)"
                        strokeWidth="2"
                        opacity="0.4"
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* Ponteiro */}
                  <g
                    style={{
                      transform: `rotate(${(gaugeValue * 1.8) - 90}deg)`,
                      transformOrigin: '140px 170px',
                      transition: 'transform 0.05s linear'
                    }}
                  >
                    <path
                      d="M 140 170 L 135 165 L 138 90 L 140 85 L 142 90 L 145 165 Z"
                      fill="#000000"
                      opacity="0.15"
                      transform="translate(2, 3)"
                    />
                    <path
                      d="M 140 170 L 135 165 L 138 90 L 140 85 L 142 90 L 145 165 Z"
                      fill={
                        gaugeValue <= 20 ? '#DC2626' :
                        gaugeValue <= 40 ? '#F59E0B' :
                        gaugeValue <= 60 ? '#84CC16' :
                        gaugeValue <= 80 ? '#22C55E' : '#10B981'
                      }
                      filter="url(#softShadowDashboard)"
                    />
                  </g>

                  {/* Base do ponteiro */}
                  <circle
                    cx="140"
                    cy="170"
                    r="18"
                    fill="var(--bg-elevated)"
                    stroke="var(--border-medium)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="140"
                    cy="170"
                    r="11"
                    fill={
                      gaugeValue <= 20 ? '#DC2626' :
                      gaugeValue <= 40 ? '#F59E0B' :
                      gaugeValue <= 60 ? '#84CC16' :
                      gaugeValue <= 80 ? '#22C55E' : '#10B981'
                    }
                    filter="url(#intensiveGlowDashboard)"
                  />

                  {/* Valor numérico */}
                  <text
                    x="140"
                    y="145"
                    fill="var(--text-primary)"
                    fontSize="32"
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

          <div>
            <h1
              className="text-4xl font-bold mb-1 font-[family-name:var(--font-poppins)]"
              style={{
                color: 'var(--text-primary)',
                opacity: animateTitle ? 1 : 0,
                transform: animateTitle ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
              }}
            >
              {title}
            </h1>
            <p
              className="text-lg"
              style={{
                color: 'var(--text-secondary)',
                opacity: animateTitle ? 1 : 0,
                transform: animateTitle ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s'
              }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Community Buttons */}
        <div
          className="flex gap-3"
          style={{
            opacity: animateTitle ? 1 : 0,
            transform: animateTitle ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s'
          }}
        >
          <a
            href="https://discord.gg/skaX8bFY"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #5865F2, #4752C4)',
              color: 'white'
            }}
          >
            <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
            <span>Discord</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>

          <a
            href="https://t.me/+Bop_TVFc_mg3Njlh"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #0088cc, #006699)',
              color: 'white'
            }}
          >
            <FontAwesomeIcon icon={faTelegram} className="w-5 h-5" />
            <span>Telegram</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>

      {/* Ticker Tape - Fita de Preços */}
      <div
        className="rounded-2xl overflow-hidden shadow-md border"
        style={{
          borderColor: 'var(--border-light)',
          backgroundColor: 'var(--bg-elevated)',
          opacity: animateTitle ? 1 : 0,
          transform: animateTitle ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s'
        }}
      >
        <TickerTapeWidget />
      </div>
    </div>
  );
}
