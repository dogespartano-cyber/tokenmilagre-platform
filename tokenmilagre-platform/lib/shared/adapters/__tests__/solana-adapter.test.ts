/**
 * Unit Tests for Solana Adapter
 *
 * Tests Solana blockchain integration with mocked Connection
 */

import { SolanaAdapter } from '../solana-adapter';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  mockSolanaData,
  createMockSolanaConnection,
  createMockPublicKey,
  solanaMockUtils,
} from '@/__tests__/mocks/handlers/solana';

// Mock the @solana/web3.js module
jest.mock('@solana/web3.js', () => {
  const mockConnection = createMockSolanaConnection();

  return {
    Connection: jest.fn(() => mockConnection),
    PublicKey: jest.fn((address: string) => {
      if (!address || address.length < 32) {
        throw new Error('Invalid public key input');
      }
      return createMockPublicKey(address);
    }),
    LAMPORTS_PER_SOL: 1000000000,
  };
});

// Mock the logger
jest.mock('@/lib/di/container', () => ({
  ServiceLocator: {
    getLogger: () => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    }),
  },
}));

describe('SolanaAdapter', () => {
  let adapter: SolanaAdapter;

  beforeEach(() => {
    adapter = new SolanaAdapter();
    solanaMockUtils.reset();
  });

  describe('constructor', () => {
    it('should create instance with default config', () => {
      expect(adapter).toBeInstanceOf(SolanaAdapter);
    });

    it('should accept custom network', () => {
      const testnetAdapter = new SolanaAdapter({ network: 'testnet' });
      expect(testnetAdapter).toBeInstanceOf(SolanaAdapter);
    });

    it('should accept custom RPC endpoint', () => {
      const customAdapter = new SolanaAdapter({
        rpcEndpoint: 'https://custom-solana-rpc.com',
      });
      expect(customAdapter).toBeInstanceOf(SolanaAdapter);
    });

    it('should accept custom commitment level', () => {
      const confirmedAdapter = new SolanaAdapter({
        commitment: 'confirmed',
      });
      expect(confirmedAdapter).toBeInstanceOf(SolanaAdapter);
    });
  });

  describe('getBalance', () => {
    it('should fetch SOL balance successfully', async () => {
      const balance = await adapter.getBalance('TokenMilagrePlatform111111111111111111111');

      expect(typeof balance).toBe('number');
      expect(balance).toBe(10); // 10 SOL as configured in mock
    });

    it('should return 0 for empty wallet', async () => {
      const balance = await adapter.getBalance('EmptyWallet11111111111111111111111111111');

      expect(balance).toBe(0);
    });

    it('should return 0 for unknown wallet', async () => {
      const balance = await adapter.getBalance('UnknownWallet1111111111111111111111111');

      expect(balance).toBe(0);
    });

    it('should convert lamports to SOL correctly', async () => {
      const balance = await adapter.getBalance('TokenMilagrePlatform111111111111111111111');

      expect(balance).toBe(10);
      // Verify the calculation: 10 * LAMPORTS_PER_SOL / LAMPORTS_PER_SOL = 10
    });

    it('should handle addresses with different balances', async () => {
      const balance1 = await adapter.getBalance('TokenMilagrePlatform111111111111111111111');
      const balance2 = await adapter.getBalance('TokenMilagrePlatform222222222222222222222');

      expect(balance1).toBe(10);
      expect(balance2).toBe(5.5);
    });

    it('should handle invalid address', async () => {
      await expect(adapter.getBalance('invalid')).rejects.toThrow('Invalid public key input');
    });
  });

  describe('getTokenBalance', () => {
    it('should fetch token balance successfully', async () => {
      const balance = await adapter.getTokenBalance(
        'TokenMilagrePlatform111111111111111111111',
        '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump'
      );

      expect(balance).toBe(1000);
    });

    it('should return 0 for wallet without token account', async () => {
      const balance = await adapter.getTokenBalance(
        'EmptyWallet11111111111111111111111111111',
        '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump'
      );

      expect(balance).toBe(0);
    });

    it('should return 0 for unknown wallet', async () => {
      const balance = await adapter.getTokenBalance(
        'UnknownWallet1111111111111111111111111',
        '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump'
      );

      expect(balance).toBe(0);
    });

    it('should handle invalid wallet address', async () => {
      await expect(
        adapter.getTokenBalance('invalid', '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump')
      ).rejects.toThrow('Invalid public key input');
    });

    it('should handle invalid token mint address', async () => {
      await expect(
        adapter.getTokenBalance('TokenMilagrePlatform111111111111111111111', 'invalid')
      ).rejects.toThrow('Invalid public key input');
    });
  });

  describe('getTokenSupply', () => {
    it('should fetch token supply successfully', async () => {
      const supply = await adapter.getTokenSupply(
        '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump'
      );

      expect(supply).toBe(1000000);
    });

    it('should return 0 for unknown token', async () => {
      const supply = await adapter.getTokenSupply('UnknownToken11111111111111111111111111');

      expect(supply).toBe(0);
    });

    it('should handle invalid token address', async () => {
      await expect(adapter.getTokenSupply('invalid')).rejects.toThrow('Invalid public key input');
    });
  });

  describe('getRecentTransactions', () => {
    it('should fetch recent transactions successfully', async () => {
      const txs = await adapter.getRecentTransactions(
        'TokenMilagrePlatform111111111111111111111',
        10
      );

      expect(Array.isArray(txs)).toBe(true);
      expect(txs.length).toBe(2); // Mock has 2 transactions
    });

    it('should respect limit parameter', async () => {
      const txs = await adapter.getRecentTransactions(
        'TokenMilagrePlatform111111111111111111111',
        1
      );

      expect(txs.length).toBe(1);
    });

    it('should return empty array for wallet without transactions', async () => {
      const txs = await adapter.getRecentTransactions(
        'EmptyWallet11111111111111111111111111111',
        10
      );

      expect(txs).toEqual([]);
    });

    it('should include all transaction fields', async () => {
      const txs = await adapter.getRecentTransactions(
        'TokenMilagrePlatform111111111111111111111',
        1
      );

      expect(txs[0]).toHaveProperty('signature');
      expect(txs[0]).toHaveProperty('slot');
      expect(txs[0]).toHaveProperty('err');
      expect(txs[0]).toHaveProperty('memo');
      expect(txs[0]).toHaveProperty('blockTime');
    });

    it('should handle invalid address', async () => {
      await expect(adapter.getRecentTransactions('invalid', 10)).rejects.toThrow(
        'Invalid public key input'
      );
    });
  });

  describe('isValidAddress', () => {
    it('should validate correct Solana address', () => {
      const isValid = adapter.isValidAddress('TokenMilagrePlatform111111111111111111111');

      expect(isValid).toBe(true);
    });

    it('should reject invalid address - too short', () => {
      const isValid = adapter.isValidAddress('invalid');

      expect(isValid).toBe(false);
    });

    it('should reject empty address', () => {
      const isValid = adapter.isValidAddress('');

      expect(isValid).toBe(false);
    });

    it('should reject null/undefined', () => {
      expect(adapter.isValidAddress(null as any)).toBe(false);
      expect(adapter.isValidAddress(undefined as any)).toBe(false);
    });
  });

  describe('getCurrentSlot', () => {
    it('should fetch current slot successfully', async () => {
      const slot = await adapter.getCurrentSlot();

      expect(typeof slot).toBe('number');
      expect(slot).toBe(123456790);
    });

    it('should return positive number', async () => {
      const slot = await adapter.getCurrentSlot();

      expect(slot).toBeGreaterThan(0);
    });
  });

  describe('getConnection', () => {
    it('should return Connection instance', () => {
      const connection = adapter.getConnection();

      expect(connection).toBeDefined();
      expect(connection).toHaveProperty('getBalance');
      expect(connection).toHaveProperty('getSlot');
    });
  });

  describe('custom mock utilities', () => {
    it('should allow setting custom balance', async () => {
      const customAddress = 'CustomWallet1111111111111111111111111111';
      const customBalance = 25.5;

      solanaMockUtils.setBalance(customAddress, customBalance * LAMPORTS_PER_SOL);

      const balance = await adapter.getBalance(customAddress);
      expect(balance).toBe(customBalance);
    });

    it('should allow setting custom token account', async () => {
      const walletAddress = 'CustomWallet1111111111111111111111111111';
      const mintAddress = 'CustomToken11111111111111111111111111111';
      const amount = 5000000000; // 5000 tokens with 6 decimals

      solanaMockUtils.setTokenAccount(walletAddress, mintAddress, amount, 6);

      const balance = await adapter.getTokenBalance(walletAddress, mintAddress);
      expect(balance).toBe(5000);
    });

    it('should allow adding custom transaction', async () => {
      const address = 'CustomWallet1111111111111111111111111111';
      const signature = 'TestSignature123456789';
      const slot = 999999999;

      solanaMockUtils.addTransaction(address, signature, slot, 'Test memo');

      const txs = await adapter.getRecentTransactions(address, 10);
      expect(txs.length).toBeGreaterThan(0);
      expect(txs[0].signature).toBe(signature);
      expect(txs[0].slot).toBe(slot);
    });
  });

  describe('error handling', () => {
    it('should handle connection errors gracefully', async () => {
      // Mock connection to throw error
      const mockConnection = createMockSolanaConnection();
      mockConnection.getBalance = jest.fn().mockRejectedValue(new Error('Network error'));

      const Connection = require('@solana/web3.js').Connection;
      Connection.mockImplementationOnce(() => mockConnection);

      const errorAdapter = new SolanaAdapter();

      await expect(
        errorAdapter.getBalance('TokenMilagrePlatform111111111111111111111')
      ).rejects.toThrow('Network error');
    });
  });
});
