'use client';

import { useEffect, useRef, memo, useState } from 'react';

function TickerTapeWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Detectar tema atual
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'dark' : 'light');

    // Observar mudanças no tema
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          description: 'Bitcoin',
          proName: 'BINANCE:BTCUSDT'
        },
        {
          description: 'Ethereum',
          proName: 'BINANCE:ETHUSDT'
        },
        {
          description: 'Solana',
          proName: 'BINANCE:SOLUSDT'
        }
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: theme,
      locale: 'br'
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [theme]);

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget" ref={containerRef}></div>
    </div>
  );
}

export default memo(TickerTapeWidget);
