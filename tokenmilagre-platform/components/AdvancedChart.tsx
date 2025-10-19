'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, CandlestickSeries, LineSeries, Time } from 'lightweight-charts';
import { useTheme } from '@/contexts/ThemeContext';

interface AdvancedChartProps {
  symbol: string;
  name?: string;
}

type Timeframe = '15m' | '4h' | '1d';

export default function AdvancedChart({ symbol, name }: AdvancedChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('1d');
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const fetchDataAndCalculateIndicators = async (
      symbol: string,
      timeframe: Timeframe,
      series: {
        candlestick: ISeriesApi<'Candlestick'>;
        sma20: ISeriesApi<'Line'>;
        sma50: ISeriesApi<'Line'>;
        rsi: ISeriesApi<'Line'>;
        bbUpper: ISeriesApi<'Line'>;
        bbMiddle: ISeriesApi<'Line'>;
        bbLower: ISeriesApi<'Line'>;
      }
    ) => {
      try {
        const intervalMap = {
          '15m': '15m',
          '4h': '4h',
          '1d': '1d',
        };

        const limitMap = {
          '15m': 200,
          '4h': 200,
          '1d': 200,
        };

        const interval = intervalMap[timeframe];
        const limit = limitMap[timeframe];

        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
        );
        const data: Array<Array<string | number>> = await response.json();

        // Formatar dados de candlestick
        const candleData = data.map((candle) => ({
          time: ((candle[0] as number) / 1000) as Time,
          open: parseFloat(candle[1] as string),
          high: parseFloat(candle[2] as string),
          low: parseFloat(candle[3] as string),
          close: parseFloat(candle[4] as string),
        }));

        series.candlestick.setData(candleData);

        // Calcular indicadores
        const closes = candleData.map((d) => d.close);

        // SMA 20
        const sma20Data = calculateSMA(closes, 20).map((value, index) => ({
          time: candleData[index].time,
          value,
        })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

        // SMA 50
        const sma50Data = calculateSMA(closes, 50).map((value, index) => ({
          time: candleData[index].time,
          value,
        })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

        // RSI
        const rsiData = calculateRSI(closes, 14).map((value, index) => ({
          time: candleData[index].time,
          value,
        })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

        // Bandas de Bollinger
        const bollingerBands = calculateBollingerBands(closes, 20, 2);
        const bbUpperData = bollingerBands.upper.map((value, index) => ({
          time: candleData[index].time,
          value,
        })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

        const bbMiddleData = bollingerBands.middle.map((value, index) => ({
          time: candleData[index].time,
          value,
        })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

        const bbLowerData = bollingerBands.lower.map((value, index) => ({
          time: candleData[index].time,
          value,
        })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

        // Aplicar dados aos gráficos
        series.sma20.setData(sma20Data);
        series.sma50.setData(sma50Data);
        series.rsi.setData(rsiData);
        series.bbUpper.setData(bbUpperData);
        series.bbMiddle.setData(bbMiddleData);
        series.bbLower.setData(bbLowerData);

      } catch (error) {
        console.error('Erro ao buscar dados da Binance:', error);
      }
    };

    // Obter cor do texto do tema atual
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-medium').trim();

    // Criar gráfico principal com fundo transparente
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
      height: 600,
      timeScale: {
        borderColor: borderColor || 'rgba(255, 255, 255, 0.2)',
        timeVisible: true,
        secondsVisible: false,
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

    // Série de candlestick verde/vermelho forte (visível em ambos os modos)
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',        // Verde mais vibrante
      downColor: '#ef4444',      // Vermelho mais vibrante
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#16a34a',    // Verde médio
      wickDownColor: '#dc2626',  // Vermelho médio
    });

    // SMA 20 (azul vibrante - visível em ambos os modos)
    const sma20Series = chart.addSeries(LineSeries, {
      color: '#3b82f6',
      lineWidth: 3,
      title: 'SMA 20',
    });

    // SMA 50 (laranja forte - visível em ambos os modos)
    const sma50Series = chart.addSeries(LineSeries, {
      color: '#f97316',
      lineWidth: 3,
      title: 'SMA 50',
    });

    // Bandas de Bollinger
    const bbUpperSeries = chart.addSeries(LineSeries, {
      color: '#a855f7',
      lineWidth: 2,
      lineStyle: 2, // Linha tracejada
      title: 'BB Superior',
    });

    const bbMiddleSeries = chart.addSeries(LineSeries, {
      color: '#d946ef',
      lineWidth: 1,
      lineStyle: 3, // Linha pontilhada
      title: 'BB Média',
    });

    const bbLowerSeries = chart.addSeries(LineSeries, {
      color: '#a855f7',
      lineWidth: 2,
      lineStyle: 2, // Linha tracejada
      title: 'BB Inferior',
    });

    // RSI - em painel separado (pink vibrante - visível em ambos)
    const rsiSeries = chart.addSeries(LineSeries, {
      color: '#ec4899',
      lineWidth: 2,
      priceScaleId: 'rsi',
      title: 'RSI',
    });

    rsiSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8, // RSI ocupa 20% inferior
        bottom: 0,
      },
    });

    // Buscar dados da Binance e calcular indicadores
    fetchDataAndCalculateIndicators(symbol, timeframe, {
      candlestick: candlestickSeries,
      sma20: sma20Series,
      sma50: sma50Series,
      rsi: rsiSeries,
      bbUpper: bbUpperSeries,
      bbMiddle: bbMiddleSeries,
      bbLower: bbLowerSeries,
    });

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

  // Calcular SMA (Simple Moving Average)
  const calculateSMA = (data: number[], period: number): (number | null)[] => {
    const sma: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(null);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        sma.push(sum / period);
      }
    }
    return sma;
  };

  // Calcular Bandas de Bollinger
  const calculateBollingerBands = (data: number[], period: number, stdDev: number) => {
    const sma = calculateSMA(data, period);
    const upper: (number | null)[] = [];
    const middle: (number | null)[] = [];
    const lower: (number | null)[] = [];

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        upper.push(null);
        middle.push(null);
        lower.push(null);
      } else {
        const slice = data.slice(i - period + 1, i + 1);
        const mean = sma[i]!;
        const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
        const std = Math.sqrt(variance);

        middle.push(mean);
        upper.push(mean + stdDev * std);
        lower.push(mean - stdDev * std);
      }
    }

    return { upper, middle, lower };
  };

  // Calcular RSI (Relative Strength Index)
  const calculateRSI = (data: number[], period: number): (number | null)[] => {
    const rsi: (number | null)[] = [];
    const changes: number[] = [];

    // Calcular mudanças de preço
    for (let i = 1; i < data.length; i++) {
      changes.push(data[i] - data[i - 1]);
    }

    for (let i = 0; i < data.length; i++) {
      if (i < period) {
        rsi.push(null);
      } else {
        const slice = changes.slice(i - period, i);
        const gains = slice.filter((c) => c > 0).reduce((sum, c) => sum + c, 0) / period;
        const losses = Math.abs(slice.filter((c) => c < 0).reduce((sum, c) => sum + c, 0)) / period;

        if (losses === 0) {
          rsi.push(100);
        } else {
          const rs = gains / losses;
          rsi.push(100 - 100 / (1 + rs));
        }
      }
    }

    return rsi;
  };

  return (
    <div className="backdrop-blur-lg rounded-2xl border-2 shadow-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}>
      {/* Timeframe Selector - Compacto no topo */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          {(['15m', '4h', '1d'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                timeframe === tf ? 'bg-yellow-400/30 shadow-sm' : ''
              }`}
              style={timeframe === tf ? { color: 'var(--text-primary)' } : { color: 'var(--text-tertiary)' }}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Legenda compacta */}
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5" style={{ backgroundColor: '#3b82f6' }}></div>
            <span style={{ color: 'var(--text-secondary)' }}>SMA 20</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5" style={{ backgroundColor: '#f97316' }}></div>
            <span style={{ color: 'var(--text-secondary)' }}>SMA 50</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5" style={{ backgroundColor: '#a855f7' }}></div>
            <span style={{ color: 'var(--text-secondary)' }}>Bollinger</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5" style={{ backgroundColor: '#ec4899' }}></div>
            <span style={{ color: 'var(--text-secondary)' }}>RSI</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div ref={chartContainerRef} />
      </div>
    </div>
  );
}
