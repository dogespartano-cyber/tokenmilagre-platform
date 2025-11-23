'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useThrottle } from '@/hooks/useThrottle';
import { SCROLL_TOP_THRESHOLD, SCROLL_THROTTLE_MS } from '@/lib/constants';

export default function ScrollToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Throttled scroll handler - improves performance (100x less calls)
  const handleScroll = useThrottle(() => {
    setShowScrollTop(window.scrollY > SCROLL_TOP_THRESHOLD);
  }, SCROLL_THROTTLE_MS);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (!showScrollTop) return null;

  return (
    <>
      <style jsx>{`
        .neumorphic-scroll-button {
          background: var(--bg-elevated);
          box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1), -5px -5px 10px rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .neumorphic-scroll-button:active {
          box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.15), inset -5px -5px 10px rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .neumorphic-scroll-button {
          background: #1a1b1e;
          box-shadow: 5px 5px 10px #0d0e0f, -5px -5px 10px #27282d;
        }

        [data-theme="dark"] .neumorphic-scroll-button:active {
          box-shadow: inset 5px 5px 10px #0d0e0f, inset -5px -5px 10px #27282d;
        }
      `}</style>
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 neumorphic-scroll-button ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Voltar ao topo"
      >
        <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
      </button>
    </>
  );
}
