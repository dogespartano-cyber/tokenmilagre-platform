'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useThrottle } from '@/hooks/useThrottle';
import { SCROLL_TOP_THRESHOLD, SCROLL_THROTTLE_MS } from '@/lib/core/constants/ui';

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
      <button
        onClick={scrollToTop}
        className={`glass-card fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full hidden lg:flex items-center justify-center transition-all duration-500 hover:scale-110 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Voltar ao topo"
      >
        <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
      </button>
    </>
  );
}
