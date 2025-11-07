/**
 * Testes para validação de variáveis de ambiente
 */

describe('Environment Variables', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should validate required environment variables', () => {
    process.env.DATABASE_URL = 'postgresql://test';
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
    process.env.NEXTAUTH_SECRET = 'a'.repeat(32);
    process.env.NEXT_PUBLIC_SOLANA_NETWORK = 'mainnet-beta';
    process.env.NEXT_PUBLIC_TOKEN_ADDRESS = 'a'.repeat(32);

    expect(() => {
      require('@/lib/env');
    }).not.toThrow();
  });

  it('should throw error for missing required variables', () => {
    process.env.DATABASE_URL = '';
    process.env.NODE_ENV = 'production';

    expect(() => {
      require('@/lib/env');
    }).toThrow();
  });
});
