'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi, CandlestickSeries, Time } from 'lightweight-charts';

interface LightweightChartProps {
  symbol: string; // Ex: BTCUSDT, ETHUSDT, SOLUSDT
}

export default function LightweightChart({ symbol }: LightweightChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Criar gráfico com cores customizadas TokenMilagre
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' },
        textColor: 'rgba(255, 255, 255, 0.7)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.06)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.06)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      crosshair: {
        vertLine: {
          color: 'rgba(250, 204, 21, 0.5)',
          width: 1,
          style: 1,
        },
        horzLine: {
          color: 'rgba(250, 204, 21, 0.5)',
          width: 1,
          style: 1,
        },
      },
    });

    // Série de candlestick com cores amarelo/laranja
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#eab308', // Amarelo (alta)
      downColor: '#f97316', // Laranja (baixa)
      borderUpColor: '#facc15',
      borderDownColor: '#fb923c',
      wickUpColor: '#facc15',
      wickDownColor: '#fb923c',
    });

    // Buscar dados da Binance
    fetchBinanceData(symbol, candlestickSeries);

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
  }, [symbol]);

  const fetchBinanceData = async (
    symbol: string,
    candlestickSeries: ISeriesApi<'Candlestick'>
  ) => {
    try {
      // Binance API - Klines (candlestick) - últimos 100 dias
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=100`
      );
      const data: Array<Array<string | number>> = await response.json();

      // Formatar dados para lightweight-charts
      const formattedData = data.map((candle) => ({
        time: ((candle[0] as number) / 1000) as Time, // Timestamp em segundos
        open: parseFloat(candle[1] as string),
        high: parseFloat(candle[2] as string),
        low: parseFloat(candle[3] as string),
        close: parseFloat(candle[4] as string),
      }));

      candlestickSeries.setData(formattedData);
    } catch (error) {
      console.error('Erro ao buscar dados da Binance:', error);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/30 shadow-xl overflow-hidden p-4">
      <div ref={chartContainerRef} />
    </div>
  );
}
