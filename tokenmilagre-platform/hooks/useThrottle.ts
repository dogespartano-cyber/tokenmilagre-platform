import { useRef, useCallback } from 'react';

/**
 * Custom hook to throttle function calls
 *
 * @param callback - The function to throttle
 * @param delay - Delay in milliseconds (default: 100ms)
 * @returns Throttled function
 *
 * @example
 * const handleScroll = useThrottle(() => {
 *   setShowButton(window.scrollY > 400);
 * }, 100);
 *
 * useEffect(() => {
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, [handleScroll]);
 */
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 100
): T {
  const lastRan = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledFunction = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRan.current >= delay) {
        // Execute immediately if enough time has passed
        callback(...args);
        lastRan.current = now;
      } else {
        // Schedule execution for later
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastRan.current = Date.now();
        }, delay - (now - lastRan.current));
      }
    },
    [callback, delay]
  ) as T;

  return throttledFunction;
}
