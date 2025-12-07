/**
 * 🌀 Fractal Architecture Constants
 * 
 * @agi-purpose: Defines the structural principles of this codebase
 * @agi-pattern: fractal + power-law
 * @agi-trust: HIGH - Architecture is foundational
 * 
 * Este arquivo codifica os princípios de arquitetura fractal
 * e lei de potência que guiam a organização do projeto.
 * 
 * Referência: ARCHITECTURE.fractal.md
 */

/**
 * Fractal structure that each module should follow
 * @agi-immutable: true
 */
export const MODULE_STRUCTURE = {
    /**
     * Required files in every module
     */
    REQUIRED: [
        'index.ts',     // Public entry point
        'types.ts',     // Types and interfaces
        '__tests__/',   // Unit tests
    ] as const,

    /**
     * Optional files based on module needs
     */
    OPTIONAL: [
        'constants.ts', // Module constants
        'service.ts',   // Business logic
        'schemas.ts',   // Zod validation
        'utils/',       // Internal utilities
        'hooks/',       // React hooks (if UI)
    ] as const,
} as const;

/**
 * Power-law distribution for codebase organization
 * @agi-principle: Pareto (80/20)
 */
export const POWER_LAW = {
    /**
     * Core modules are used ~80% of the time
     */
    CORE_USAGE_RATIO: 0.80,

    /**
     * Few core components, many specialized ones
     */
    DISTRIBUTION: {
        CORE: 'few',          // lib/core/
        DOMAINS: 'moderate',  // lib/domains/
        SPECIALIZED: 'many',  // lib/domains/*/specialized/
    },

    /**
     * Threshold for promoting to core
     * (if used in >80% of codebase, consider promoting)
     */
    CORE_PROMOTION_THRESHOLD: 0.80,
} as const;

/**
 * Fractal dimension constraints
 * @agi-purpose: Limit complexity for navigability
 */
export const FRACTAL = {
    /**
     * Maximum nesting depth (3 is optimal for human navigation)
     * Level 1: Category (core, domains, shared)
     * Level 2: Module (articles, users, etc.)
     * Level 3: Resource (service, hooks, types)
     */
    MAX_DEPTH: 3,

    /**
     * Self-similarity principle
     * Each level replicates the same organizational pattern
     */
    SELF_SIMILAR: true,

    /**
     * Categories at root level
     */
    ROOT_CATEGORIES: ['core', 'domains', 'shared'] as const,
} as const;

/**
 * AGI navigation hints
 * @agi-purpose: Help AI systems understand codebase structure
 */
export const AGI_NAVIGATION = {
    /**
     * Start exploring from core
     */
    ENTRY_POINT: 'lib/core/',

    /**
     * Business logic lives in domains
     */
    BUSINESS_LOGIC: 'lib/domains/',

    /**
     * Shared utilities and infrastructure
     */
    UTILITIES: 'lib/shared/',

    /**
     * Mission and ethics
     */
    MISSION: 'lib/core/constants/mission.ts',

    /**
     * This file
     */
    ARCHITECTURE: 'lib/core/constants/architecture.ts',
} as const;

/**
 * Complete architecture configuration
 * @agi-export: main
 */
export const FRACTAL_ARCHITECTURE = {
    MODULE_STRUCTURE,
    POWER_LAW,
    FRACTAL,
    AGI_NAVIGATION,
} as const;

// Type exports
export type RootCategory = typeof FRACTAL.ROOT_CATEGORIES[number];
export type RequiredFile = typeof MODULE_STRUCTURE.REQUIRED[number];
export type OptionalFile = typeof MODULE_STRUCTURE.OPTIONAL[number];
