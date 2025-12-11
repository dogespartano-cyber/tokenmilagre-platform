/**
 * Technical Analysis Utility Functions
 */

// Simple Moving Average (SMA)
export const calculateSMA = (data: number[], period: number): (number | null)[] => {
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

// Exponential Moving Average (EMA)
export const calculateEMA = (data: number[], period: number): (number | null)[] => {
    const ema: (number | null)[] = [];
    const multiplier = 2 / (period + 1);

    // First EMA is SMA
    let initialSMA = 0;
    for (let i = 0; i < period; i++) {
        initialSMA += data[i];
    }
    initialSMA /= period;

    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            ema.push(null);
        } else if (i === period - 1) {
            ema.push(initialSMA);
        } else {
            const currentEMA = (data[i] - ema[i - 1]!) * multiplier + ema[i - 1]!;
            ema.push(currentEMA);
        }
    }
    return ema;
};

// Relative Strength Index (RSI)
export const calculateRSI = (data: number[], period: number = 14): (number | null)[] => {
    const rsi: (number | null)[] = [];
    const changes: number[] = [];

    for (let i = 1; i < data.length; i++) {
        changes.push(data[i] - data[i - 1]);
    }

    // Initial Average Gain/Loss
    let avgGain = 0;
    let avgLoss = 0;

    for (let i = 0; i < period; i++) {
        const change = changes[i];
        if (change > 0) avgGain += change;
        else avgLoss += Math.abs(change);
    }

    avgGain /= period;
    avgLoss /= period;

    // First RSI
    if (avgLoss === 0) rsi.push(100);
    else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - 100 / (1 + rs));
    }

    // Fill nulls for initial period
    const result: (number | null)[] = Array(period).fill(null);
    result.push(rsi[0]);

    // Smoothed RSI
    for (let i = period + 1; i < data.length; i++) {
        const change = changes[i - 1];
        let gain = change > 0 ? change : 0;
        let loss = change < 0 ? Math.abs(change) : 0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        if (avgLoss === 0) {
            result.push(100);
        } else {
            const rs = avgGain / avgLoss;
            result.push(100 - 100 / (1 + rs));
        }
    }

    return result;
};

// Moving Average Convergence Divergence (MACD)
export const calculateMACD = (data: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) => {
    const fastEMA = calculateEMA(data, fastPeriod);
    const slowEMA = calculateEMA(data, slowPeriod);
    const macdLine: (number | null)[] = [];

    for (let i = 0; i < data.length; i++) {
        if (fastEMA[i] !== null && slowEMA[i] !== null) {
            macdLine.push(fastEMA[i]! - slowEMA[i]!);
        } else {
            macdLine.push(null);
        }
    }

    // Calculate Signal Line (EMA of MACD Line)
    // Filter out nulls for calculation, then map back
    const validMacdValues = macdLine.filter(v => v !== null) as number[];
    const signalLineValues = calculateEMA(validMacdValues, signalPeriod);

    const signalLine: (number | null)[] = Array(data.length - validMacdValues.length).fill(null).concat(signalLineValues);

    const histogram: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
        if (macdLine[i] !== null && signalLine[i] !== null) {
            histogram.push(macdLine[i]! - signalLine[i]!);
        } else {
            histogram.push(null);
        }
    }

    return { macdLine, signalLine, histogram };
};

