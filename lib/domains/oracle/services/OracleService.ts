import { Connection, PublicKey } from '@solana/web3.js';
import { IOracleAnalyzer, OracleAnalysisResult, OracleConfig, SignalType } from "../types/OracleInterface";
import { flightRecorder, FlightEvent } from "../../../agents/flight-recorder";

// Helius RPC URL from environment or fallback
const RPC_URL = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://mainnet.helius-rpc.com/?api-key=demo';

export class OracleAnalyzerService implements IOracleAnalyzer {
    private config: OracleConfig;
    private connection: Connection;

    constructor(config: OracleConfig) {
        this.config = config;
        this.connection = new Connection(RPC_URL, 'confirmed');

        // ⚠️ CRÍTICO: Logging initialization as per Phase 3, Step 7
        this.logEvent({
            agent: 'CODIGO',
            intent: 'Initialize Oracle Module',
            tool: 'OracleAnalyzerService',
            params: { config, rpcEndpoint: RPC_URL },
            result: 'success',
            trustScore: 10
        });
    }

    public async analyzeToken(tokenAddress: string): Promise<OracleAnalysisResult> {
        const start = Date.now();
        let riskScore = 0;
        const checks = {
            liquidityLocked: false,
            mintAuthorityDisabled: false,
            topHoldersPercentage: 0, // Placeholder for now
            metadataMutable: true
        };

        try {
            const pubKey = new PublicKey(tokenAddress);
            const accountInfo = await this.connection.getParsedAccountInfo(pubKey);

            if (!accountInfo.value) {
                throw new Error("Token account not found");
            }

            // Type guard to ensure we access parsed data safely
            const data = accountInfo.value.data;
            let mintAuthority = null;
            let freezeAuthority = null;

            if ('parsed' in data) {
                const info = data.parsed.info;
                mintAuthority = info.mintAuthority;
                freezeAuthority = info.freezeAuthority;
            }

            // 1. Check Mint Authority
            if (mintAuthority === null) {
                checks.mintAuthorityDisabled = true;
            } else {
                riskScore += 30; // High risk if mint auth exists
            }

            // 2. Check Freeze Authority
            if (freezeAuthority !== null) {
                riskScore += 20; // Risk if freeze auth exists
            }

            // 3. Check Top Holders (Real Data)
            try {
                const supplyResponse = await this.connection.getTokenSupply(pubKey);
                const supply = supplyResponse.value.uiAmount || 0;

                if (supply > 0) {
                    const largestAccounts = await this.connection.getTokenLargestAccounts(pubKey);

                    // Sum top 10 holders
                    const top10Amount = largestAccounts.value
                        .slice(0, 10)
                        .reduce((acc, accInfo) => acc + (accInfo.uiAmount || 0), 0);

                    const concentration = (top10Amount / supply) * 100;
                    checks.topHoldersPercentage = parseFloat(concentration.toFixed(2));

                    // Risk Logic: High concentration is risky
                    if (concentration > 50) {
                        riskScore += 30; // Add 30 risk points if top 10 hold > 50%
                    }
                }
            } catch (err) {
                console.warn("Failed to fetch holders:", err);
                // Non-fatal, just don't add score
            }

            // TODO: Implement actual metadata mutable check
            // TODO: Implement liquidity check

            this.logEvent({
                agent: 'ORACLE',
                intent: 'Analyze Token',
                tool: 'analyzeToken',
                params: { tokenAddress, riskScore, holders: checks.topHoldersPercentage },
                trustScore: 10,
                result: 'success'
            });

            const finalTrustScore = Math.max(0, 100 - riskScore);
            let signal: SignalType = 'NEUTRAL';
            if (finalTrustScore >= 80) signal = 'SAFE';
            if (finalTrustScore < 50) signal = 'RUG_PULL_RISK';

            return {
                tokenAddress,
                riskScore: riskScore, // Keep for backward compatibility if needed, or remove. Let's keep distinct.
                trustScore: finalTrustScore, // New field
                signal,
                details: {
                    liquidityLocked: checks.liquidityLocked,
                    mintAuthorityDisabled: checks.mintAuthorityDisabled,
                    topHoldersPercentage: checks.topHoldersPercentage,
                    metadataMutable: checks.metadataMutable
                },
                marketData: await this.fetchMarketData(tokenAddress),
                timestamp: Date.now()
            };

        } catch (error) {
            this.logEvent({
                agent: 'ORACLE',
                intent: 'Analyze Token Failed',
                tool: 'analyzeToken',
                params: { tokenAddress, error: error instanceof Error ? error.message : 'Unknown' },
                result: 'failure',
                trustScore: 0
            });
            throw error;
        }
    }

    private async fetchMarketData(tokenAddress: string) {
        try {
            const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
            if (!response.ok) return undefined;

            const data = await response.json();
            if (!data.pairs || data.pairs.length === 0) return undefined;

            // Sort by liquidity to get the main pair
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const bestPair = data.pairs.sort((a: any, b: any) => b.liquidity.usd - a.liquidity.usd)[0];

            return {
                priceUsd: parseFloat(bestPair.priceUsd),
                liquidityUsd: bestPair.liquidity.usd,
                marketCap: bestPair.marketCap || bestPair.fdv,
                fdv: bestPair.fdv,
                pairCreatedAt: bestPair.pairCreatedAt,
                volume24h: bestPair.volume.h24
            };
        } catch (error) {
            console.warn("Failed to fetch market data:", error);
            return undefined;
        }
    }

    public logEvent(event: FlightEvent): void {
        flightRecorder.log(event);
    }
}
