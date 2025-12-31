/**
 * Agent Parser Tests
 *
 * Testes unitários para o parser de agents.
 *
 * @jest-environment node
 */

import * as path from 'path';
import * as fs from 'fs';
import {
    parseYamlFrontmatter,
    parseAgentFile,
    generateContentHash,
    isValidParseResult,
    type AgentMetadata,
} from '../agent-parser';

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_FRONTMATTER = `---
type: agent
name: CODIGO
role: Code Reviewer
version: 1.0.0
inherits: _DNA.md
collaborates: [ESTRUTURA, SEGURANCA]
escalates-to: ESTRUTURA
tags:
  - code
  - review
  - typescript
aliases:
  - Code Agent
  - Reviewer
---

# CODIGO Agent

Content here...
`;

const SAMPLE_WORKFLOW_FRONTMATTER = `---
type: workflow
description: Test workflow
trigger: /test, "run test"
inherits: _DNA.md
---

# Test Workflow

Steps here...
`;

const SAMPLE_MINIMAL_FRONTMATTER = `---
type: agent
---

# Minimal Agent
`;

const INVALID_NO_FRONTMATTER = `
# Just Markdown

No frontmatter here.
`;

// ─────────────────────────────────────────────────────────────────────────────
// Tests: parseYamlFrontmatter
// ─────────────────────────────────────────────────────────────────────────────

describe('parseYamlFrontmatter', () => {
    it('should parse simple key-value pairs', () => {
        const result = parseYamlFrontmatter(SAMPLE_FRONTMATTER);

        expect(result).not.toBeNull();
        expect(result?.type).toBe('agent');
        expect(result?.name).toBe('CODIGO');
        expect(result?.role).toBe('Code Reviewer');
    });

    it('should parse inline arrays', () => {
        const result = parseYamlFrontmatter(SAMPLE_FRONTMATTER);

        expect(result?.collaborates).toEqual(['ESTRUTURA', 'SEGURANCA']);
    });

    it('should parse multi-line arrays', () => {
        const result = parseYamlFrontmatter(SAMPLE_FRONTMATTER);

        expect(result?.tags).toEqual(['code', 'review', 'typescript']);
        expect(result?.aliases).toEqual(['Code Agent', 'Reviewer']);
    });

    it('should convert kebab-case to camelCase', () => {
        const result = parseYamlFrontmatter(SAMPLE_FRONTMATTER);

        expect(result?.escalatesTo).toBe('ESTRUTURA');
    });

    it('should return null for content without frontmatter', () => {
        const result = parseYamlFrontmatter(INVALID_NO_FRONTMATTER);

        expect(result).toBeNull();
    });

    it('should handle minimal frontmatter', () => {
        const result = parseYamlFrontmatter(SAMPLE_MINIMAL_FRONTMATTER);

        expect(result).not.toBeNull();
        expect(result?.type).toBe('agent');
    });

    it('should parse workflow frontmatter with trigger', () => {
        const result = parseYamlFrontmatter(SAMPLE_WORKFLOW_FRONTMATTER);

        expect(result?.type).toBe('workflow');
        expect(result?.trigger).toContain('/test');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: generateContentHash
// ─────────────────────────────────────────────────────────────────────────────

describe('generateContentHash', () => {
    it('should generate consistent SHA256 hash', () => {
        const content = 'test content';
        const hash1 = generateContentHash(content);
        const hash2 = generateContentHash(content);

        expect(hash1).toBe(hash2);
        expect(hash1).toHaveLength(64); // SHA256 hex = 64 chars
    });

    it('should generate different hashes for different content', () => {
        const hash1 = generateContentHash('content A');
        const hash2 = generateContentHash('content B');

        expect(hash1).not.toBe(hash2);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: parseAgentFile
// ─────────────────────────────────────────────────────────────────────────────

describe('parseAgentFile', () => {
    const AGENTS_DIR = path.join(process.cwd(), '.agent', 'workflows');

    it('should parse ROUTER-agent.md successfully', () => {
        const filePath = path.join(AGENTS_DIR, 'ROUTER-agent.md');

        // Skip if file doesn't exist (e.g., running in CI without project files)
        if (!fs.existsSync(filePath)) {
            console.log('Skipping: ROUTER-agent.md not found');
            return;
        }

        const result = parseAgentFile(filePath);

        expect(result.success).toBe(true);
        expect(result.agent).toBeDefined();
        expect(result.agent?.name).toBe('ROUTER');
        expect(result.agent?.type).toBe('meta-agent');
    });

    it('should parse _DNA.md successfully', () => {
        const filePath = path.join(AGENTS_DIR, '_DNA.md');

        if (!fs.existsSync(filePath)) {
            console.log('Skipping: _DNA.md not found');
            return;
        }

        const result = parseAgentFile(filePath);

        expect(result.success).toBe(true);
        expect(result.agent?.type).toBe('core-dna');
    });

    it('should return error for non-existent file', () => {
        const result = parseAgentFile('/non/existent/file.md');

        expect(result.success).toBe(false);
        expect(result.error).toContain('não encontrado');
    });

    it('should generate hash for parsed agent', () => {
        const filePath = path.join(AGENTS_DIR, 'ROUTER-agent.md');

        if (!fs.existsSync(filePath)) {
            console.log('Skipping: hash test');
            return;
        }

        const result = parseAgentFile(filePath);

        expect(result.agent?.hash).toBeDefined();
        expect(result.agent?.hash).toHaveLength(64);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: isValidParseResult
// ─────────────────────────────────────────────────────────────────────────────

describe('isValidParseResult', () => {
    it('should return true for successful parse', () => {
        const result = {
            success: true,
            agent: {
                name: 'TEST',
                filePath: '/test.md',
                type: 'agent' as const,
                inherits: '_DNA.md',
                collaborates: [],
                escalatesTo: null,
                triggers: [],
                lastVerified: null,
                hash: 'abc123',
                rawFrontmatter: { type: 'agent' } as AgentMetadata,
                sizeBytes: 100,
                lineCount: 10,
            },
        };

        expect(isValidParseResult(result)).toBe(true);
    });

    it('should return false for failed parse', () => {
        const result = {
            success: false,
            error: 'Some error',
        };

        expect(isValidParseResult(result)).toBe(false);
    });
});
