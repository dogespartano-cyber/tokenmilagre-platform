'use client';

import { useEffect, useState, memo, useCallback } from 'react';

/**
 * Props for the LoadingScreen component
 */
export interface LoadingScreenProps {
  /** Callback function called when loading animation completes */
  onLoadingComplete: () => void;
  /** Duration in milliseconds before fade out starts */
  duration?: number;
  /** Duration of fade out animation in milliseconds */
  fadeOutDuration?: number;
}

/**
 * LoadingScreen Component
 *
 * Displays a full-screen loading animation with the $MILAGRE logo.
 * Automatically fades out after a specified duration and calls the completion callback.
 *
 * @example
 * ```tsx
 * <LoadingScreen
 *   onLoadingComplete={() => setIsLoading(false)}
 *   duration={1500}
 *   fadeOutDuration={500}
 * />
 * ```
 *
 * Accessibility features:
 * - ARIA role="status" for screen readers
 * - ARIA live region to announce loading state
 * - Semantic markup
 * - High contrast animations
 *
 * @param props - Component props
 * @returns Loading screen component
 */
const LoadingScreen = memo<LoadingScreenProps>(({
  onLoadingComplete,
  duration = 1500,
  fadeOutDuration = 500
}) => {
  const [isVisible, setIsVisible] = useState(true);

  /**
   * Memoized fade out handler
   */
  const handleFadeOut = useCallback(() => {
    setIsVisible(false);
    // Notify completion after fade out animation
    setTimeout(onLoadingComplete, fadeOutDuration);
  }, [onLoadingComplete, fadeOutDuration]);

  /**
   * Set up loading timer
   * After duration, start fade out
   */
  useEffect(() => {
    const timer = setTimeout(handleFadeOut, duration);
    return () => clearTimeout(timer);
  }, [duration, handleFadeOut]);

  // Don't render if not visible (after fade out completes)
  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Carregando aplicação"
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500"
      style={{
        backgroundColor: 'var(--bg-primary)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo with animated loading circle */}
        <div className="relative">
          {/* Animated loading circle */}
          <svg
            className="absolute inset-0 -m-8"
            width="160"
            height="160"
            viewBox="0 0 160 160"
            aria-hidden="true"
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

          {/* $MILAGRE Logo */}
          <div
            className="relative z-10 flex items-center justify-center w-24 h-24 text-4xl font-black"
            style={{
              color: 'var(--brand-primary)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
            aria-hidden="true"
          >
            $M
          </div>
        </div>

        {/* Loading text */}
        <p
          className="text-sm font-semibold animate-pulse"
          style={{ color: 'var(--text-secondary)' }}
        >
          Carregando...
        </p>
      </div>

      {/* Keyframe animations */}
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
});

// Display name for React DevTools
LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;
