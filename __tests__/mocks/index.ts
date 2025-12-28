/**
 * Mock Utilities Index
 *
 * Central export point for all mock utilities
 */

// MSW Server and handlers
export * from './server';

// Individual handlers
export * from './handlers/binance';
export * from './handlers/perplexity';
export * from './handlers/gemini';

/**
 * Quick setup function for tests
 *
 * @example
 * ```typescript
 * import { setupAllMocks } from '__tests__/mocks';
 *
 * describe('My Test Suite', () => {
 *   setupAllMocks();
 *
 *   it('should work with mocked APIs', async () => {
 *     // Your test here
 *   });
 * });
 * ```
 */
export function setupAllMocks() {
  const { setupMockServer } = require('./server');
  setupMockServer();
}
