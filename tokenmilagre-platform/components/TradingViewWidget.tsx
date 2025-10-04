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

    // Limpa conteúdo anterior
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "br",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      save_image: false,
      backgroundColor: "rgba(0, 0, 0, 0)",
      gridColor: "rgba(255, 255, 255, 0.06)"
    });

    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/30 shadow-xl overflow-hidden">
      <div
        className="tradingview-widget-container"
        ref={container}
        style={{ height: "500px", width: "100%" }}
      >
        <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
        <div className="tradingview-widget-copyright" style={{ fontSize: "13px", lineHeight: "32px", textAlign: "center", verticalAlign: "middle", padding: "0 10px" }}>
          <a href={`https://br.tradingview.com/symbols/${symbolName || symbol}/`} rel="noopener nofollow" target="_blank">
            <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>📈 TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
