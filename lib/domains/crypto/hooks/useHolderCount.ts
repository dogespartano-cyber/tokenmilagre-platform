/**
 * 🌀 Crypto Domain - useHolderCount Hook
 * 
 * @agi-domain: crypto
 * @agi-pattern: fractal auto-similar
 * 
 * Hook for fetching $MILAGRE token holder count from Solana blockchain.
 */

import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_ADDRESS, SOLANA_RPC_URL, TOKEN_PROGRAM_ID } from '../types';
import type { UseHolderCountResult } from '../types';

/**
 * Fetch the number of holders for $MILAGRE token
 * 
 * @returns Holder count, loading state, and error
 */
export function useHolderCount(): UseHolderCountResult {
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchHolderCount() {
            try {
                setLoading(true);
                setError(null);

                const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
                const mintAddress = new PublicKey(TOKEN_ADDRESS);
                const tokenProgramId = new PublicKey(TOKEN_PROGRAM_ID);

                // Fetch all token accounts for this mint
                const accounts = await connection.getProgramAccounts(
                    tokenProgramId,
                    {
                        filters: [
                            {
                                dataSize: 165, // Size of token account
                            },
                            {
                                memcmp: {
                                    offset: 0,
                                    bytes: mintAddress.toBase58(),
                                },
                            },
                        ],
                    }
                );

                // Filter accounts with balance > 0
                const accountsWithBalance = accounts.filter((account) => {
                    const data = account.account.data;
                    const amount = data.readBigUInt64LE(64);
                    return amount > BigInt(0);
                });

                setCount(accountsWithBalance.length);
            } catch (err) {
                console.error('Error fetching holder count:', err);
                setError('Não foi possível carregar o número de holders');
                setCount(null);
            } finally {
                setLoading(false);
            }
        }

        // Fetch immediately
        fetchHolderCount();

        // Refresh every 2 minutes
        const interval = setInterval(fetchHolderCount, 120000);

        return () => clearInterval(interval);
    }, []);

    return { count, loading, error };
}
