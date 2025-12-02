
const calculateRSI = (data, period = 14) => {
    const rsi = [];
    const changes = [];

    for (let i = 1; i < data.length; i++) {
        changes.push(data[i] - data[i - 1]);
    }

    let avgGain = 0;
    let avgLoss = 0;

    for (let i = 0; i < period; i++) {
        const change = changes[i];
        if (change > 0) avgGain += change;
        else avgLoss += Math.abs(change);
    }

    avgGain /= period;
    avgLoss /= period;

    if (avgLoss === 0) rsi.push(100);
    else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - 100 / (1 + rs));
    }

    const result = Array(period).fill(null);
    result.push(rsi[0]);

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

// Paste the raw data here (abbreviated for the script, I will read the full files in the real execution if needed, but here I'll just use the last ~200 candles which is enough for RSI)
// Actually I will just read the files I just "read" via the tool output. 
// Since I can't easily pass the huge JSON string here, I will assume the tool output is available to me as a string.
// Wait, I can't access previous tool outputs in this script.
// I will just use the last few closes from the tool output I can see.

const btcCloses = [90850.01, 91903.39, 91602.75]; // Last 3 closes
const ethCloses = [3006.61, 3015.83, 3008.51];
const solCloses = [137.84, 140.25, 139.27];

// Wait, RSI needs 14 periods + smoothing. I need more data.
// I will copy the last 20 closes from the output manually.

const btcData = [87369.96, 87119.92, 87935.05, 87095.79, 86978.00, 89957.36, 90484.02, 91091.68, 91408.34, 91371.88, 90958.30, 91528.21, 91333.95, 91208.85, 90910.87, 91437.64, 92362.49, 91157.44, 90890.70, 90680.26, 90567.67, 90673.19, 91063.50, 90640.78, 90802.44, 90909.35, 90968.16, 91048.78, 91435.31, 91460.79, 90360.00, 86346.13, 86550.30, 86149.15, 84677.87, 85024.50, 86286.01, 86976.99, 87012.65, 87368.92, 90850.01, 91903.39, 91602.75];

const ethData = [2959.36, 2927.20, 2944.52, 2914.00, 2927.41, 3032.28, 3026.56, 3033.53, 3033.90, 3028.54, 3010.97, 3032.02, 3015.23, 3008.63, 3001.91, 3034.02, 3073.77, 3050.00, 3031.15, 3022.60, 3004.90, 2999.82, 3007.41, 2988.47, 2989.16, 3001.69, 3005.22, 3003.36, 3028.69, 3034.71, 2991.26, 2825.77, 2840.21, 2838.35, 2745.72, 2740.80, 2799.07, 2804.55, 2805.65, 2826.18, 3006.61, 3015.83, 3008.51];

const solData = [138.96, 138.15, 139.89, 136.87, 136.66, 143.99, 143.02, 142.52, 143.77, 142.08, 142.15, 142.73, 140.85, 139.68, 138.97, 140.99, 141.61, 137.53, 137.33, 136.83, 137.28, 137.33, 137.58, 135.68, 135.91, 136.40, 136.53, 136.42, 138.33, 137.63, 133.48, 126.97, 127.42, 127.12, 125.11, 123.86, 126.66, 127.23, 127.26, 128.31, 137.84, 140.25, 139.27];

console.log('BTC RSI:', calculateRSI(btcData).pop());
console.log('ETH RSI:', calculateRSI(ethData).pop());
console.log('SOL RSI:', calculateRSI(solData).pop());
