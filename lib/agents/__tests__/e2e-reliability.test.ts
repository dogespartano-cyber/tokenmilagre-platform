
import { flightRecorder } from '../flight-recorder';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * E2E Reliability Test
 * 
 * Este teste simula um ciclo completo de operação de um agente:
 * 1. O agente decide criar um arquivo (Simulado).
 * 2. O agente registra a intenção no Flight Recorder.
 * 3. O agente executa a ação (cria o arquivo).
 * 4. O sistema de verificação confirma a persistência do arquivo.
 * 5. O sistema de auditoria confirma o log no Flight Recorder.
 */

const TEST_ID = `e2e-${Date.now()}`;
const DUMMY_FILE = path.join(process.cwd(), 'Feedback', 'temp', `${TEST_ID}.txt`);
const LOG_FILE = path.join(process.cwd(), 'Feedback', 'logs', 'flight_data_recorder.jsonl');

async function runE2ETest() {
    console.log(`🚀 Starting E2E Reliability Test [ID: ${TEST_ID}]`);

    // Ensure temp dir exists
    const tempDir = path.dirname(DUMMY_FILE);
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    // --- PHASE 1: Agent Operation ---
    console.log('Phase 1: Agent Operation (Simulation)');

    // 1.1 Log Intent
    console.log('   -> Logging intent to Flight Recorder...');
    flightRecorder.log({
        agent: 'E2E_TESTER',
        intent: 'Create verification payload',
        tool: 'write_to_file',
        params: { file: DUMMY_FILE },
        result: 'success',
        trustScore: 10,
        timestamp: new Date().toISOString()
    });

    // 1.2 Execute Action
    console.log('   -> Executing action (writing file)...');
    fs.writeFileSync(DUMMY_FILE, `Verification Payload: ${TEST_ID}`);

    // --- PHASE 2: Verification (The "Anti-Hallucination" Check) ---
    console.log('Phase 2: Verification');

    // 2.1 Verify Persistence using our security script
    console.log('   -> Running verify-persistence.ts script...');
    try {
        const output = execSync(`npx tsx scripts/safety/verify-persistence.ts --file "Feedback/temp/${TEST_ID}.txt"`, {
            encoding: 'utf8',
            stdio: 'pipe' // Capture output
        });
        console.log('      [Script Output]:\n', output.trim().split('\n').map(l => `      ${l}`).join('\n'));

        if (!output.includes('VERIFICATION_PASSED')) {
            throw new Error('Persistence script did not return VERIFICATION_PASSED');
        }
    } catch (error) {
        console.error('      ❌ Persistence verification failed!');
        throw error;
    }

    // 2.2 Verify Flight Recorder Log
    console.log('   -> Auditing Flight Recorder logs...');
    if (!fs.existsSync(LOG_FILE)) {
        throw new Error('Flight recorder log file missing!');
    }

    const logs = fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n');
    const lastLog = JSON.parse(logs[logs.length - 1]);

    if (lastLog.agent === 'E2E_TESTER' && lastLog.params.file === DUMMY_FILE) {
        console.log('      ✅ Log entry found and verified.');
    } else {
        console.log('      ❌ Last log entry does not match expected test action.');
        console.log('      Last log:', lastLog);
        throw new Error('Log audit failed');
    }

    // --- CLEANUP ---
    console.log('Phase 3: Cleanup');
    fs.unlinkSync(DUMMY_FILE);
    console.log('   -> Test file removed.');

    console.log('\n✨ E2E TEST PASSED SUCCESSFULLY ✨');
}

runE2ETest().catch(err => {
    console.error('\n💥 E2E TEST FAILED:', err);
    process.exit(1);
});
