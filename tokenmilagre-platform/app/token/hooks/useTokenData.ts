/**
 * React Query hook for fetching token data from Pump.fun API
 */

import { useQuery } from '@tanstack/react-query';

export interface TokenData {
  address: string;
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  metadata_uri: string;
  twitter?: string;
  telegram?: string;
  website?: string;

  // Market data
  market_cap: number;
  price_usd: number;
  volume_24h: number;
  price_change_24h: number;

  // Token info
  total_supply: number;
  decimals: number;
  creator: string;
  created_timestamp: number;

  // Bonding curve info
  bonding_curve: string;
  associated_bonding_curve: string;
  complete: boolean;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;

  // Social metrics
  reply_count?: number;
  followers?: number;
  holder_count?: number;
}

export interface TokenStats {
  marketCap: number;
  price: number;
  volume24h: number;
  priceChange24h: number;
  holders: number;
  transactions24h: number;

  // Bonding curve progress
  currentProgress: number;
  graduationTarget: number;
  progressPercentage: number;
}

const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';
const PUMP_FUN_API = 'https://frontend-api.pump.fun';
const GRADUATION_TARGET = 69000; // $69k market cap

/**
 * Fetch token data from Pump.fun API
 */
async function fetchTokenData(tokenAddress: string): Promise<TokenData> {
  const response = await fetch(`${PUMP_FUN_API}/coins/${tokenAddress}`);

  if (!response.ok) {
    throw new Error('Failed to fetch token data');
  }

  const data = await response.json();
  return data;
}

/**
 * Fetch holder count from Solscan API (backup)
 */
async function fetchHolderCount(tokenAddress: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.solscan.io/token/holders?token=${tokenAddress}&offset=0&size=1`
    );

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return data.total || 0;
  } catch (error) {
    console.error('Failed to fetch holder count:', error);
    return 0;
  }
}

/**
 * Transform raw token data into stats
 */
function transformToStats(data: TokenData): TokenStats {
  const marketCap = data.market_cap || 0;
  const progressPercentage = (marketCap / GRADUATION_TARGET) * 100;

  return {
    marketCap,
    price: data.price_usd || 0,
    volume24h: data.volume_24h || 0,
    priceChange24h: data.price_change_24h || 0,
    holders: data.holder_count || 0,
    transactions24h: 0, // Not available in current API
    currentProgress: marketCap,
    graduationTarget: GRADUATION_TARGET,
    progressPercentage,
  };
}

/**
 * Hook to fetch token data with React Query
 */
export function useTokenData() {
  return useQuery({
    queryKey: ['token-data', TOKEN_ADDRESS],
    queryFn: () => fetchTokenData(TOKEN_ADDRESS),
    staleTime: 30_000, // 30 seconds
    refetchInterval: 30_000, // Auto-refetch every 30s
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to fetch token stats (transformed data)
 */
export function useTokenStats() {
  const { data, ...rest } = useTokenData();

  return {
    ...rest,
    data: data ? transformToStats(data) : undefined,
  };
}

/**
 * Hook to fetch holder count separately
 */
export function useHolderCount() {
  return useQuery({
    queryKey: ['holder-count', TOKEN_ADDRESS],
    queryFn: () => fetchHolderCount(TOKEN_ADDRESS),
    staleTime: 60_000, // 1 minute
    refetchInterval: 60_000, // Auto-refetch every 1 minute
    retry: 2,
  });
}

/**
 * Mock data for development/testing
 */
export const mockTokenData: TokenData = {
  address: TOKEN_ADDRESS,
  name: 'MILAGRE',
  symbol: 'MILAGRE',
  description: 'Token comunitário que financia educação gratuita sobre criptomoedas',
  image_uri: '/images/TOKEN-MILAGRE-.webp',
  metadata_uri: '',
  twitter: 'https://twitter.com/tokenmilagre',
  telegram: 'https://t.me/+Bop_TVFc_mg3Njlh',
  website: 'https://tokenmilagre.xyz',

  market_cap: 4600,
  price_usd: 0.0000046,
  volume_24h: 1234,
  price_change_24h: 12.3,

  total_supply: 1_000_000_000,
  decimals: 6,
  creator: '',
  created_timestamp: Date.now() - 86400000 * 30, // 30 days ago

  bonding_curve: '',
  associated_bonding_curve: '',
  complete: false,
  virtual_sol_reserves: 0,
  virtual_token_reserves: 0,

  holder_count: 247,
};

export const mockTokenStats: TokenStats = {
  marketCap: 4600,
  price: 0.0000046,
  volume24h: 1234,
  priceChange24h: 12.3,
  holders: 247,
  transactions24h: 89,
  currentProgress: 4600,
  graduationTarget: GRADUATION_TARGET,
  progressPercentage: (4600 / GRADUATION_TARGET) * 100,
};

export { TOKEN_ADDRESS, GRADUATION_TARGET };
