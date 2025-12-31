import React from 'react';

type AnimatedBackgroundVariant =
  | 'hero'
  | 'primary'
  | 'secondary'
  | 'gradient'
  | 'vibrant'
  | 'calm'
  | 'energetic';

interface AnimatedBackgroundProps {
  variant?: AnimatedBackgroundVariant;
  opacity?: number;
  animated?: boolean;
}

/**
 * Componente de fundo animado com círculos blur
 * Aplica o padrão visual do hero em qualquer seção
 */
export default function AnimatedBackground({
  variant = 'primary',
  opacity = 0.1,
  animated = false
}: AnimatedBackgroundProps) {

  const variants = {
    hero: {
      circles: [
        { size: 'w-72 h-72', position: 'top-20 left-10', color: 'bg-purple-600', blur: 'blur-3xl' },
        { size: 'w-96 h-96', position: 'bottom-20 right-10', color: 'bg-teal-600', blur: 'blur-3xl' },
        { size: 'w-64 h-64', position: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2', color: 'bg-green-500', blur: 'blur-3xl' }
      ]
    },
    primary: {
      circles: [
        { size: 'w-72 h-72', position: 'top-20 right-10', color: 'bg-green-500', blur: 'blur-3xl' },
        { size: 'w-96 h-96', position: 'bottom-20 left-10', color: 'bg-purple-600', blur: 'blur-3xl' },
        { size: 'w-64 h-64', position: 'top-1/2 left-1/3', color: 'bg-teal-600', blur: 'blur-3xl' }
      ]
    },
    secondary: {
      circles: [
        { size: 'w-80 h-80', position: 'top-40 left-20', color: 'bg-teal-600', blur: 'blur-3xl' },
        { size: 'w-72 h-72', position: 'bottom-40 right-20', color: 'bg-amber-400', blur: 'blur-3xl' },
        { size: 'w-64 h-64', position: 'top-1/3 right-1/3', color: 'bg-purple-600', blur: 'blur-3xl' }
      ]
    },
    gradient: {
      circles: [
        { size: 'w-96 h-96', position: 'top-32 left-10', color: 'bg-purple-600', blur: 'blur-3xl' },
        { size: 'w-80 h-80', position: 'bottom-32 right-10', color: 'bg-teal-600', blur: 'blur-3xl' },
        { size: 'w-72 h-72', position: 'top-2/3 left-1/2', color: 'bg-green-500', blur: 'blur-3xl' }
      ]
    },
    vibrant: {
      circles: [
        { size: 'w-80 h-80', position: 'top-10 right-10', color: 'bg-amber-400', blur: 'blur-3xl' },
        { size: 'w-96 h-96', position: 'bottom-10 left-10', color: 'bg-orange-500', blur: 'blur-3xl' },
        { size: 'w-72 h-72', position: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2', color: 'bg-teal-400', blur: 'blur-3xl' }
      ]
    },
    calm: {
      circles: [
        { size: 'w-72 h-72', position: 'top-24 left-16', color: 'bg-blue-500', blur: 'blur-3xl' },
        { size: 'w-80 h-80', position: 'bottom-24 right-16', color: 'bg-indigo-500', blur: 'blur-3xl' },
        { size: 'w-64 h-64', position: 'top-1/2 right-1/4', color: 'bg-purple-500', blur: 'blur-3xl' }
      ]
    },
    energetic: {
      circles: [
        { size: 'w-88 h-88', position: 'top-16 right-12', color: 'bg-pink-500', blur: 'blur-3xl' },
        { size: 'w-72 h-72', position: 'bottom-16 left-12', color: 'bg-rose-500', blur: 'blur-3xl' },
        { size: 'w-80 h-80', position: 'top-1/3 left-1/2', color: 'bg-orange-500', blur: 'blur-3xl' }
      ]
    }
  };

  const selectedVariant = variants[variant];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity }}>
      {selectedVariant.circles.map((circle, index) => (
        <div
          key={index}
          className={`absolute ${circle.position} ${circle.size} rounded-full ${circle.blur} ${circle.color} ${
            animated ? 'animate-pulse' : ''
          }`}
          style={animated ? { animationDelay: `${index}s` } : undefined}
        />
      ))}
    </div>
  );
}
