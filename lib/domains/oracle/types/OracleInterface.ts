import { FlightEvent } from "../../../agents/flight-recorder";

export type SignalType = 'SCAM' | 'GEM' | 'NEUTRAL' | 'RUG_PULL_RISK';

export interface OracleConfig {
    minLiquidity: number;
    checkIntervalMs: number;
    securityLevel: 'AGGRESSIVE' | 'CONSERVATIVE';
}

export interface OracleAnalysisResult {
    tokenAddress: string;
    riskScore: number; // 0 to 100
    signal: SignalType;
    details: {
        liquidityLocked: boolean;
        mintAuthorityDisabled: boolean;
        topHoldersPercentage: number;
        metadataMutable: boolean;
    };
    timestamp: number;
}

export interface IOracleAnalyzer {
    analyzeToken(tokenAddress: string): Promise<OracleAnalysisResult>;
    logEvent(event: FlightEvent): void;
}
