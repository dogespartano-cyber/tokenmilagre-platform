'use client';

import { useBinanceContext } from '@/contexts/BinanceDataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

interface TrendMeterProps {
    symbol: string;
    interval?: string;
    onColorChange?: (color: string) => void;
}

export default function TrendMeter({ symbol, interval = '4h', onColorChange }: TrendMeterProps) {
    // Using shared context instead of separate fetch
    const { indicators, loading, error } = useBinanceContext();
    const [gaugeValue, setGaugeValue] = useState(50); // 0 to 100
    const [displayScore, setDisplayScore] = useState(0);

    const getTrendColor = (score: number) => {
        // Mode: Mean Reversion / RSI Logic
        // High Score (Price Up) -> Tech Overbought -> Red (Sell Risk)
        // Low Score (Price Down) -> Tech Oversold -> Green (Buy Opportunity)

        if (score >= 3) return '#EF4444'; // Red-500 (Strong Sell)
        if (score > 0) return '#F97316';  // Orange-500 (Sell)
        if (score === 0) return '#EAB308'; // Yellow-500 (Neutral)
        if (score > -3) return '#84CC16'; // Lime-500 (Buy)
        return '#22C55E'; // Green-500 (Strong Buy)
    };

    // Handle data updates
    useEffect(() => {
        if (indicators && indicators.trend) {
            // Map score (-6 to +6) to gauge value (0 to 100)
            const score = indicators.trend.score;
            const exactScore = indicators.trend.exactScore;

            // Use exactScore for smoother gauge movement
            // Normal Logic: -6 (Left) to +6 (Right)
            let targetValue = (exactScore + 6) * (100 / 12);
            targetValue = Math.max(0, Math.min(100, targetValue));

            setGaugeValue(targetValue);
            setDisplayScore(exactScore);

            if (onColorChange) {
                onColorChange(getTrendColor(exactScore));
            }
        } else if (!loading && (error || !indicators)) {
            // If finished loading but error or no data, emit default neutral color
            // to ensure chart becomes visible (in default gray state)
            if (onColorChange) {
                // Using a neutral gray or simply letting the chart use its default
                // passing a color is required to un-hide the chart if strictly using opacity toggle based on presence
                // But we want it to look "default".
                // Let's pass a specific GRAY to signal "ready but neutral"
                onColorChange('#E5E7EB');
            }
        }
    }, [indicators, loading, error, onColorChange]);

    if (loading) {
        return (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-gray-400 gap-3">
                <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-blue-500" />
                <span className="text-sm font-medium animate-pulse">Analisando mercado...</span>
            </div>
        );
    }

    if (error || !indicators) {
        return (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-red-400 gap-3">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl" />
                <span className="text-sm text-center px-4">Não foi possível carregar os dados para {symbol}</span>
            </div>
        );
    }

    const { trend, rsi, macd, sma50, sma200 } = indicators;

    // Gauge Configuration
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const arcLength = circumference / 2; // Semi-circle

    // Needle Rotation
    // 0 value -> -90deg
    // 50 value -> 0deg
    // 100 value -> 90deg
    const needleRotation = (gaugeValue / 100) * 180 - 90;

    const trendColor = getTrendColor(displayScore);

    return (
        <div className="flex flex-col h-full w-full items-center justify-center p-1">
            {/* Gauge Graphic */}
            <div className="relative flex items-center justify-center py-6 w-full">
                <svg
                    viewBox="-30 0 260 125"
                    className="w-full px-2 overflow-visible drop-shadow-xl"
                >
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22C55E" />   {/* Strong Buy / Low Price */}
                            <stop offset="25%" stopColor="#84CC16" />  {/* Buy */}
                            <stop offset="50%" stopColor="#EAB308" />  {/* Neutral */}
                            <stop offset="75%" stopColor="#F97316" />  {/* Sell */}
                            <stop offset="100%" stopColor="#EF4444" /> {/* Strong Sell / High Price */}
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Background Arc */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                    />

                    {/* Colored Arc */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        filter="url(#glow)"
                    />

                    {/* Ticks */}
                    {[0, 25, 50, 75, 100].map((tick) => {
                        const angle = (tick / 100) * 180 - 180;
                        const rad = (angle * Math.PI) / 180;
                        const innerR = 65;
                        const outerR = 75;
                        const x1 = 100 + innerR * Math.cos(rad);
                        const y1 = 100 + innerR * Math.sin(rad);
                        const x2 = 100 + outerR * Math.cos(rad);
                        const y2 = 100 + outerR * Math.sin(rad);
                        return (
                            <line
                                key={tick}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="2"
                            />
                        );
                    })}

                    {/* Labels */}
                    <text x="20" y="115" fill="#22C55E" fontSize="10" fontWeight="bold" textAnchor="middle">Sobrevendido</text>
                    <text x="100" y="115" fill="#EAB308" fontSize="10" fontWeight="bold" textAnchor="middle">Neutro</text>
                    <text x="180" y="115" fill="#EF4444" fontSize="10" fontWeight="bold" textAnchor="middle">Sobrecomprado</text>

                    {/* Needle */}
                    <g
                        transform={`translate(100, 100) rotate(${needleRotation})`}
                        className="transition-transform duration-1000 ease-out"
                    >
                        <path
                            d="M -4 0 L 0 -75 L 4 0 Z"
                            fill={trendColor}
                        />
                        <circle r="6" fill="#1F2937" stroke={trendColor} strokeWidth="2" />
                    </g>

                    {/* Score Text */}
                    <text
                        x="100"
                        y="70"
                        fill={trendColor}
                        fontSize="24"
                        fontWeight="900"
                        textAnchor="middle"
                    >
                        {displayScore > 0 ? `+${displayScore.toFixed(2)}` : displayScore.toFixed(2)}
                    </text>
                </svg>
            </div>

            {/* Trend Label */}
            <div className="text-center mb-6">
                <div className="inline-block px-6 py-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                    <span className="text-base font-bold" style={{ color: trendColor }}>
                        {trend.label}
                    </span>
                </div>
            </div>

            {/* Legenda Educativa */}
            <div className="text-center mb-6 px-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {displayScore <= -2 && '🟢 Indicadores sugerem que o preço está baixo. Pode ser uma boa hora para considerar compra.'}
                    {displayScore > -2 && displayScore < 0 && '🟢 Preço levemente abaixo da média. Momento interessante para observar.'}
                    {displayScore >= 0 && displayScore <= 1 && '🟡 Mercado neutro. Aguarde uma melhor definição de tendência.'}
                    {displayScore > 1 && displayScore < 3 && '🟠 Preço acima da média. Cuidado ao entrar agora.'}
                    {displayScore >= 3 && '🔴 Indicadores sugerem preço elevado. Risco de correção no curto prazo.'}
                </p>
            </div>

            {/* Indicators Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-2 w-full mx-auto">
                {/* RSI */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end border-b border-gray-200 dark:border-white/10 pb-2">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-400">RSI (14)</span>
                        <span className={`text-base font-bold ${rsi && rsi > 70 ? 'text-red-500' : rsi && rsi < 30 ? 'text-green-500' : 'text-gray-700 dark:text-gray-300'}`}>
                            {rsi?.toFixed(1)}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700/30 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(0, rsi || 0))}%` }}
                        />
                    </div>
                </div>

                {/* MACD */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end border-b border-gray-200 dark:border-white/10 pb-2">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-400">MACD</span>
                        <div className="flex items-center gap-1">
                            {macd.histogram && macd.histogram > 0 ?
                                <FontAwesomeIcon icon={faArrowUp} className="text-green-500 text-xs" /> :
                                <FontAwesomeIcon icon={faArrowDown} className="text-red-500 text-xs" />
                            }
                            <span className={`text-base font-bold ${macd.histogram && macd.histogram > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {macd.histogram?.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <div className="text-xs font-medium text-gray-500 text-right">Momentum</div>
                </div>

                {/* Moving Averages - Golden Cross / Death Cross */}
                <div className="col-span-2 flex justify-between items-center pt-4 border-t border-gray-200 dark:border-white/5">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-400">Médias Móveis</span>
                    <div className="flex gap-8">
                        {/* Golden Cross: SMA50 > SMA200 = bullish (verde) */}
                        {/* Death Cross: SMA50 < SMA200 = bearish (vermelho) */}
                        {(() => {
                            const isGoldenCross = sma50 && sma200 && sma50 > sma200;
                            const crossLabel = isGoldenCross ? 'Golden Cross' : 'Death Cross';
                            const crossColor = isGoldenCross ? 'bg-green-500' : 'bg-red-500';
                            const textColor = isGoldenCross ? 'text-green-500' : 'text-red-500';
                            return (
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${crossColor}`} />
                                    <span className={`text-sm font-medium ${textColor}`}>{crossLabel}</span>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* Breakdown Details */}
            {trend.breakdown && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/5 px-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4 font-medium">
                        Breakdown dos Indicadores
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <ScoreItem label="RSI" score={trend.breakdown.rsiScore} type="rsi" />
                        <ScoreItem label="MACD" score={trend.breakdown.macdScore} type="macd" />
                        <ScoreItem label="SMA50" score={trend.breakdown.sma50Score} type="sma" />
                        <ScoreItem label="SMA200" score={trend.breakdown.sma200Score} type="sma" />
                        <ScoreItem label="Cross" score={trend.breakdown.crossScore} type="cross" />
                        <ScoreItem label="Bollinger" score={trend.breakdown.bollingerScore} type="bollinger" />
                    </div>
                </div>
            )}
        </div>
    );
}

function ScoreItem({ label, score, type = 'general' }: { label: string, score: number, type?: 'rsi' | 'macd' | 'sma' | 'cross' | 'bollinger' | 'general' }) {
    const getLabel = (s: number, t: string) => {
        if (t === 'rsi') {
            // score negativo = RSI baixo (preço baixo) = oportunidade
            // score positivo = RSI alto (preço alto) = arriscado
            if (s <= -2) return 'Oportunidade'; // RSI < 30 → score -2
            if (s === -1) return 'Barato';      // RSI < 45 → score -1
            if (s === 0) return 'Neutro';
            if (s === 1) return 'Caro';         // RSI > 55 → score +1
            if (s >= 2) return 'Arriscado';     // RSI > 70 → score +2
        }

        if (t === 'macd') {
            if (s > 0) return 'Subindo';
            if (s < 0) return 'Caindo';
            return 'Neutro';
        }

        if (t === 'sma') {
            if (s > 0) return 'Alta';
            if (s < 0) return 'Baixa';
            return 'Neutro';
        }

        if (t === 'cross') {
            if (s > 0) return 'Compra';
            if (s < 0) return 'Venda';
            return 'Neutro';
        }

        if (t === 'bollinger') {
            if (s < 0) return 'Banda ↓';  // Preço na banda inferior = oportunidade
            if (s > 0) return 'Banda ↑';  // Preço na banda superior = caro
            return 'Meio';
        }

        // General fallback
        if (s > 0) return 'Positivo';
        if (s < 0) return 'Negativo';
        return 'Neutro';
    };

    const getColor = (s: number, t: string) => {
        /**
         * DECISÃO DE DESIGN: Cores por Tipo de Indicador
         * ===============================================
         * 
         * Mantemos duas filosofias de cor propositalmente:
         * 
         * 1) RSI/Bollinger → Mean Reversion (Comprar Barato)
         *    - Score negativo = preço baixo = VERDE (oportunidade)
         *    - Score positivo = preço alto = VERMELHO (caro)
         * 
         * 2) SMA/Cross/MACD → Trend Following (Seguir Tendência)
         *    - Score positivo = tendência alta = VERDE (bullish)
         *    - Score negativo = tendência baixa = VERMELHO (bearish)
         * 
         * Esta separação é INTENCIONAL pois cada indicador tem
         * interpretação diferente. Os labels descritivos ajudam
         * o usuário a entender o contexto de cada cor.
         * 
         * Revisado: 2025-12-11
         */

        // RSI e Bollinger: score negativo = bom (verde), score positivo = ruim (vermelho)
        // Porque RSI baixo = preço barato = oportunidade
        if (t === 'rsi' || t === 'bollinger') {
            if (s < 0) return 'text-green-500';  // RSI baixo / Banda inferior = bom
            if (s > 0) return 'text-red-500';    // RSI alto / Banda superior = ruim
            return 'text-gray-500';
        }

        // Outros indicadores: score positivo = bom (verde), score negativo = ruim (vermelho)
        if (s > 0) return 'text-green-500';
        if (s < 0) return 'text-red-500';
        return 'text-gray-500';
    };

    return (
        <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-gray-50/50 dark:bg-white/5">
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
            <span className={`text-xs font-bold ${getColor(score, type)}`}>
                {getLabel(score, type)}
            </span>
        </div>
    );
}
