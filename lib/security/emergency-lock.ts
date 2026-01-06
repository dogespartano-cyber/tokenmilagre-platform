import { flightRecorder } from '../agents/flight-recorder';
import * as fs from 'fs';
import * as path from 'path';

/**
 * bloqueia o sistema em caso de emergência.
 * Implementa o protocolo "Digital Kill Switch" definido no DNA.
 */
export async function lockSystem(reason: string = "Emergency Lock Triggered"): Promise<void> {
    // 1. Auto-avaliação (Hardcoded para 10 pois é manual override)
    const trustScore = 10;

    // 2. Log no Flight Recorder (Antes de agir)
    flightRecorder.log({
        agent: 'SEGURANCA',
        intent: 'LOCK_SYSTEM_FULL',
        tool: 'lockSystem',
        params: { reason },
        result: 'success',
        trustScore
    });

    // 3. Executar Bloqueio (File System Lock)
    const lockFilePath = path.join(process.cwd(), 'emergency.lock');

    try {
        const lockContent = JSON.stringify({
            status: 'LOCKED',
            reason,
            timestamp: new Date().toISOString(),
            by: 'SEGURANCA'
        }, null, 2);

        fs.writeFileSync(lockFilePath, lockContent);

        console.error(`\n🚨🚨🚨 SYSTEM LOCKED: ${reason} 🚨🚨🚨\n`);

    } catch (error) {
        // Log falha se não conseguir escrever
        flightRecorder.log({
            agent: 'SEGURANCA',
            intent: 'LOCK_SYSTEM_FAILURE',
            tool: 'lockSystem',
            params: { error: String(error) },
            result: 'failure',
            trustScore
        });
        throw error;
    }
}
