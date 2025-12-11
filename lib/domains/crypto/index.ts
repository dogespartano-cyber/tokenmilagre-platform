/**
 * 🌀 Crypto Domain - Public API
 * 
 * @agi-domain: crypto
 * @agi-pattern: fractal auto-similar
 * @agi-entry-point: true
 * 
 * This is the public entry point for the crypto domain.
 * All exports from this module are considered part of the public API.
 * 
 * Usage:
 * ```typescript
 * import { useBinanceData, useHolderCount } from '@/lib/domains/crypto'
 * ```
 */

// ============================================
// TYPES (Public)
// ============================================
export type {
    BinanceData,
    TechnicalIndicators,
    UseBinanceDataResult,
    UseHolderCountResult,
} from './types';

export {
    TOKEN_ADDRESS,
    SOLANA_RPC_URL,
    TOKEN_PROGRAM_ID,
} from './types';

// ============================================
// HOOKS (Public)
// ============================================
export { useBinanceData, useHolderCount } from './hooks';
