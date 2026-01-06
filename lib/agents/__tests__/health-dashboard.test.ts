/**
 * @jest-environment node
 */

import {
    generateHealthReport,
    HealthReport,
    HealthMetrics,
    RegistryMetrics,
    ValidationMetrics,
    IntegrityMetrics,
    GraphitiMetrics,
} from '../health-dashboard';

// ─────────────────────────────────────────────────────────────────────────────
// Mock dependencies
// ─────────────────────────────────────────────────────────────────────────────

// Mock fetch for Graphiti health check
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

// Mock agent-registry
jest.mock('../agent-registry', () => ({
    loadAgentRegistry: jest.fn(() => ({
        agents: new Map([
            ['ROUTER', { name: 'ROUTER', type: 'agent' }],
            ['CODIGO', { name: 'CODIGO', type: 'agent' }],
        ]),
        workflows: new Map(),
    })),
    getRegistryStats: jest.fn(() => ({
        totalAgents: 2,
        totalWorkflows: 0,
        totalFiles: 2,
        byType: { agent: 2 },
    })),
    listAllAgents: jest.fn(() => [
        {
            name: 'ROUTER',
            type: 'agent',
            role: 'Router',
            trigger: 'test',
            inherits: '_DNA.md',
            collaborates: [],
            escalatesTo: null,
            identityToken: 'abc',
            tags: [],
            hash: 'x',
            path: '/test'
        },
    ]),
    invalidateCache: jest.fn(),
}));

// Mock agent-validator
jest.mock('../agent-validator', () => ({
    validateAllAgents: jest.fn(() => ({
        totalAgents: 2,
        validAgents: 2,
        invalidAgents: 0,
        totalIssues: 0,
        byRule: {},
        bySeverity: { error: 0, warning: 0, info: 0 },
        results: [],
    })),
    calculateHealthScore: jest.fn(() => 95),
}));

// Mock integrity-tracker
jest.mock('../integrity-tracker', () => ({
    createSnapshot: jest.fn(() => ({
        snapshotHash: 'test-hash',
        timestamp: new Date(),
        hashes: { ROUTER: 'hash1' },
        agentCount: 1,
    })),
    loadLatestSnapshot: jest.fn(() => null),
    diffSnapshots: jest.fn(() => []),
    createIntegrityChain: jest.fn(() => ({
        genesisHash: 'genesis',
        headHash: 'head',
        blocks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    })),
    verifyChainIntegrity: jest.fn(() => ({ valid: true })),
    saveSnapshot: jest.fn(),
}));

// ─────────────────────────────────────────────────────────────────────────────
// generateHealthReport Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('generateHealthReport', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        // Default: Graphiti online
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ status: 'healthy' }),
        });
    });

    it('should return a complete HealthReport structure', async () => {
        const report = await generateHealthReport();

        expect(report).toHaveProperty('health');
        expect(report).toHaveProperty('registry');
        expect(report).toHaveProperty('validation');
        expect(report).toHaveProperty('integrity');
        expect(report).toHaveProperty('graphiti');
        expect(report).toHaveProperty('recommendations');
    });

    it('should return health metrics with score and status', async () => {
        const report = await generateHealthReport();

        expect(typeof report.health.score).toBe('number');
        expect(['healthy', 'degraded', 'critical']).toContain(report.health.status);
        expect(report.health.timestamp).toBeInstanceOf(Date);
    });

    it('should return registry metrics', async () => {
        const report = await generateHealthReport();

        expect(typeof report.registry.totalAgents).toBe('number');
        expect(typeof report.registry.totalWorkflows).toBe('number');
        expect(typeof report.registry.totalFiles).toBe('number');
        expect(typeof report.registry.byType).toBe('object');
    });

    it('should return validation metrics', async () => {
        const report = await generateHealthReport();

        expect(typeof report.validation.validAgents).toBe('number');
        expect(typeof report.validation.invalidAgents).toBe('number');
        expect(typeof report.validation.totalIssues).toBe('number');
        expect(typeof report.validation.errors).toBe('number');
        expect(typeof report.validation.warnings).toBe('number');
        expect(typeof report.validation.infos).toBe('number');
    });

    it('should return integrity metrics', async () => {
        const report = await generateHealthReport();

        expect(typeof report.integrity.chainValid).toBe('boolean');
        expect(typeof report.integrity.blocksCount).toBe('number');
        expect(typeof report.integrity.snapshotHash).toBe('string');
        expect(typeof report.integrity.changesDetected).toBe('number');
        expect(Array.isArray(report.integrity.changesSinceLastSnapshot)).toBe(true);
    });

    it('should return graphiti metrics as online when fetch succeeds', async () => {
        const report = await generateHealthReport();

        expect(report.graphiti.status).toBe('online');
        expect(report.graphiti.lastCheck).toBeInstanceOf(Date);
    });

    it('should return graphiti metrics as offline when fetch fails', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

        const report = await generateHealthReport();

        expect(report.graphiti.status).toBe('offline');
    });

    it('should return recommendations array', async () => {
        const report = await generateHealthReport();

        expect(Array.isArray(report.recommendations)).toBe(true);
        expect(report.recommendations.length).toBeGreaterThan(0);
    });

    it('should interpret score >= 90 as healthy', async () => {
        // Mock returns score 95
        const report = await generateHealthReport();

        expect(report.health.score).toBe(95);
        expect(report.health.status).toBe('healthy');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Type Interface Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Type Interfaces', () => {
    it('should export HealthMetrics interface', () => {
        const metrics: HealthMetrics = {
            score: 100,
            status: 'healthy',
            timestamp: new Date(),
        };
        expect(metrics).toBeDefined();
    });

    it('should export RegistryMetrics interface', () => {
        const metrics: RegistryMetrics = {
            totalAgents: 10,
            totalWorkflows: 5,
            totalFiles: 15,
            byType: { agent: 10, workflow: 5 },
        };
        expect(metrics).toBeDefined();
    });

    it('should export ValidationMetrics interface', () => {
        const metrics: ValidationMetrics = {
            validAgents: 10,
            invalidAgents: 0,
            totalIssues: 0,
            errors: 0,
            warnings: 0,
            infos: 0,
        };
        expect(metrics).toBeDefined();
    });

    it('should export IntegrityMetrics interface', () => {
        const metrics: IntegrityMetrics = {
            chainValid: true,
            blocksCount: 10,
            snapshotHash: 'abc123',
            changesDetected: 0,
            changesSinceLastSnapshot: [],
        };
        expect(metrics).toBeDefined();
    });

    it('should export GraphitiMetrics interface', () => {
        const metrics: GraphitiMetrics = {
            status: 'online',
            lastCheck: new Date(),
        };
        expect(metrics).toBeDefined();
    });
});
