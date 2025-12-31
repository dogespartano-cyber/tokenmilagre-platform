/**
 * Agent Module Index
 *
 * Exporta todas as funções e tipos do módulo de agents.
 *
 * @module lib/agents
 */

// Parser
export {
    parseAgentFile,
    parseYamlFrontmatter,
    generateContentHash,
    isValidParseResult,
    type AgentMetadata,
    type AgentDefinition,
    type ParseResult,
} from './agent-parser';

// Registry
export {
    loadAgentRegistry,
    getAgent,
    filterAgents,
    listAllAgents,
    getRegistryStats,
    invalidateCache,
    buildDependencyMap,
    findProjectRoot,
    listAgentFiles,
    type AgentRegistry,
    type RegistryStats,
    type RegistryFilter,
} from './agent-registry';

// Validator
export {
    validateAgent,
    validateAllAgents,
    validateFrontmatter,
    validateReferences,
    validateGraphitiIntegration,
    validateEscalationChain,
    calculateHealthScore,
    type ValidationIssue,
    type ValidationResult,
    type ValidationSummary,
    type ValidationSeverity,
} from './agent-validator';

// Integrity Tracker
export {
    createSnapshot,
    diffSnapshots,
    createIntegrityChain,
    verifyChainIntegrity,
    verifyAgentsAgainstChain,
    saveSnapshot,
    loadLatestSnapshot,
    loadSnapshotHistory,
    hashBlock,
    hashSnapshot,
    type IntegrityBlock,
    type IntegrityChain,
    type IntegrityDiff,
    type IntegritySnapshot,
} from './integrity-tracker';

// Health Dashboard
export {
    generateHealthReport,
    printHealthReport,
    runHealthCheck,
    type HealthMetrics,
    type RegistryMetrics,
    type ValidationMetrics,
    type IntegrityMetrics,
    type GraphitiMetrics,
    type HealthReport,
} from './health-dashboard';
