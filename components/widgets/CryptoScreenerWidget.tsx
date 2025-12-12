'use client';

import { useEffect, useRef, memo } from 'react';
import { useTheme } from '@/lib/core/theme';

function CryptoScreenerWidget() {
  const container = useRef<HTMLDivElement>(null);
  const { theme, mounted } = useTheme();

  useEffect(() => {
    if (!container.current || !mounted) return;

    // Limpa conteúdo anterior
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: theme === 'dark' ? 'dark' : 'light',
      locale: "br",
      isTransparent: false
    });

    container.current.appendChild(script);
  }, [theme, mounted]);

  return (
    <div
      className="backdrop-blur-lg rounded-2xl border shadow-xl overflow-hidden bg-[var(--bg-elevated)] border-[var(--border-light)]"
      style={{ height: "650px" }}
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

export default memo(CryptoScreenerWidget);
