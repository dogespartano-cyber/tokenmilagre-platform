/**
 * MSW Setup for Tests
 *
 * Import this file in tests that need MSW mocking.
 * Polyfills (including fetch) are loaded via jest.config.js setupFiles.
 */

import { setupServer } from 'msw/node'
import { binanceHandlers } from './mocks/handlers/binance'
import { perplexityHandlers } from './mocks/handlers/perplexity'
import { geminiHandlers } from './mocks/handlers/gemini'

// Create MSW server
export const server = setupServer(
  ...binanceHandlers,
  ...perplexityHandlers,
  ...geminiHandlers
)

// Setup server lifecycle
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
