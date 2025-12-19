'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { createChart, ColorType, ISeriesApi, IChartApi, CandlestickSeries, LineSeries, Time } from 'lightweight-charts';
import { useTheme } from '@/lib/core/theme';
import { useBinanceContext } from '@/contexts/BinanceDataContext';
import { calculateSMA, calculateRSI, calculateBollingerBands } from '@/lib/shared/utils/technical-analysis';

type Timeframe = '15m' | '4h' | '1d' | '1w' | '1M';

interface AdvancedChartProps {
  symbol: string;
  name?: string;
  timeframe?: Timeframe;
  onTimeframeChange?: (timeframe: Timeframe) => void;
  trendColor?: string;
  headerLeft?: React.ReactNode;
}

export default function AdvancedChart({ symbol, name, timeframe: controlledTimeframe, onTimeframeChange, trendColor, headerLeft }: AdvancedChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const timeframe = controlledTimeframe || '4h';
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const seriesRefs = useRef<{
    sma20: ISeriesApi<'Line'> | null;
    sma50: ISeriesApi<'Line'> | null;
    sma200: ISeriesApi<'Line'> | null;
    rsi: ISeriesApi<'Line'> | null;
    bbUpper: ISeriesApi<'Line'> | null;
    bbMiddle: ISeriesApi<'Line'> | null;
    bbLower: ISeriesApi<'Line'> | null;
  }>({
    sma20: null,
    sma50: null,
    sma200: null,
    rsi: null,
    bbUpper: null,
    bbMiddle: null,
    bbLower: null,
  });

  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [chartReady, setChartReady] = useState(false);
  const { theme } = useTheme();

  // Get data from shared context
  const { data: binanceData, loading } = useBinanceContext();

  // Memoize chart data transformation
  const chartData = useMemo(() => {
    if (!binanceData || binanceData.length === 0) return null;

    const candleData = binanceData.map((candle) => ({
      time: candle.time as Time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    const closes = binanceData.map((d) => d.close);

    // Calculate indicators
    const sma20Data = calculateSMA(closes, 20).map((value, index) => ({
      time: candleData[index].time,
      value,
    })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

    const sma50Data = calculateSMA(closes, 50).map((value, index) => ({
      time: candleData[index].time,
      value,
    })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

    const sma200Data = calculateSMA(closes, 200).map((value, index) => ({
      time: candleData[index].time,
      value,
    })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

    const rsiData = calculateRSI(closes, 14).map((value, index) => ({
      time: candleData[index].time,
      value,
    })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

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

    return {
      candleData,
      sma20Data,
      sma50Data,
      sma200Data,
      rsiData,
      bbUpperData,
      bbMiddleData,
      bbLowerData,
      lastPrice: candleData[candleData.length - 1]?.close || null,
    };
  }, [binanceData]);

  // Update current price when data changes
  useEffect(() => {
    if (chartData?.lastPrice) {
      setCurrentPrice(chartData.lastPrice);
    }
  }, [chartData]);

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

  // Update chart data when context data changes
  useEffect(() => {
    if (!chartReady) return;
    if (!chartData) return;
    if (!candlestickSeriesRef.current) return;

    candlestickSeriesRef.current.setData(chartData.candleData);
    seriesRefs.current.sma20?.setData(chartData.sma20Data);
    seriesRefs.current.sma50?.setData(chartData.sma50Data);
    seriesRefs.current.sma200?.setData(chartData.sma200Data);
    seriesRefs.current.rsi?.setData(chartData.rsiData);
    seriesRefs.current.bbUpper?.setData(chartData.bbUpperData);
    seriesRefs.current.bbMiddle?.setData(chartData.bbMiddleData);
    seriesRefs.current.bbLower?.setData(chartData.bbLowerData);
  }, [chartReady, chartData]);

  // Create chart on mount
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Cores explícitas baseadas no tema para garantir legibilidade
    const isDark = theme === 'dark';
    const textColor = isDark ? '#E5E7EB' : '#111827'; // Gray-200 (Dark) vs Gray-900 (Light)

    // Criar gráfico principal com fundo transparente
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: textColor,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      autoSize: true, // Enable autoSize
      timeScale: {
        borderColor: 'transparent', // Ocultar linha
        borderVisible: false,       // Garantir que não apareça
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 12,
      },
      rightPriceScale: {
        borderColor: 'transparent', // Ocultar linha
        borderVisible: false,       // Garantir que não apareça
      },
      crosshair: {
        vertLine: {
          color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          width: 1,
          style: 1,
          labelBackgroundColor: isDark ? '#374151' : '#E5E7EB',
        },
        horzLine: {
          color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          width: 1,
          style: 1,
          labelBackgroundColor: isDark ? '#374151' : '#E5E7EB',
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

    // SMA 200 (Roxo)
    const sma200Series = chart.addSeries(LineSeries, {
      color: '#8B5CF6',
      lineWidth: 2,
      title: 'SMA 200',
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

    // Store series references for data updates from context
    seriesRefs.current = {
      sma20: sma20Series,
      sma50: sma50Series,
      sma200: sma200Series,
      rsi: rsiSeries,
      bbUpper: bbUpperSeries,
      bbMiddle: bbMiddleSeries,
      bbLower: bbLowerSeries,
    };

    // Signal that chart is ready for data
    setChartReady(true);

    // Responsivo com ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !entries[0].target) return;

      const newRect = entries[0].contentRect;
      chart.applyOptions({ width: newRect.width });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      setChartReady(false);
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []); // Create chart only once on mount

  // Update theme colors without recreating chart
  useEffect(() => {
    if (!chartRef.current) return;

    const isDark = theme === 'dark';
    const textColor = isDark ? '#E5E7EB' : '#111827';

    chartRef.current.applyOptions({
      layout: {
        textColor: textColor,
      },
      crosshair: {
        vertLine: {
          color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          labelBackgroundColor: isDark ? '#374151' : '#E5E7EB',
        },
        horzLine: {
          color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          labelBackgroundColor: isDark ? '#374151' : '#E5E7EB',
        },
      },
    });
  }, [theme]); // Update theme colors without recreation

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'transparent'
      }}
    >
      {/* Header do gráfico - Seletor à esquerda, Preço à direita */}
      <div className="px-2 md:px-4 pt-4 pb-2 flex items-center justify-between">
        {/* Slot para seletor */}
        <div>{headerLeft}</div>

        {/* Preço à direita */}
        {currentPrice && (
          <div className="px-4 py-2 rounded-lg font-bold text-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-medium)',
            color: 'var(--text-primary)'
          }}>
            ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        )}
      </div>

      <div className="px-2 md:px-4 pb-4">
        <div ref={chartContainerRef} />
      </div>

      {/* Legenda compacta - abaixo do gráfico */}
      <div className="px-2 md:px-4 pb-4">
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
            <div className="w-3 h-0.5" style={{ backgroundColor: '#8B5CF6' }}></div>
            <span style={{ color: 'var(--text-secondary)' }}>SMA 200</span>
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
    </div>
  );
}
