/**
 * MSW Server Configuration
 *
 * Sets up Mock Service Worker server for Node.js environment (Jest tests)
 */

import { setupServer } from 'msw/node';
import { binanceHandlers } from './handlers/binance';
import { perplexityHandlers } from './handlers/perplexity';
import { geminiHandlers } from './handlers/gemini';

/**
 * MSW server instance with all API handlers
 */
export const server = setupServer(
  ...binanceHandlers,
  ...perplexityHandlers,
  ...geminiHandlers
);

/**
 * Configure server to listen before all tests
 */
export function setupMockServer() {
  // Enable request interception
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'warn', // Warn about unhandled requests
    });
  });

  // Reset handlers after each test
  afterEach(() => {
    server.resetHandlers();
  });

  // Clean up after all tests
  afterAll(() => {
    server.close();
  });
}

/**
 * Export individual handlers for custom test scenarios
 */
export { binanceHandlers } from './handlers/binance';
export { perplexityHandlers } from './handlers/perplexity';
export { geminiHandlers } from './handlers/gemini';

/**
 * Export mock data utilities
 */
export { binanceMockData } from './handlers/binance';
export { perplexityMockData } from './handlers/perplexity';
export { geminiMockData } from './handlers/gemini';

/**
 * Export Solana mocks (these use Jest mocks instead of MSW)
 */
export {
  mockSolanaData,
  createMockSolanaConnection,
  createMockPublicKey,
  setupSolanaMocks,
  solanaMockUtils,
} from './handlers/solana';
