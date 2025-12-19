'use client';

import { useEffect, useRef, memo } from 'react';

function StockHeatmapWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Limpa conteúdo anterior
    container.current.innerHTML = '';

    // Create the placeholder div required by TradingView script
    const widgetPlaceholder = document.createElement('div');
    widgetPlaceholder.className = 'tradingview-widget-container__widget';
    widgetPlaceholder.style.height = '100%';
    widgetPlaceholder.style.width = '100%';
    container.current.appendChild(widgetPlaceholder);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      exchanges: [],
      dataSource: "SPX500",
      grouping: "sector",
      blockSize: "market_cap_basic",
      blockColor: "change",
      locale: "br",
      symbolUrl: "",
      colorTheme: "dark",
      hasTopBar: false,
      isDataSetEnabled: false,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      width: "100%",
      height: "100%"
    });

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden" style={{
      height: "600px",
      background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))'
    }}>
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

export default memo(StockHeatmapWidget);
