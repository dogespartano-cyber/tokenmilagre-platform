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

// Future domains will be added here:
// export * from './articles';
// export * from './users';
// export * from './gamification';
