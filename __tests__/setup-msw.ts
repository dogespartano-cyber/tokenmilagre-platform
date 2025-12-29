/**
 * MSW Setup for Tests
 *
 * Import this file in tests that need MSW mocking
 */

// Polyfill for MSW 2.x in Node.js environment
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

// Use undici for fetch polyfills (bundled with Node 18+)
import { fetch, Headers, Request, Response } from 'undici'
// @ts-expect-error - undici types differ slightly from DOM globals but are compatible at runtime
global.fetch = fetch
// @ts-expect-error - undici types differ slightly from DOM globals
global.Headers = Headers
// @ts-expect-error - undici types differ slightly from DOM globals
global.Request = Request
// @ts-expect-error - undici types differ slightly from DOM globals
global.Response = Response

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