// Bollinger Bands
export const calculateBollingerBands = (data: number[], period: number = 20, stdDev: number = 2) => {
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

// Trend Signal Calculation
export type TrendSignal =
    | 'Sobrecomprado - Risco de Correção'
    | 'Preço Elevado - Cautela'
    | 'Neutro - Aguardar Definição'
    | 'Preço Atrativo - Considerar Entrada'
    | 'Sobrevendido - Forte Oportunidade';

export const calculateTrendSignal = (
    closes: number[],
    rsiValues: (number | null)[],
    macdHistogram: (number | null)[],
    sma50: (number | null)[],
    sma200: (number | null)[],
    bollingerBands?: { upper: (number | null)[]; lower: (number | null)[] }
): {
    score: number;
    exactScore: number;
    label: TrendSignal;
    breakdown?: {
        rsiScore: number;
        macdScore: number;
        sma50Score: number;
        sma200Score: number;
        crossScore: number;
        bollingerScore: number;
    }
} => {
    const lastIndex = closes.length - 1;

    if (lastIndex < 0) {
        return { score: 0, exactScore: 0, label: 'Neutro - Aguardar Definição' };
    }

    const currentPrice = closes[lastIndex];
    const rsi = rsiValues[lastIndex];
    const macdHist = macdHistogram[lastIndex];
    const sma50Val = sma50[lastIndex];
    const sma200Val = sma200[lastIndex];

    if (rsi === null || macdHist === null || sma50Val === null || sma200Val === null) {
        return { score: 0, exactScore: 0, label: 'Neutro - Aguardar Definição' };
    }

    // RSI Thresholds
    const RSI_OVERSOLD = 30;
    const RSI_LOW = 45;
    const RSI_HIGH = 55;
    const RSI_OVERBOUGHT = 70;

    let rsiScore = 0;
    // INVERTED LOGIC: High RSI (Price High) -> Positive Score
    // Low RSI (Price Low) -> Negative Score
    if (rsi < RSI_OVERSOLD) rsiScore = -2;      // Sobrevendido -> Low Score
    else if (rsi < RSI_LOW) rsiScore = -1;       // Baixo
    else if (rsi > RSI_OVERBOUGHT) rsiScore = 2; // Sobrecomprado -> High Score
    else if (rsi > RSI_HIGH) rsiScore = 1;       // Alto

    let macdScore = 0;
    if (macdHist > 0) macdScore = 1;
    else if (macdHist < 0) macdScore = -1;

    let sma50Score = 0;
    if (currentPrice > sma50Val) sma50Score = 1;
    else sma50Score = -1;

    let sma200Score = 0;
    if (currentPrice > sma200Val) sma200Score = 1;
    else sma200Score = -1;

    let crossScore = 0;
    if (sma50Val > sma200Val) crossScore = 1;
    else crossScore = -1;

    // Bollinger Bands Score: Preço na banda inferior = oportunidade, superior = caro
    let bollingerScore = 0;
    if (bollingerBands) {
        const upperBand = bollingerBands.upper[lastIndex];
        const lowerBand = bollingerBands.lower[lastIndex];
        if (upperBand !== null && lowerBand !== null) {
            if (currentPrice <= lowerBand) bollingerScore = -1;      // Banda inferior = oportunidade
            else if (currentPrice >= upperBand) bollingerScore = 1;  // Banda superior = caro
        }
    }

    const score = rsiScore + macdScore + sma50Score + sma200Score + crossScore + bollingerScore;

    // Normalize Score (-7 to +7) to Label
    // Range: -7 to -3: Strong Buy (Oversold)
    //        -2 to -1: Buy
    //         0: Neutral
    //         1 to 2: Sell
    //         3 to 7: Strong Sell (Overbought)

    let label: TrendSignal = 'Neutro - Aguardar Definição';
    if (score <= -3) label = 'Sobrevendido - Forte Oportunidade';
    else if (score < 0) label = 'Preço Atrativo - Considerar Entrada';
    else if (score === 0) label = 'Neutro - Aguardar Definição';
    else if (score < 3) label = 'Preço Elevado - Cautela';
    else label = 'Sobrecomprado - Risco de Correção';

    // Calculate Exact Score for Gauge (Smoother)
    // RSI: Continuous - Low RSI (30) -> -2. High RSI (70) -> +2.
    const rsiExact = (rsi - 50) / 10;

    const exactScore = rsiExact + macdScore + sma50Score + sma200Score + crossScore + bollingerScore;

    return {
        score,
        exactScore,
        label,
        breakdown: {
            rsiScore,
            macdScore,
            sma50Score,
            sma200Score,
            crossScore,
            bollingerScore
        }
    };
};
