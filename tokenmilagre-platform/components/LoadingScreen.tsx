'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Após 1.5s, iniciar fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Após fade out (500ms), notificar conclusão
      setTimeout(onLoadingComplete, 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500"
      style={{
        backgroundColor: 'var(--bg-primary)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo $MILAGRE */}
        <div className="relative">
          {/* Círculo de loading animado */}
          <svg
            className="absolute inset-0 -m-8"
            width="160"
            height="160"
            viewBox="0 0 160 160"
          >
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="4"
              strokeDasharray="440"
              strokeDashoffset="440"
              strokeLinecap="round"
              style={{
                animation: 'dash 1.5s ease-in-out infinite',
              }}
            />
          </svg>

          {/* Logo texto */}
          <div
            className="relative z-10 flex items-center justify-center w-24 h-24 text-4xl font-black"
            style={{
              color: 'var(--brand-primary)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          >
            $M
          </div>
        </div>

        {/* Texto opcional */}
        <p
          className="text-sm font-semibold animate-pulse"
          style={{ color: 'var(--text-secondary)' }}
        >
          Carregando...
        </p>
      </div>

      <style jsx>{`
        @keyframes dash {
          0% {
            stroke-dashoffset: 440;
            transform: rotate(0deg);
          }
          50% {
            stroke-dashoffset: 0;
            transform: rotate(180deg);
          }
          100% {
            stroke-dashoffset: -440;
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
