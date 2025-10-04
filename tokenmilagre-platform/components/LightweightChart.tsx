'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, CandlestickSeries, HistogramSeries, Time } from 'lightweight-charts';

interface LightweightChartProps {
  symbol: string; // Ex: BTCUSDT, ETHUSDT, SOLUSDT
  name?: string; // Nome do ativo (ex: "Bitcoin", "Ethereum")
}

type Timeframe = '15m' | '4h' | '1d';

export default function LightweightChart({ symbol, name }: LightweightChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('1d');

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Criar gráfico com fundo azul claro sem grade
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

    // Série de candlestick verde/vermelho pastel escuro
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#4ade80', // Verde pastel escuro (alta)
      downColor: '#f87171', // Vermelho pastel escuro (baixa)
      borderUpColor: '#4ade80', // Mesma cor do corpo
      borderDownColor: '#f87171', // Mesma cor do corpo
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
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
  }, [symbol, timeframe]);

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

      // Definir limite de candles baseado no timeframe
      const limitMap = {
        '15m': 96,  // 24 horas (96 velas de 15min)
        '4h': 168,  // 4 semanas (168 velas de 4h)
        '1d': 100,  // 100 dias
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
          color: close >= open ? '#4ade8080' : '#f8717180', // Verde/vermelho pastel escuro com transparência
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
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h4 className="text-white font-bold text-lg">{name}</h4>

          {/* Timeframe Selector */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['15m', '4h', '1d'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
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
