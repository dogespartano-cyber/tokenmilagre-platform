'use client';

import { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  symbolName?: string;
}

function TradingViewWidget({ symbol, symbolName }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: "W",
      locale: "br",
      save_image: true,
      style: "1",
      symbol: symbol,
      theme: "dark",
      timezone: "Etc/UTC",
      backgroundColor: "rgba(0, 0, 0, 0)",
      gridColor: "rgba(255, 255, 255, 0.06)",
      watchlist: [],
      withdateranges: false,
      compareSymbols: [],
      studies: [],
      autosize: true
    });

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div
      className="tradingview-widget-container bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/30 shadow-xl overflow-hidden"
      ref={container}
      style={{ height: "610px", width: "100%" }}
    >
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright p-2 text-center">
        <a
          href={`https://br.tradingview.com/symbols/${symbolName || symbol}/?exchange=BINANCE`}
          rel="noopener nofollow"
          target="_blank"
          className="text-white/60 hover:text-white/80 text-xs transition"
        >
          <span>📈 TradingView - {symbolName || symbol}</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
