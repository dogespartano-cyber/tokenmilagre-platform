/**
 * Agent Registry Tests
 *
 * Testes unitários para o registry de agents.
 *
 * @jest-environment node
 */

import * as fs from 'fs';
import * as path from 'path';
import {
    loadAgentRegistry,
    getAgent,
    filterAgents,
    listAllAgents,
    getRegistryStats,
    invalidateCache,
    buildDependencyMap,
    findProjectRoot,
    listAgentFiles,
} from '../agent-registry';

// ─────────────────────────────────────────────────────────────────────────────
// Setup
// ─────────────────────────────────────────────────────────────────────────────

const AGENTS_DIR = path.join(process.cwd(), '.agent', 'workflows');
const hasAgentsDir = fs.existsSync(AGENTS_DIR);

// ─────────────────────────────────────────────────────────────────────────────
// Tests: findProjectRoot
// ─────────────────────────────────────────────────────────────────────────────

describe('findProjectRoot', () => {
    it('should find project root from current directory', () => {
        const root = findProjectRoot();

        expect(root).toBeDefined();
        expect(fs.existsSync(path.join(root, 'package.json'))).toBe(true);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: listAgentFiles
// ─────────────────────────────────────────────────────────────────────────────

describe('listAgentFiles', () => {
    it('should list all .md files in agents directory', () => {
        if (!hasAgentsDir) {
            console.log('Skipping: .agent/workflows not found');
            return;
        }

        const files = listAgentFiles();

        expect(files.length).toBeGreaterThan(0);
        expect(files.every((f) => f.endsWith('.md'))).toBe(true);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: loadAgentRegistry
// ─────────────────────────────────────────────────────────────────────────────

describe('loadAgentRegistry', () => {
    beforeEach(() => {
        invalidateCache();
    });

    it('should load all agents and workflows', () => {
        if (!hasAgentsDir) {
            console.log('Skipping: .agent/workflows not found');
            return;
        }

        const registry = loadAgentRegistry();

        expect(registry.agents.size).toBeGreaterThan(0);
        expect(registry.stats.totalFiles).toBeGreaterThan(0);
    });

    it('should have expected stats structure', () => {
        if (!hasAgentsDir) {
            console.log('Skipping stats test');
            return;
        }

        const registry = loadAgentRegistry();

        expect(registry.stats.totalAgents).toBeGreaterThanOrEqual(0);
        expect(registry.stats.totalWorkflows).toBeGreaterThanOrEqual(0);
        expect(registry.stats.lastUpdated).toBeInstanceOf(Date);
        expect(registry.stats.byType).toBeDefined();
    });

    it('should use cache on subsequent calls', () => {
        if (!hasAgentsDir) {
            console.log('Skipping cache test');
            return;
        }

        const registry1 = loadAgentRegistry();
        const registry2 = loadAgentRegistry();

        // Same reference (cached)
        expect(registry1).toBe(registry2);
    });

    it('should force refresh when requested', () => {
        if (!hasAgentsDir) {
            console.log('Skipping force refresh test');
            return;
        }

        const registry1 = loadAgentRegistry();
        const registry2 = loadAgentRegistry(undefined, true);

        // Different reference (refreshed)
        expect(registry1).not.toBe(registry2);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: getAgent
// ─────────────────────────────────────────────────────────────────────────────

describe('getAgent', () => {
    it('should get agent by name', () => {
        if (!hasAgentsDir) {
            console.log('Skipping getAgent test');
            return;
        }

        const agent = getAgent('ROUTER');

        expect(agent).toBeDefined();
        expect(agent?.name).toBe('ROUTER');
    });

    it('should get agent case-insensitively', () => {
        if (!hasAgentsDir) {
            console.log('Skipping case test');
            return;
        }

        const agent = getAgent('router');

        expect(agent).toBeDefined();
    });

    it('should return undefined for non-existent agent', () => {
        if (!hasAgentsDir) {
            console.log('Skipping non-existent test');
            return;
        }

        const agent = getAgent('NON_EXISTENT_AGENT');

        expect(agent).toBeUndefined();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: filterAgents
// ─────────────────────────────────────────────────────────────────────────────

describe('filterAgents', () => {
    it('should filter by type', () => {
        if (!hasAgentsDir) {
            console.log('Skipping filter test');
            return;
        }

        const agents = filterAgents({ type: 'agent' });

        expect(agents.length).toBeGreaterThan(0);
        expect(agents.every((a) => a.type === 'agent')).toBe(true);
    });

    it('should filter by multiple types', () => {
        if (!hasAgentsDir) {
            console.log('Skipping multi-type filter test');
            return;
        }

        const agents = filterAgents({ type: ['agent', 'meta-agent'] });

        expect(agents.length).toBeGreaterThan(0);
        expect(agents.every((a) => a.type === 'agent' || a.type === 'meta-agent')).toBe(true);
    });

    it('should filter by collaborations', () => {
        if (!hasAgentsDir) {
            console.log('Skipping collaboration filter test');
            return;
        }

        const withCollab = filterAgents({ hasCollaborations: true });
        const withoutCollab = filterAgents({ hasCollaborations: false });

        expect(withCollab.every((a) => a.collaborates.length > 0)).toBe(true);
        expect(withoutCollab.every((a) => a.collaborates.length === 0)).toBe(true);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: buildDependencyMap
// ─────────────────────────────────────────────────────────────────────────────

describe('buildDependencyMap', () => {
    it('should build map of all dependencies', () => {
        if (!hasAgentsDir) {
            console.log('Skipping dependency map test');
            return;
        }

        const depMap = buildDependencyMap();

        expect(depMap.size).toBeGreaterThan(0);

        // Check structure
        for (const [, deps] of depMap) {
            expect(Array.isArray(deps.collaborates)).toBe(true);
            expect(deps.escalatesTo === null || typeof deps.escalatesTo === 'string').toBe(true);
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: listAllAgents
// ─────────────────────────────────────────────────────────────────────────────

describe('listAllAgents', () => {
    it('should return array of all agents', () => {
        if (!hasAgentsDir) {
            console.log('Skipping list test');
            return;
        }

        const agents = listAllAgents();

        expect(Array.isArray(agents)).toBe(true);
        expect(agents.length).toBeGreaterThan(0);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: getRegistryStats
// ─────────────────────────────────────────────────────────────────────────────

describe('getRegistryStats', () => {
    it('should return stats object', () => {
        if (!hasAgentsDir) {
            console.log('Skipping stats test');
            return;
        }

        const stats = getRegistryStats();

        expect(stats.totalFiles).toBeGreaterThan(0);
        expect(stats.lastUpdated).toBeInstanceOf(Date);
        expect(typeof stats.byType).toBe('object');
    });
});
