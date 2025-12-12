'use client';

import { useEffect, useRef, memo } from 'react';
import { useTheme } from '@/lib/core/theme';

function CryptoHeatmapWidget() {
  const container = useRef<HTMLDivElement>(null);
  const { theme, mounted } = useTheme();

  useEffect(() => {
    if (!container.current || !mounted) return;

    // Limpa conteúdo anterior
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      dataSource: "Crypto",
      blockSize: "market_cap_calc",
      blockColor: "change",
      locale: "br",
      symbolUrl: "",
      colorTheme: theme === 'dark' ? 'dark' : 'light',
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
  }, [theme, mounted]);

  return (
    <div
      className="backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border bg-[var(--bg-elevated)] border-[var(--border-light)]"
      style={{ height: "100%" }}
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

export default memo(CryptoHeatmapWidget);
