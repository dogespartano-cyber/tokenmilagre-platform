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
    <div className={`fixed bottom-8 right-8 z-50 hidden lg:block transition-all duration-500 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <button
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
        className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer bg-white dark:bg-emerald-950 border border-gray-200 dark:border-emerald-800 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
      >
        <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5 text-[var(--brand-primary)]" />
      </button>
    </div>
  );
}
