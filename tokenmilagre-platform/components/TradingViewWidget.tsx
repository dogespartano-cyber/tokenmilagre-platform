'use client';

import { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  symbolName?: string;
}

function TradingViewWidget({ symbol, symbolName }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'br',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com'
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/30 shadow-xl overflow-hidden" style={{ height: '600px' }}>
      <div className="tradingview-widget-container" ref={containerRef} style={{ height: '100%', width: '100%' }}>
        <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
        <div className="tradingview-widget-copyright" style={{ lineHeight: '32px', fontSize: '13px', textAlign: 'center' }}>
          <a href={`https://br.tradingview.com/symbols/${symbolName || symbol}/`} rel="noopener nofollow" target="_blank" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
            <span>TradingView Chart</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
