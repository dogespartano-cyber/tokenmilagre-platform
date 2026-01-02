import { FlightEvent } from "../../../agents/flight-recorder";

export type SignalType = 'SCAM' | 'GEM' | 'NEUTRAL' | 'RUG_PULL_RISK' | 'SAFE';

export interface OracleConfig {
    minLiquidity: number;
    checkIntervalMs: number;
    securityLevel: 'AGGRESSIVE' | 'CONSERVATIVE';
}

export interface OracleAnalysisResult {
    tokenAddress: string;
    riskScore: number; // 0 (Safe) to 100 (Risky)
    trustScore: number; // 0 (Risky) to 100 (Safe)
    signal: SignalType;
    details: {
        liquidityLocked: boolean;
        mintAuthorityDisabled: boolean;
        topHoldersPercentage: number;
        metadataMutable: boolean;
    };
    marketData?: {
        priceUsd: number;
        liquidityUsd: number;
        marketCap: number;
        fdv: number;
        pairCreatedAt: number;
        volume24h: number;
    };
    timestamp: number;
}

export interface IOracleAnalyzer {
    analyzeToken(tokenAddress: string): Promise<OracleAnalysisResult>;
    logEvent(event: FlightEvent): void;
}
