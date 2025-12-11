/**
 * Mock Handlers for Solana Web3.js
 *
 * Provides mock implementation of Solana Connection for testing
 */

import { LAMPORTS_PER_SOL } from '@solana/web3.js';

/**
 * Mock Solana connection data
 */
export const mockSolanaData = {
  // Mock wallet with 10 SOL
  balances: {
    'TokenMilagrePlatform111111111111111111111': 10 * LAMPORTS_PER_SOL,
    'TokenMilagrePlatform222222222222222222222': 5.5 * LAMPORTS_PER_SOL,
    'EmptyWallet11111111111111111111111111111': 0,
  },

  // Mock token accounts
  tokenAccounts: {
    'TokenMilagrePlatform111111111111111111111': {
      '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump': {
        value: [
          {
            account: {
              data: {
                parsed: {
                  info: {
                    tokenAmount: {
                      amount: '1000000000',
                      decimals: 6,
                      uiAmount: 1000,
                      uiAmountString: '1000',
                    },
                    mint: '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump',
                    owner: 'TokenMilagrePlatform111111111111111111111',
                  },
                },
              },
            },
          },
        ],
      },
    },
    'EmptyWallet11111111111111111111111111111': {
      '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump': {
        value: [],
      },
    },
  },

  // Mock token supply
  tokenSupply: {
    '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump': {
      value: {
        amount: '1000000000000',
        decimals: 6,
        uiAmount: 1000000,
        uiAmountString: '1000000',
      },
    },
  },

  // Mock transactions
  transactions: {
    'TokenMilagrePlatform111111111111111111111': [
      {
        signature: '5Jj3K4L6M7N8P9Q1R2S3T4U5V6W7X8Y9Z1A2B3C4D5E6F7G8H9I1J2K3L4M5N6O7P8Q9R1S2T3U4V5W6X7Y8Z9',
        slot: 123456789,
        err: null,
        memo: null,
        blockTime: 1699920000,
      },
      {
        signature: '4Kk4L5M6N7O8P9Q1R2S3T4U5V6W7X8Y9Z1A2B3C4D5E6F7G8H9I1J2K3L4M5N6O7P8Q9R1S2T3U4V5W6X7Y8',
        slot: 123456788,
        err: null,
        memo: 'Test transfer',
        blockTime: 1699919000,
      },
    ],
  },

  // Mock current slot
  currentSlot: 123456790,
};

/**
 * Create mock Solana Connection
 *
 * This is used to mock @solana/web3.js Connection in tests
 */
export const createMockSolanaConnection = () => {
  return {
    getBalance: jest.fn(async (publicKey: any) => {
      const address = publicKey.toString();
      return mockSolanaData.balances[address] || 0;
    }),

    getParsedTokenAccountsByOwner: jest.fn(async (walletPublicKey: any, filter: any) => {
      const walletAddress = walletPublicKey.toString();
      const mintAddress = filter.mint.toString();

      const accountsForWallet = mockSolanaData.tokenAccounts[walletAddress];
      if (!accountsForWallet) {
        return { value: [] };
      }

      return accountsForWallet[mintAddress] || { value: [] };
    }),

    getTokenSupply: jest.fn(async (mintPublicKey: any) => {
      const mintAddress = mintPublicKey.toString();
      return (
        mockSolanaData.tokenSupply[mintAddress] || {
          value: {
            amount: '0',
            decimals: 0,
            uiAmount: 0,
            uiAmountString: '0',
          },
        }
      );
    }),

    getSignaturesForAddress: jest.fn(async (publicKey: any, options: any) => {
      const address = publicKey.toString();
      const limit = options?.limit || 10;
      const txs = mockSolanaData.transactions[address] || [];
      return txs.slice(0, limit);
    }),

    getSlot: jest.fn(async () => {
      return mockSolanaData.currentSlot;
    }),
  };
};

/**
 * Mock PublicKey constructor
 *
 * Returns a simple object with toString method
 */
export const createMockPublicKey = (address: string) => ({
  toString: () => address,
  toBase58: () => address,
  toBuffer: () => Buffer.from(address),
  equals: (other: any) => other.toString() === address,
});

/**
 * Helper to setup Solana mocks in tests
 *
 * @example
 * ```typescript
 * import { setupSolanaMocks } from '__tests__/mocks/handlers/solana';
 *
 * beforeEach(() => {
 *   setupSolanaMocks();
 * });
 * ```
 */
export const setupSolanaMocks = () => {
  // Mock @solana/web3.js module
  jest.mock('@solana/web3.js', () => {
    const actual = jest.requireActual('@solana/web3.js');
    return {
      ...actual,
      Connection: jest.fn().mockImplementation(() => createMockSolanaConnection()),
      PublicKey: jest.fn().mockImplementation((address: string) => {
        // Validate address format (basic validation)
        if (!address || address.length < 32) {
          throw new Error('Invalid public key input');
        }
        return createMockPublicKey(address);
      }),
    };
  });
};

/**
 * Mock data generators for custom test scenarios
 */
export const solanaMockUtils = {
  /**
   * Add custom balance for testing
   */
  setBalance(address: string, lamports: number) {
    mockSolanaData.balances[address] = lamports;
  },

  /**
   * Add custom token account for testing
   */
  setTokenAccount(walletAddress: string, mintAddress: string, amount: number, decimals: number = 6) {
    if (!mockSolanaData.tokenAccounts[walletAddress]) {
      mockSolanaData.tokenAccounts[walletAddress] = {};
    }

    mockSolanaData.tokenAccounts[walletAddress][mintAddress] = {
      value: [
        {
          account: {
            data: {
              parsed: {
                info: {
                  tokenAmount: {
                    amount: amount.toString(),
                    decimals,
                    uiAmount: amount / Math.pow(10, decimals),
                    uiAmountString: (amount / Math.pow(10, decimals)).toString(),
                  },
                  mint: mintAddress,
                  owner: walletAddress,
                },
              },
            },
          },
        },
      ],
    };
  },

  /**
   * Add custom transaction for testing
   */
  addTransaction(address: string, signature: string, slot: number, memo?: string) {
    if (!mockSolanaData.transactions[address]) {
      mockSolanaData.transactions[address] = [];
    }

    mockSolanaData.transactions[address].unshift({
      signature,
      slot,
      err: null,
      memo: memo || null,
      blockTime: Math.floor(Date.now() / 1000),
    });
  },

  /**
   * Reset all mock data to defaults
   */
  reset() {
    Object.keys(mockSolanaData.balances).forEach(key => {
      if (!key.includes('TokenMilagrePlatform') && !key.includes('EmptyWallet')) {
        delete mockSolanaData.balances[key];
      }
    });

    Object.keys(mockSolanaData.tokenAccounts).forEach(key => {
      if (!key.includes('TokenMilagrePlatform') && !key.includes('EmptyWallet')) {
        delete mockSolanaData.tokenAccounts[key];
      }
    });

    Object.keys(mockSolanaData.transactions).forEach(key => {
      if (!key.includes('TokenMilagrePlatform')) {
        delete mockSolanaData.transactions[key];
      }
    });
  },
};
