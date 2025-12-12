'use client';

import { useEffect, useRef, memo } from 'react';
import { useTheme } from '@/lib/core/theme';

interface TechnicalAnalysisWidgetProps {
  symbol?: string;
}

function TechnicalAnalysisWidget({ symbol = "BINANCE:BTCUSDT" }: TechnicalAnalysisWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const { theme, mounted } = useTheme();

  useEffect(() => {
    if (!container.current || !mounted) return;

    // Limpa conteúdo anterior
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: "4h",
      width: "100%",
      isTransparent: false,
      height: "100%",
      symbol: symbol,
      showIntervalTabs: true,
      displayMode: "single",
      locale: "br",
      colorTheme: theme === 'dark' ? 'dark' : 'light'
    });

    container.current.appendChild(script);
  }, [symbol, theme, mounted]);

  return (
    <div
      className="backdrop-blur-lg rounded-2xl border shadow-xl overflow-hidden max-w-full bg-[var(--bg-elevated)] border-[var(--border-light)]"
      style={{ height: "500px" }}
    >
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
