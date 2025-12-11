'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, CandlestickSeries, LineSeries, Time } from 'lightweight-charts';
import { useTheme } from '@/contexts/ThemeContext';
import { calculateSMA, calculateRSI, calculateBollingerBands } from '@/lib/shared/utils/technical-analysis';

type Timeframe = '15m' | '4h' | '1d' | '1w' | '1M';

interface AdvancedChartProps {
  symbol: string;
  name: string;
  timeframe?: Timeframe;
  onTimeframeChange?: (timeframe: Timeframe) => void;
  trendColor?: string;
}

export default function AdvancedChart({ symbol, name, timeframe: controlledTimeframe, onTimeframeChange, trendColor }: AdvancedChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [internalTimeframe, setInternalTimeframe] = useState<Timeframe>('4h');
  const timeframe = controlledTimeframe || internalTimeframe;
  const chartRef = useRef<any>(null); // Ref to hold chart instance
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const handleTimeframeChange = (newTimeframe: Timeframe) => {
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe);
    } else {
      setInternalTimeframe(newTimeframe);
    }
  };

  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const { theme } = useTheme();

  // Apply trend color updates
  useEffect(() => {
    if (candlestickSeriesRef.current && trendColor) {
      candlestickSeriesRef.current.applyOptions({
        upColor: 'transparent',
        borderUpColor: trendColor,
        wickUpColor: trendColor,
        downColor: trendColor,
        borderDownColor: trendColor,
        wickDownColor: trendColor,
      });
    } else if (candlestickSeriesRef.current && !trendColor) {
      // Default Style (Gray almost white)
      candlestickSeriesRef.current.applyOptions({
        upColor: 'transparent',
        downColor: '#E5E7EB',
        borderUpColor: '#E5E7EB',
        borderDownColor: '#E5E7EB',
        wickUpColor: '#E5E7EB',
        wickDownColor: '#E5E7EB',
      });
    }
  }, [trendColor]);

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
        const intervalMap: Record<Timeframe, string> = {
          '15m': '15m',
          '4h': '4h',
          '1d': '1d',
          '1w': '1w',
          '1M': '1M',
        };

        const limitMap: Record<Timeframe, number> = {
          '15m': 500,  // ~5 dias (500 velas de 15min)
          '4h': 500,   // ~83 dias (500 velas de 4h)
          '1d': 500,   // 500 dias (~1.4 anos)
          '1w': 200,   // ~4 anos (200 velas semanais)
          '1M': 100,   // ~8 anos (100 velas mensais)
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

        // Atualizar preço atual (último candle)
        if (candleData.length > 0) {
          const lastCandle = candleData[candleData.length - 1];
          setCurrentPrice(lastCandle.close);
        }

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
      autoSize: true, // Enable autoSize
      timeScale: {
        borderColor: borderColor || 'rgba(255, 255, 255, 0.2)',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 12,
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

    chartRef.current = chart;

    // Série de candlestick
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: 'transparent',        // Vermelho para Alta (Default) - AGORA TRANSPARENTE
      downColor: 'transparent',      // Verde para Queda (Default) - AGORA TRANSPARENTE
      borderUpColor: '#EF5350',
      borderDownColor: '#26A69A',
      wickUpColor: '#EF5350',
      wickDownColor: '#26A69A',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Apply initial trend color if exists
    if (trendColor) {
      candlestickSeries.applyOptions({
        upColor: 'transparent',
        borderUpColor: trendColor,
        wickUpColor: trendColor,
        downColor: trendColor,
        borderDownColor: trendColor,
        wickDownColor: trendColor,
      });
    }

    // SMA 20 (Amarelo)
    const sma20Series = chart.addSeries(LineSeries, {
      color: '#EAB308',
      lineWidth: 3,
      title: 'SMA 20',
    });

    // SMA 50 (Azul Real)
    const sma50Series = chart.addSeries(LineSeries, {
      color: '#3B82F6',
      lineWidth: 3,
      title: 'SMA 50',
    });

    // Bandas de Bollinger (Cinza/Slate - Sutil)
    const bbUpperSeries = chart.addSeries(LineSeries, {
      color: '#94A3B8',
      lineWidth: 2,
      lineStyle: 2, // Linha tracejada
      title: 'BB Superior',
    });

    const bbMiddleSeries = chart.addSeries(LineSeries, {
      color: '#94A3B8',
      lineWidth: 1,
      lineStyle: 3, // Linha pontilhada
      title: 'BB Média',
    });

    const bbLowerSeries = chart.addSeries(LineSeries, {
      color: '#94A3B8',
      lineWidth: 2,
      lineStyle: 2, // Linha tracejada
      title: 'BB Inferior',
    });

    // RSI - em painel separado (rosa vibrante)
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

    // Responsivo com ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !entries[0].target) return;

      const newRect = entries[0].contentRect;
      chart.applyOptions({ width: newRect.width });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [symbol, timeframe, theme]);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'transparent',
        opacity: trendColor ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      {/* Título, Preço e Timeframe - Responsivo */}
      <div className="px-4 pt-4 pb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Esquerda: Título + Preço */}
        {name && (
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{name}</h4>
            {currentPrice && (
              <div className="px-3 py-1 rounded-lg font-bold text-lg border" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-medium)',
                color: 'var(--text-primary)'
              }}>
                ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
        )}

        {/* Direita: Timeframe Selector */}
        <div className="flex flex-wrap gap-1 rounded-lg p-1 w-full md:w-auto overflow-x-auto no-scrollbar" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          {['15m', '4h', '1d', '1w', '1M'].map((tf) => {
            const displayLabel: Record<string, string> = {
              '15m': '15M',
              '4h': '4H',
              '1d': '1D',
              '1w': '1S',
              '1M': '1M',
            };
            return (
              <button
                key={tf}
                onClick={() => handleTimeframeChange(tf as Timeframe)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === tf
                  ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                {displayLabel[tf]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legenda compacta */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5" style={{ backgroundColor: '#EAB308' }}></div>
            <span style={{ color: 'var(--text-secondary)' }}>SMA 20</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5" style={{ backgroundColor: '#3B82F6' }}></div>
            <span style={{ color: 'var(--text-secondary)' }}>SMA 50</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5" style={{ backgroundColor: '#94A3B8' }}></div>
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
