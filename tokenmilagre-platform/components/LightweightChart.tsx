'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, CandlestickSeries, HistogramSeries, Time } from 'lightweight-charts';
import { useTheme } from '@/contexts/ThemeContext';

interface LightweightChartProps {
  symbol: string; // Ex: BTCUSDT, ETHUSDT, SOLUSDT
  name?: string; // Nome do ativo (ex: "Bitcoin", "Ethereum")
}

type Timeframe = '15m' | '4h' | '1d';

export default function LightweightChart({ symbol, name }: LightweightChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('1d');
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Obter cores do tema atual
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-medium').trim();

    // Criar gráfico com fundo transparente sem grade
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: textColor || '#ffffff',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        borderColor: borderColor || 'rgba(255, 255, 255, 0.2)',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 12, // Espaço entre último candle e borda direita (aproximadamente 55px)
      },
      rightPriceScale: {
        borderColor: borderColor || 'rgba(255, 255, 255, 0.2)',
      },
      crosshair: {
        vertLine: {
          color: textColor || 'rgba(255, 255, 255, 0.4)',
          width: 1,
          style: 1,
        },
        horzLine: {
          color: textColor || 'rgba(255, 255, 255, 0.4)',
          width: 1,
          style: 1,
        },
      },
    });

    // Série de candlestick verde/vermelho vibrante (visível em ambos os modos)
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',        // Verde mais vibrante (alta)
      downColor: '#ef4444',      // Vermelho mais vibrante (baixa)
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#16a34a',    // Verde médio
      wickDownColor: '#dc2626',  // Vermelho médio
    });

    // Série de volume (histograma)
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#9ca3af',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8, // Volume ocupa 20% inferior
        bottom: 0,
      },
    });

    // Buscar dados da Binance
    fetchBinanceData(symbol, timeframe, candlestickSeries, volumeSeries);

    // Responsivo
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol, timeframe, theme]);

  const fetchBinanceData = async (
    symbol: string,
    timeframe: Timeframe,
    candlestickSeries: ISeriesApi<'Candlestick'>,
    volumeSeries: ISeriesApi<'Histogram'>
  ) => {
    try {
      // Mapear timeframe para intervalo da Binance
      const intervalMap = {
        '15m': '15m',
        '4h': '4h',
        '1d': '1d',
      };

      // Definir limite de candles baseado no timeframe (máximo permitido pela Binance é 1000)
      const limitMap = {
        '15m': 500,  // ~5 dias (500 velas de 15min)
        '4h': 500,   // ~83 dias (500 velas de 4h)
        '1d': 500,   // 500 dias (~1.4 anos)
      };

      const interval = intervalMap[timeframe];
      const limit = limitMap[timeframe];

      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      const data: Array<Array<string | number>> = await response.json();

      // Formatar dados de candlestick
      const formattedData = data.map((candle) => ({
        time: ((candle[0] as number) / 1000) as Time, // Timestamp em segundos
        open: parseFloat(candle[1] as string),
        high: parseFloat(candle[2] as string),
        low: parseFloat(candle[3] as string),
        close: parseFloat(candle[4] as string),
      }));

      // Formatar dados de volume
      const volumeData = data.map((candle) => {
        const close = parseFloat(candle[4] as string);
        const open = parseFloat(candle[1] as string);
        return {
          time: ((candle[0] as number) / 1000) as Time,
          value: parseFloat(candle[5] as string), // Volume
          color: close >= open ? '#22c55e80' : '#ef444480', // Verde/vermelho vibrante com transparência
        };
      });

      candlestickSeries.setData(formattedData);
      volumeSeries.setData(volumeData);
    } catch (error) {
      console.error('Erro ao buscar dados da Binance:', error);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'transparent' }}>
      {name && (
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{name}</h4>

          {/* Timeframe Selector */}
          <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {(['15m', '4h', '1d'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  timeframe === tf ? 'shadow-sm' : ''
                }`}
                style={timeframe === tf ? {
                  backgroundColor: 'var(--brand-bg)',
                  color: 'var(--text-primary)'
                } : {
                  color: 'var(--text-tertiary)'
                }}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="p-4 pt-0">
        <div ref={chartContainerRef} />
      </div>
    </div>
  );
}
