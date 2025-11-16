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
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{
        backgroundColor: 'var(--brand-primary)',
        color: 'var(--text-inverse)'
      }}
      aria-label="Voltar ao topo"
    >
      <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
    </button>
  );
}
