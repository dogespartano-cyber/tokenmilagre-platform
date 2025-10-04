'use client';

import { useEffect, useRef, memo } from 'react';

interface TechnicalAnalysisWidgetProps {
  symbol?: string;
}

function TechnicalAnalysisWidget({ symbol = "BINANCE:BTCUSDT" }: TechnicalAnalysisWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Limpa conteúdo anterior
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: "1m",
      width: "100%",
      isTransparent: false,
      height: "100%",
      symbol: symbol,
      showIntervalTabs: true,
      displayMode: "single",
      locale: "br",
      colorTheme: "dark"
    });

    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/30 shadow-xl overflow-hidden" style={{ height: "500px" }}>
      <div
        className="tradingview-widget-container"
        ref={container}
        style={{ height: "100%", width: "100%" }}
      >
        <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
      </div>
    </div>
  );
}

export default memo(TechnicalAnalysisWidget);
