/**
 * Solana Blockchain Adapter
 *
 * Encapsulates Solana blockchain integration with type safety and proper error handling
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ServiceLocator } from '@/lib/di/container';

/**
 * Token account info
 */
export interface TokenAccountInfo {
  address: string;
  mint: string;
  owner: string;
  amount: string;
  decimals: number;
  uiAmount: number | null;
}

/**
 * Token metadata
 */
export interface TokenMetadata {
  symbol: string;
  name: string;
  decimals: number;
  supply: string;
  address: string;
}

/**
 * Transaction signature info
 */
export interface TransactionInfo {
  signature: string;
  slot: number;
  err: any | null;
  memo: string | null;
  blockTime: number | null;
}

/**
 * Solana adapter configuration
 */
export interface SolanaConfig {
  rpcEndpoint?: string;
  network?: 'mainnet-beta' | 'testnet' | 'devnet';
  commitment?: 'processed' | 'confirmed' | 'finalized';
}

/**
 * Solana Blockchain Adapter
 * Provides type-safe access to Solana network
 */
export class SolanaAdapter {
  private connection: Connection;
  private network: string;
  private logger = ServiceLocator.getLogger();

  constructor(config: SolanaConfig = {}) {
    const defaultEndpoints: Record<string, string> = {
      'mainnet-beta': 'https://api.mainnet-beta.solana.com',
      'testnet': 'https://api.testnet.solana.com',
      'devnet': 'https://api.devnet.solana.com',
    };

    this.network = config.network || 'mainnet-beta';
    const endpoint = config.rpcEndpoint || defaultEndpoints[this.network];
    const commitment = config.commitment || 'confirmed';

    this.connection = new Connection(endpoint, commitment);

    this.logger.info('Solana adapter initialized', { network: this.network, endpoint });
  }

  /**
   * Get SOL balance for an address
   *
   * @param address - Wallet address
   * @returns Balance in SOL
   *
   * @example
   * ```typescript
   * const adapter = new SolanaAdapter();
   * const balance = await adapter.getBalance('YourWalletAddress...');
   * console.log(`Balance: ${balance} SOL`);
   * ```
   */
  async getBalance(address: string): Promise<number> {
    this.logger.info('Fetching SOL balance', { address });

    try {
      const publicKey = new PublicKey(address);
      const lamports = await this.connection.getBalance(publicKey);
      const sol = lamports / LAMPORTS_PER_SOL;

      this.logger.info('SOL balance fetched successfully', { address, balance: sol });

      return sol;
    } catch (error) {
      this.logger.error('Error fetching SOL balance', error as Error, { address });
      throw error;
    }
  }

  /**
   * Get token balance for an address
   *
   * @param walletAddress - Wallet address
   * @param tokenMintAddress - Token mint address
   * @returns Token balance
   *
   * @example
   * ```typescript
   * const adapter = new SolanaAdapter();
   * const balance = await adapter.getTokenBalance(
   *   'YourWalletAddress...',
   *   '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump'
   * );
   * console.log(`Token Balance: ${balance}`);
   * ```
   */
  async getTokenBalance(walletAddress: string, tokenMintAddress: string): Promise<number> {
    this.logger.info('Fetching token balance', { walletAddress, tokenMintAddress });

    try {
      const walletPublicKey = new PublicKey(walletAddress);
      const tokenMintPublicKey = new PublicKey(tokenMintAddress);

      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        walletPublicKey,
        { mint: tokenMintPublicKey }
      );

      if (tokenAccounts.value.length === 0) {
        this.logger.info('No token accounts found', { walletAddress, tokenMintAddress });
        return 0;
      }

      const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;

      this.logger.info('Token balance fetched successfully', {
        walletAddress,
        tokenMintAddress,
        balance
      });

      return balance || 0;
    } catch (error) {
      this.logger.error('Error fetching token balance', error as Error, {
        walletAddress,
        tokenMintAddress
      });
      throw error;
    }
  }

  /**
   * Get token supply
   *
   * @param tokenMintAddress - Token mint address
   * @returns Total supply
   *
   * @example
   * ```typescript
   * const adapter = new SolanaAdapter();
   * const supply = await adapter.getTokenSupply('3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump');
   * console.log(`Total Supply: ${supply}`);
   * ```
   */
  async getTokenSupply(tokenMintAddress: string): Promise<number> {
    this.logger.info('Fetching token supply', { tokenMintAddress });

    try {
      const mintPublicKey = new PublicKey(tokenMintAddress);
      const supply = await this.connection.getTokenSupply(mintPublicKey);

      const uiAmount = supply.value.uiAmount || 0;

      this.logger.info('Token supply fetched successfully', {
        tokenMintAddress,
        supply: uiAmount
      });

      return uiAmount;
    } catch (error) {
      this.logger.error('Error fetching token supply', error as Error, { tokenMintAddress });
      throw error;
    }
  }

  /**
   * Get recent transactions for an address
   *
   * @param address - Wallet address
   * @param limit - Maximum number of transactions to fetch
   * @returns Array of transaction signatures
   *
   * @example
   * ```typescript
   * const adapter = new SolanaAdapter();
   * const txs = await adapter.getRecentTransactions('YourWalletAddress...', 10);
   * console.log(`Recent transactions: ${txs.length}`);
   * ```
   */
  async getRecentTransactions(address: string, limit: number = 10): Promise<TransactionInfo[]> {
    this.logger.info('Fetching recent transactions', { address, limit });

    try {
      const publicKey = new PublicKey(address);
      const signatures = await this.connection.getSignaturesForAddress(publicKey, { limit });

      const transactions: TransactionInfo[] = signatures.map(sig => ({
        signature: sig.signature,
        slot: sig.slot,
        err: sig.err,
        memo: sig.memo || null,
        blockTime: sig.blockTime || null,
      }));

      this.logger.info('Recent transactions fetched successfully', {
        address,
        count: transactions.length
      });

      return transactions;
    } catch (error) {
      this.logger.error('Error fetching recent transactions', error as Error, { address });
      throw error;
    }
  }

  /**
   * Validate Solana address
   *
   * @param address - Address to validate
   * @returns True if valid
   *
   * @example
   * ```typescript
   * const adapter = new SolanaAdapter();
   * const isValid = adapter.isValidAddress('YourWalletAddress...');
   * console.log(`Valid address: ${isValid}`);
   * ```
   */
  isValidAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current slot
   *
   * @returns Current slot number
   */
  async getCurrentSlot(): Promise<number> {
    this.logger.info('Fetching current slot');

    try {
      const slot = await this.connection.getSlot();

      this.logger.info('Current slot fetched successfully', { slot });

      return slot;
    } catch (error) {
      this.logger.error('Error fetching current slot', error as Error);
      throw error;
    }
  }

  /**
   * Get connection object for advanced usage
   *
   * @returns Connection instance
   */
  getConnection(): Connection {
    return this.connection;
  }
}

// Export singleton instance with default config
export const solanaAdapter = new SolanaAdapter({
  network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as any) || 'mainnet-beta',
});
