/**
 * @jest-environment node
 */

import { flightRecorder } from '../flight-recorder';
import * as fs from 'fs';
import * as path from 'path';

/**
 * E2E Reliability Test Suite
 * 
 * Testa ciclo completo de operação de um agente:
 * 1. Registro de intenção no Flight Recorder
 * 2. Execução de ação simulada
 * 3. Verificação de persistência
 * 4. Auditoria de logs
 */

const TEST_DIR = path.join(process.cwd(), 'Feedback', 'temp');
const LOG_FILE = path.join(process.cwd(), 'Feedback', 'logs', 'flight_data_recorder.jsonl');

// ─────────────────────────────────────────────────────────────────────────────
// Setup & Teardown
// ─────────────────────────────────────────────────────────────────────────────

beforeAll(() => {
    // Ensure temp dir exists
    if (!fs.existsSync(TEST_DIR)) {
        fs.mkdirSync(TEST_DIR, { recursive: true });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Flight Recorder Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Flight Recorder Integration', () => {
    const testId = `e2e-${Date.now()}`;
    const testFile = path.join(TEST_DIR, `${testId}.txt`);

    afterEach(() => {
        // Cleanup test files
        if (fs.existsSync(testFile)) {
            fs.unlinkSync(testFile);
        }
    });

    it('should log agent actions to Flight Recorder', () => {
        const logEntry = {
            agent: 'E2E_TESTER',
            intent: 'Create verification payload',
            tool: 'write_to_file',
            params: { file: testFile },
            result: 'success' as const,
            trustScore: 10,
            timestamp: new Date().toISOString()
        };

        // Log the action
        flightRecorder.log(logEntry);

        // Verify log file exists
        expect(fs.existsSync(LOG_FILE)).toBe(true);

        // Verify log entry was written
        const logs = fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n');
        const lastLogString = logs[logs.length - 1];

        // Should be valid JSON
        expect(() => JSON.parse(lastLogString)).not.toThrow();

        const lastLog = JSON.parse(lastLogString);
        expect(lastLog.agent).toBe('E2E_TESTER');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// File Persistence Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('File Persistence Verification', () => {
    const testId = `persist-${Date.now()}`;
    const testFile = path.join(TEST_DIR, `${testId}.txt`);

    afterEach(() => {
        if (fs.existsSync(testFile)) {
            fs.unlinkSync(testFile);
        }
    });

    it('should persist files to disk', () => {
        const content = `Verification Payload: ${testId}`;

        // Write file
        fs.writeFileSync(testFile, content);

        // File should exist
        expect(fs.existsSync(testFile)).toBe(true);

        // Content should match
        const read = fs.readFileSync(testFile, 'utf8');
        expect(read).toBe(content);
    });

    it('should track file modifications in the same session', () => {
        const content1 = 'Version 1';
        const content2 = 'Version 2';

        fs.writeFileSync(testFile, content1);
        const stat1 = fs.statSync(testFile);

        // Small delay to ensure different mtime
        const start = Date.now();
        while (Date.now() - start < 10) { /* wait */ }

        fs.writeFileSync(testFile, content2);
        const stat2 = fs.statSync(testFile);

        // File was modified
        expect(stat2.mtimeMs).toBeGreaterThanOrEqual(stat1.mtimeMs);
        expect(fs.readFileSync(testFile, 'utf8')).toBe(content2);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Agent System Integration Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Agent System E2E', () => {
    it('should complete full agent operation cycle', () => {
        const testId = `cycle-${Date.now()}`;
        const testFile = path.join(TEST_DIR, `${testId}.txt`);

        try {
            // Phase 1: Log intent
            flightRecorder.log({
                agent: 'E2E_CYCLE_TEST',
                intent: 'Full cycle test',
                tool: 'write_to_file',
                params: { file: testFile },
                result: 'success' as const,
                trustScore: 10,
                timestamp: new Date().toISOString()
            });

            // Phase 2: Execute action
            fs.writeFileSync(testFile, `Cycle Test: ${testId}`);

            // Phase 3: Verify persistence
            expect(fs.existsSync(testFile)).toBe(true);

            // Phase 4: Log completion
            flightRecorder.log({
                agent: 'E2E_CYCLE_TEST',
                intent: 'Full cycle test completed',
                tool: 'verify',
                params: { file: testFile, verified: true },
                result: 'success',
                trustScore: 10,
                timestamp: new Date().toISOString()
            });

            // Verify both logs exist
            const logs = fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n');
            const recentLogs = logs.slice(-2).map(l => JSON.parse(l));

            expect(recentLogs.some(l => l.agent === 'E2E_CYCLE_TEST')).toBe(true);
        } finally {
            // Cleanup
            if (fs.existsSync(testFile)) {
                fs.unlinkSync(testFile);
            }
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Error Handling Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Error Handling', () => {
    it('should handle non-existent file reads gracefully', () => {
        const nonExistent = path.join(TEST_DIR, 'does-not-exist.txt');

        expect(fs.existsSync(nonExistent)).toBe(false);
        expect(() => fs.readFileSync(nonExistent)).toThrow();
    });

    it('should create parent directories when needed', () => {
        const nestedDir = path.join(TEST_DIR, 'nested', 'deep', 'dir');
        const nestedFile = path.join(nestedDir, 'test.txt');

        try {
            // Create nested structure
            fs.mkdirSync(nestedDir, { recursive: true });
            fs.writeFileSync(nestedFile, 'test');

            expect(fs.existsSync(nestedFile)).toBe(true);
        } finally {
            // Cleanup
            if (fs.existsSync(nestedFile)) {
                fs.unlinkSync(nestedFile);
            }
            // Remove nested dirs
            if (fs.existsSync(nestedDir)) {
                fs.rmdirSync(nestedDir);
                fs.rmdirSync(path.dirname(nestedDir));
                fs.rmdirSync(path.dirname(path.dirname(nestedDir)));
            }
        }
    });
});
