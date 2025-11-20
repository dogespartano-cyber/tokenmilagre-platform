/**
 * Hook for bonding curve calculations
 */

import { useMemo, useState } from 'react';
import { GRADUATION_TARGET } from './useTokenData';

export interface BondingCurvePoint {
  marketCap: number;
  price: number;
  tokens: number;
}

export interface BondingCurveCalculation {
  points: BondingCurvePoint[];
  currentPoint: BondingCurvePoint;
  userSimulation: {
    solAmount: number;
    tokensReceived: number;
    priceImpact: number;
    newMarketCap: number;
    newPrice: number;
  } | null;
}

/**
 * Calculate bonding curve points
 * Simplified bonding curve formula for Pump.fun
 */
function calculateBondingCurve(
  currentMarketCap: number,
  currentPrice: number,
  totalSupply: number
): BondingCurvePoint[] {
  const points: BondingCurvePoint[] = [];
  const steps = 100;
  const maxMarketCap = GRADUATION_TARGET * 1.5; // Show curve beyond graduation

  for (let i = 0; i <= steps; i++) {
    const marketCap = (maxMarketCap / steps) * i;

    // Simplified bonding curve: price = marketCap / totalSupply
    // In reality, Pump.fun uses a more complex formula
    const price = marketCap / totalSupply;
    const tokens = totalSupply * (marketCap / maxMarketCap);

    points.push({ marketCap, price, tokens });
  }

  return points;
}

/**
 * Calculate how many tokens user will receive for X SOL
 */
function calculateTokensFromSOL(
  solAmount: number,
  currentMarketCap: number,
  currentPrice: number,
  solPrice: number = 150 // Assume SOL = $150 (update dynamically if needed)
): {
  tokensReceived: number;
  priceImpact: number;
  newMarketCap: number;
  newPrice: number;
} {
  const usdAmount = solAmount * solPrice;

  // Simplified calculation (in reality, bonding curve is non-linear)
  const tokensReceived = usdAmount / currentPrice;
  const newMarketCap = currentMarketCap + usdAmount;
  const newPrice = currentPrice * (1 + usdAmount / currentMarketCap);
  const priceImpact = ((newPrice - currentPrice) / currentPrice) * 100;

  return {
    tokensReceived,
    priceImpact,
    newMarketCap,
    newPrice,
  };
}

/**
 * Hook for bonding curve calculations
 */
export function useBondingCurve(
  currentMarketCap: number,
  currentPrice: number,
  totalSupply: number = 1_000_000_000
) {
  const [userSOLAmount, setUserSOLAmount] = useState(0.1); // Default 0.1 SOL

  // Calculate bonding curve points (memoized)
  const points = useMemo(() => {
    return calculateBondingCurve(currentMarketCap, currentPrice, totalSupply);
  }, [currentMarketCap, currentPrice, totalSupply]);

  // Find current point on curve
  const currentPoint = useMemo(() => {
    return points.find((p) => p.marketCap >= currentMarketCap) || points[0];
  }, [points, currentMarketCap]);

  // Calculate user simulation
  const userSimulation = useMemo(() => {
    if (userSOLAmount <= 0) return null;

    return {
      solAmount: userSOLAmount,
      ...calculateTokensFromSOL(userSOLAmount, currentMarketCap, currentPrice),
    };
  }, [userSOLAmount, currentMarketCap, currentPrice]);

  return {
    points,
    currentPoint,
    userSimulation,
    setUserSOLAmount,
    graduationTarget: GRADUATION_TARGET,
    progressPercentage: (currentMarketCap / GRADUATION_TARGET) * 100,
  };
}

/**
 * Calculate bonding curve stages
 */
export function getBondingCurveStages(currentMarketCap: number) {
  return [
    {
      id: 1,
      title: 'Você Está Aqui',
      description: `$${(currentMarketCap / 1000).toFixed(1)}k market cap - Early adopter advantage`,
      range: [0, currentMarketCap],
      status: 'current' as const,
      percentage: 0,
    },
    {
      id: 2,
      title: 'Crescimento',
      description: '$10k-$50k - Comunidade crescendo',
      range: [currentMarketCap, 50000],
      status: currentMarketCap >= 10000 ? ('current' as const) : ('future' as const),
      percentage: Math.min(100, (currentMarketCap / 50000) * 100),
    },
    {
      id: 3,
      title: 'Graduação',
      description: '$69k - Listagem automática na Raydium',
      range: [50000, GRADUATION_TARGET],
      status: currentMarketCap >= GRADUATION_TARGET ? ('completed' as const) : ('future' as const),
      percentage: Math.min(100, (currentMarketCap / GRADUATION_TARGET) * 100),
    },
    {
      id: 4,
      title: 'Aftermarket',
      description: 'DEX trading + maior liquidez',
      range: [GRADUATION_TARGET, 200000],
      status: currentMarketCap > GRADUATION_TARGET ? ('current' as const) : ('future' as const),
      percentage: currentMarketCap > GRADUATION_TARGET
        ? Math.min(100, ((currentMarketCap - GRADUATION_TARGET) / 130000) * 100)
        : 0,
    },
  ];
}

/**
 * Get stage color based on status
 */
export function getStageColor(status: 'completed' | 'current' | 'future'): string {
  switch (status) {
    case 'completed':
      return '#10B981'; // green
    case 'current':
      return '#9945FF'; // purple
    case 'future':
      return '#6B7280'; // gray
  }
}
