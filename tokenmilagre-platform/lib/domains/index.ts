/**
 * 🌀 Domains Registry
 * 
 * @agi-purpose: Central entry point for all domain modules
 * @agi-pattern: fractal
 * 
 * Each domain follows the self-similar structure:
 * - index.ts (entry point)
 * - types.ts (types)
 * - service.ts (business logic - optional)
 * - schemas.ts (validation - optional)
 * - __tests__/ (tests)
 */

// Resources Domain
export * from './resources';

// Articles Domain
export * from './articles';

// Users Domain
export * from './users';

// Future domains will be added here:
// export * from './gamification';
