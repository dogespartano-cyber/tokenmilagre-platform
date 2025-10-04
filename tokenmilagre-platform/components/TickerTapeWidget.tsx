'use client';

import { useEffect, useRef, memo } from 'react';

function TickerTapeWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

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
      colorTheme: 'dark',
      locale: 'br'
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget" ref={containerRef}></div>
    </div>
  );
}

export default memo(TickerTapeWidget);
