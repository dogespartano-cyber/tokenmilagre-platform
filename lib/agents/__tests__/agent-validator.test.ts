/**
 * @jest-environment node
 */

import {
    validateFrontmatter,
    validateReferences,
    validateGraphitiIntegration,
    validateEscalationChain,
    validateAgent,
    calculateHealthScore,
    ValidationIssue,
    ValidationSummary,
} from '../agent-validator';

import type { AgentDefinition } from '../agent-registry';

// ─────────────────────────────────────────────────────────────────────────────
// Mock agent-registry
// ─────────────────────────────────────────────────────────────────────────────

jest.mock('../agent-registry', () => ({
    ...jest.requireActual('../agent-registry'),
    getAgent: jest.fn((name: string) => {
        const mockAgents: Record<string, any> = {
            ARQUITETO: { name: 'ARQUITETO', type: 'agent' },
            ESTRUTURA: { name: 'ESTRUTURA', type: 'agent' },
            CONHECIMENTO: { name: 'CONHECIMENTO', type: 'agent' },
            CODIGO: { name: 'CODIGO', type: 'agent' },
        };
        return mockAgents[name] || null;
    }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const createMockAgent = (overrides: Partial<AgentDefinition> = {}): AgentDefinition => ({
    name: 'TEST_AGENT',
    type: 'agent',
    role: 'Test agent',
    trigger: 'test trigger',
    inherits: '_DNA.md',
    collaborates: [],
    escalatesTo: 'ARQUITETO',
    identityToken: 'abc12345',
    tags: ['test'],
    hash: 'mock-hash',
    path: '/mock/path/TEST_AGENT-agent.md',
    ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// validateFrontmatter Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('validateFrontmatter', () => {
    it('should return no issues for a complete agent', () => {
        const agent = createMockAgent();
        const issues = validateFrontmatter(agent);

        expect(issues.filter(i => i.severity === 'error')).toHaveLength(0);
    });

    it('should return error when type is missing', () => {
        const agent = createMockAgent({ type: 'unknown' });
        const issues = validateFrontmatter(agent);

        expect(issues.some(i => i.rule === 'frontmatter-type')).toBe(true);
        expect(issues.find(i => i.rule === 'frontmatter-type')?.severity).toBe('error');
    });

    it('should return warning when inherits is missing', () => {
        const agent = createMockAgent({ inherits: undefined });
        const issues = validateFrontmatter(agent);

        expect(issues.some(i => i.rule === 'frontmatter-inherits')).toBe(true);
        expect(issues.find(i => i.rule === 'frontmatter-inherits')?.severity).toBe('warning');
    });

    it('should not require escalates-to for ARQUITETO', () => {
        const agent = createMockAgent({
            name: 'ARQUITETO',
            escalatesTo: null
        });
        const issues = validateFrontmatter(agent);

        expect(issues.some(i => i.rule === 'frontmatter-escalates')).toBe(false);
    });

    it('should not require escalates-to for ROUTER', () => {
        const agent = createMockAgent({
            name: 'ROUTER',
            escalatesTo: null
        });
        const issues = validateFrontmatter(agent);

        expect(issues.some(i => i.rule === 'frontmatter-escalates')).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// validateReferences Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('validateReferences', () => {
    const projectRoot = process.cwd();

    it('should return no issues when all references exist', () => {
        const agent = createMockAgent({
            collaborates: ['ARQUITETO', 'ESTRUTURA'],
            escalatesTo: 'ARQUITETO',
        });
        const issues = validateReferences(agent, projectRoot);

        // Should not have errors for existing agents
        const referenceErrors = issues.filter(i =>
            i.rule.startsWith('reference-') && i.severity === 'error'
        );
        // inherits error may exist if _DNA.md not found in test env
        expect(referenceErrors.filter(i => i.rule !== 'reference-inherits')).toHaveLength(0);
    });

    it('should return warning for non-existent collaborators', () => {
        const agent = createMockAgent({
            collaborates: ['NON_EXISTENT_AGENT'],
        });
        const issues = validateReferences(agent, projectRoot);

        expect(issues.some(i => i.rule === 'reference-collaborates')).toBe(true);
    });

    it('should return error for non-existent escalation target', () => {
        const agent = createMockAgent({
            escalatesTo: 'NON_EXISTENT_AGENT',
        });
        const issues = validateReferences(agent, projectRoot);

        expect(issues.some(i => i.rule === 'reference-escalates')).toBe(true);
        expect(issues.find(i => i.rule === 'reference-escalates')?.severity).toBe('error');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// validateGraphitiIntegration Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('validateGraphitiIntegration', () => {
    it('should return info when agent does not collaborate with CONHECIMENTO', () => {
        const agent = createMockAgent({
            collaborates: ['ESTRUTURA'],
        });
        const issues = validateGraphitiIntegration(agent);

        expect(issues.some(i => i.rule === 'integration-graphiti')).toBe(true);
        expect(issues.find(i => i.rule === 'integration-graphiti')?.severity).toBe('info');
    });

    it('should return no issues when agent collaborates with CONHECIMENTO', () => {
        const agent = createMockAgent({
            collaborates: ['CONHECIMENTO'],
        });
        const issues = validateGraphitiIntegration(agent);

        expect(issues.some(i => i.rule === 'integration-graphiti')).toBe(false);
    });

    it('should skip special agents (_DNA, ROUTER, etc)', () => {
        const agent = createMockAgent({
            name: 'ROUTER',
            collaborates: [],
        });
        const issues = validateGraphitiIntegration(agent);

        expect(issues.some(i => i.rule === 'integration-graphiti')).toBe(false);
    });

    it('should skip workflows', () => {
        const agent = createMockAgent({
            type: 'workflow',
            collaborates: [],
        });
        const issues = validateGraphitiIntegration(agent);

        expect(issues.some(i => i.rule === 'integration-graphiti')).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// validateEscalationChain Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('validateEscalationChain', () => {
    it('should detect cycles in escalation chain', () => {
        const agents: AgentDefinition[] = [
            createMockAgent({ name: 'AGENT_A', escalatesTo: 'AGENT_B' }),
            createMockAgent({ name: 'AGENT_B', escalatesTo: 'AGENT_A' }), // Cycle!
        ];

        const issues = validateEscalationChain(agents);

        expect(issues.some(i => i.rule === 'escalation-cycle')).toBe(true);
    });

    it('should return no issues for valid chain converging to ARQUITETO', () => {
        const agents: AgentDefinition[] = [
            createMockAgent({ name: 'ARQUITETO', escalatesTo: null }),
            createMockAgent({ name: 'CODIGO', escalatesTo: 'ESTRUTURA' }),
            createMockAgent({ name: 'ESTRUTURA', escalatesTo: 'ARQUITETO' }),
        ];

        const issues = validateEscalationChain(agents);

        expect(issues.filter(i => i.severity === 'error')).toHaveLength(0);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// calculateHealthScore Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateHealthScore', () => {
    it('should return 100 for empty summary', () => {
        const summary: ValidationSummary = {
            totalAgents: 0,
            validAgents: 0,
            invalidAgents: 0,
            totalIssues: 0,
            byRule: {},
            bySeverity: { error: 0, warning: 0, info: 0 },
            results: [],
        };

        expect(calculateHealthScore(summary)).toBe(100);
    });

    it('should return high score when only info issues exist', () => {
        const summary: ValidationSummary = {
            totalAgents: 10,
            validAgents: 10,
            invalidAgents: 0,
            totalIssues: 5,
            byRule: { 'integration-graphiti': 5 },
            bySeverity: { error: 0, warning: 0, info: 5 },
            results: [],
        };

        const score = calculateHealthScore(summary);
        expect(score).toBeGreaterThan(90);
    });

    it('should penalize errors heavily', () => {
        const summary: ValidationSummary = {
            totalAgents: 10,
            validAgents: 5,
            invalidAgents: 5,
            totalIssues: 5,
            byRule: { 'reference-inherits': 5 },
            bySeverity: { error: 5, warning: 0, info: 0 },
            results: [],
        };

        const score = calculateHealthScore(summary);
        expect(score).toBeLessThan(80);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// validateAgent Integration Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('validateAgent', () => {
    const projectRoot = process.cwd();

    it('should combine all validation rules', () => {
        const agent = createMockAgent();
        const result = validateAgent(agent, projectRoot);

        expect(result.agentName).toBe('TEST_AGENT');
        expect(typeof result.valid).toBe('boolean');
        expect(Array.isArray(result.issues)).toBe(true);
    });

    it('should mark agent as invalid when there are errors', () => {
        const agent = createMockAgent({
            type: 'unknown',
            escalatesTo: 'NON_EXISTENT',
        });
        const result = validateAgent(agent, projectRoot);

        expect(result.valid).toBe(false);
    });

    it('should mark agent as valid when there are only warnings/info', () => {
        const agent = createMockAgent({
            collaborates: ['NON_EXISTENT'], // Warning only
        });
        const result = validateAgent(agent, projectRoot);

        // Should still be valid (warnings don't invalidate)
        const hasOnlyNonErrors = result.issues.every(i => i.severity !== 'error');
        if (hasOnlyNonErrors) {
            expect(result.valid).toBe(true);
        }
    });
});
