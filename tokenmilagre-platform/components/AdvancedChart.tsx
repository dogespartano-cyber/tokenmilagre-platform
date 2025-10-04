'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, CandlestickSeries, LineSeries, Time } from 'lightweight-charts';

interface AdvancedChartProps {
  symbol: string;
  name?: string;
}

type Timeframe = '15m' | '4h' | '1d';

export default function AdvancedChart({ symbol, name }: AdvancedChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('1d');

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const fetchDataAndCalculateIndicators = async (
      symbol: string,
      timeframe: Timeframe,
      series: {
        candlestick: ISeriesApi<'Candlestick'>;
        sma20: ISeriesApi<'Line'>;
        sma50: ISeriesApi<'Line'>;
        bbUpper: ISeriesApi<'Line'>;
        bbMiddle: ISeriesApi<'Line'>;
        bbLower: ISeriesApi<'Line'>;
        rsi: ISeriesApi<'Line'>;
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

        // Bandas de Bollinger
        const bbData = calculateBollingerBands(closes, 20, 2);
        const bbUpperData = bbData.upper.map((value, index) => ({
          time: candleData[index].time,
          value,
        })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

        const bbMiddleData = bbData.middle.map((value, index) => ({
          time: candleData[index].time,
          value,
        })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

        const bbLowerData = bbData.lower.map((value, index) => ({
          time: candleData[index].time,
          value,
        })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

        // RSI
        const rsiData = calculateRSI(closes, 14).map((value, index) => ({
          time: candleData[index].time,
          value,
        })).filter((d) => d.value !== null) as Array<{ time: Time; value: number }>;

        // Aplicar dados aos gráficos
        series.sma20.setData(sma20Data);
        series.sma50.setData(sma50Data);
        series.bbUpper.setData(bbUpperData);
        series.bbMiddle.setData(bbMiddleData);
        series.bbLower.setData(bbLowerData);
        series.rsi.setData(rsiData);

      } catch (error) {
        console.error('Erro ao buscar dados da Binance:', error);
      }
    };

    // Criar gráfico principal com fundo azul claro
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#d2fdff' },
        textColor: '#1e293b',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      timeScale: {
        borderColor: 'rgba(0, 0, 0, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(0, 0, 0, 0.1)',
      },
      crosshair: {
        vertLine: {
          color: 'rgba(0, 0, 0, 0.3)',
          width: 1,
          style: 1,
        },
        horzLine: {
          color: 'rgba(0, 0, 0, 0.3)',
          width: 1,
          style: 1,
        },
      },
    });

    // Série de candlestick
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#4ade80',
      downColor: '#f87171',
      borderUpColor: '#4ade80',
      borderDownColor: '#f87171',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // SMA 20 (amarelo)
    const sma20Series = chart.addSeries(LineSeries, {
      color: '#eab308',
      lineWidth: 2,
      title: 'SMA 20',
    });

    // SMA 50 (laranja)
    const sma50Series = chart.addSeries(LineSeries, {
      color: '#f97316',
      lineWidth: 2,
      title: 'SMA 50',
    });

    // Bandas de Bollinger - Banda Superior (azul claro)
    const bbUpperSeries = chart.addSeries(LineSeries, {
      color: '#60a5fa',
      lineWidth: 1,
      lineStyle: 2, // Dashed
      title: 'BB Upper',
    });

    // Bandas de Bollinger - Média (azul)
    const bbMiddleSeries = chart.addSeries(LineSeries, {
      color: '#3b82f6',
      lineWidth: 2,
      title: 'BB Middle',
    });

    // Bandas de Bollinger - Banda Inferior (azul escuro)
    const bbLowerSeries = chart.addSeries(LineSeries, {
      color: '#1e40af',
      lineWidth: 1,
      lineStyle: 2, // Dashed
      title: 'BB Lower',
    });

    // RSI - em painel separado
    const rsiSeries = chart.addSeries(LineSeries, {
      color: '#8b5cf6',
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
      bbUpper: bbUpperSeries,
      bbMiddle: bbMiddleSeries,
      bbLower: bbLowerSeries,
      rsi: rsiSeries,
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
  }, [symbol, timeframe]);

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
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-yellow-400/40 shadow-xl overflow-hidden">
      {name && (
        <div className="px-4 pt-4 pb-2 flex items-center justify-between bg-gradient-to-r from-yellow-400/10 to-amber-400/10">
          <div>
            <h4 className="text-white font-bold text-xl">{name}</h4>
            <p className="text-white/70 text-sm mt-1">
              📊 SMA 20/50 • 📈 Bandas de Bollinger • 📉 RSI
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['15m', '4h', '1d'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-yellow-400/30 text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="p-4 pt-2">
        <div ref={chartContainerRef} />

        {/* Legenda dos Indicadores */}
        <div className="mt-3 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-yellow-500"></div>
            <span className="text-white/70">SMA 20</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-orange-500"></div>
            <span className="text-white/70">SMA 50</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-400"></div>
            <span className="text-white/70">BB Upper</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-600"></div>
            <span className="text-white/70">BB Middle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-900"></div>
            <span className="text-white/70">BB Lower</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-purple-500"></div>
            <span className="text-white/70">RSI (painel inferior)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
