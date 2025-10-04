'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi, CandlestickSeries, HistogramSeries, Time } from 'lightweight-charts';

interface LightweightChartProps {
  symbol: string; // Ex: BTCUSDT, ETHUSDT, SOLUSDT
  name?: string; // Nome do ativo (ex: "Bitcoin", "Ethereum")
}

export default function LightweightChart({ symbol, name }: LightweightChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Criar gráfico com fundo azul claro
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#d2fdff' },
        textColor: '#1e293b',
      },
      grid: {
        vertLines: { color: 'rgba(0, 0, 0, 0.06)' },
        horzLines: { color: 'rgba(0, 0, 0, 0.06)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
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

    // Série de candlestick verde/vermelho tradicional
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e', // Verde (alta)
      downColor: '#ef4444', // Vermelho (baixa)
      borderUpColor: '#16a34a',
      borderDownColor: '#dc2626',
      wickUpColor: '#16a34a',
      wickDownColor: '#dc2626',
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
    fetchBinanceData(symbol, candlestickSeries, volumeSeries);

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
    candlestickSeries: ISeriesApi<'Candlestick'>,
    volumeSeries: ISeriesApi<'Histogram'>
  ) => {
    try {
      // Binance API - Klines (candlestick) - últimos 100 dias
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=100`
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
          color: close >= open ? '#22c55e80' : '#ef444480', // Verde/vermelho com transparência
        };
      });

      candlestickSeries.setData(formattedData);
      volumeSeries.setData(volumeData);
    } catch (error) {
      console.error('Erro ao buscar dados da Binance:', error);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/30 shadow-xl overflow-hidden">
      {name && (
        <div className="px-4 pt-4 pb-2">
          <h4 className="text-white font-bold text-lg">{name}</h4>
        </div>
      )}
      <div className="p-4 pt-0">
        <div ref={chartContainerRef} />
      </div>
    </div>
  );
}
