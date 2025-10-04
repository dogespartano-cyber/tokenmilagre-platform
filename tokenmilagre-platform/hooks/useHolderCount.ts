import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';
const RPC_URL = 'https://api.mainnet-beta.solana.com';
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export function useHolderCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHolderCount() {
      try {
        setLoading(true);
        setError(null);

        const connection = new Connection(RPC_URL, 'confirmed');
        const mintAddress = new PublicKey(TOKEN_ADDRESS);

        // Fetch all token accounts for this mint
        const accounts = await connection.getProgramAccounts(
          TOKEN_PROGRAM_ID,
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
