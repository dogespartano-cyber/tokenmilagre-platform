import { useState, useEffect } from 'react';

const STORAGE_KEY = 'manifesto_signers_count';
const INITIAL_COUNT = 147;

export function useManifestoSigners() {
  const [count, setCount] = useState<number>(INITIAL_COUNT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar do localStorage
    const loadCount = () => {
      try {
        const savedCount = localStorage.getItem(STORAGE_KEY);
        if (savedCount) {
          setCount(parseInt(savedCount, 10));
        } else {
          // Primeira vez - salvar o valor inicial
          localStorage.setItem(STORAGE_KEY, INITIAL_COUNT.toString());
          setCount(INITIAL_COUNT);
        }
      } catch (error) {
        console.error('Error loading signers count:', error);
        setCount(INITIAL_COUNT);
      } finally {
        setLoading(false);
      }
    };

    loadCount();

    // Listener para sincronizar entre tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setCount(parseInt(e.newValue, 10));
      }
    };

    // Listener para sincronizar na mesma tab (evento customizado)
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ count: number }>;
      setCount(customEvent.detail.count);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('manifesto-signed', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('manifesto-signed', handleCustomEvent);
    };
  }, []);

  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    try {
      localStorage.setItem(STORAGE_KEY, newCount.toString());
      // Disparar evento customizado para sincronizar na mesma tab
      window.dispatchEvent(new CustomEvent('manifesto-signed', { detail: { count: newCount } }));
    } catch (error) {
      console.error('Error saving signers count:', error);
    }
  };

  return { count, loading, incrementCount };
}
