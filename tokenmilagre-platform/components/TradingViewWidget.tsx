'use client';

import { useEffect, useRef, memo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface TradingViewWidgetProps {
  symbol: string;
  symbolName?: string;
}

function TradingViewWidget({ symbol, symbolName }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isDark = theme === 'dark';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: isDark ? 'dark' : 'light',
      style: '1',
      locale: 'br',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      // Cores customizadas
      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.8)',
      gridColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
      studies_overrides: {
        'volume.volume.color.0': '#ef4444', // Volume vermelho (baixa)
        'volume.volume.color.1': '#22c55e', // Volume verde (alta)
      },
      overrides: {
        // Fundo do gráfico
        'paneProperties.background': isDark ? '#0f172a' : '#ffffff',
        'paneProperties.backgroundType': 'solid',

        // Grid
        'paneProperties.vertGridProperties.color': isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
        'paneProperties.horzGridProperties.color': isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',

        // Velas de alta (verde/amarelo)
        'mainSeriesProperties.candleStyle.upColor': '#eab308',
        'mainSeriesProperties.candleStyle.borderUpColor': '#facc15',
        'mainSeriesProperties.candleStyle.wickUpColor': '#facc15',

        // Velas de baixa (vermelho/laranja)
        'mainSeriesProperties.candleStyle.downColor': '#f97316',
        'mainSeriesProperties.candleStyle.borderDownColor': '#fb923c',
        'mainSeriesProperties.candleStyle.wickDownColor': '#fb923c',
      }
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [symbol, theme]);

  return (
    <div className="backdrop-blur-lg rounded-2xl border-2 shadow-xl overflow-hidden" style={{
      height: '600px',
      backgroundColor: 'var(--bg-elevated)',
      borderColor: 'var(--border-light)'
    }}>
      <div className="tradingview-widget-container" ref={containerRef} style={{ height: '100%', width: '100%' }}>
        <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
        <div className="tradingview-widget-copyright" style={{
          lineHeight: '32px',
          fontSize: '13px',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          <a href={`https://br.tradingview.com/symbols/${symbolName || symbol}/`} rel="noopener nofollow" target="_blank" style={{
            color: 'var(--text-muted)',
            textDecoration: 'none'
          }}>
            <span>TradingView Chart</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
