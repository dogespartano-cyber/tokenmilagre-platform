/**
 * Jest Setup for Node.js Tests
 *
 * Setup mínimo para testes que rodam em ambiente Node.js
 * Sem mocks de window, document ou outras APIs de browser
 */

const { TextEncoder, TextDecoder } = require('util');

// Polyfills para APIs Node.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock environment variables for tests
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Timeout maior para testes que podem envolver file I/O
jest.setTimeout(10000);
