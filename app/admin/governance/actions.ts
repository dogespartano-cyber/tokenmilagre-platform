'use server';

import * as fs from 'fs';
import * as path from 'path';

export interface AuditEntry {
    agent: string;
    intent: string;
    trustScore: number;
    result: string;
    timestamp: string;
    _hash: string;
    _prevHash: string;
}

export async function getAuditTrail(): Promise<AuditEntry[]> {
    const logPath = path.join(process.cwd(), 'Feedback', 'logs', 'flight_data_recorder.jsonl');

    if (!fs.existsSync(logPath)) return [];

    const fileContent = fs.readFileSync(logPath, 'utf8');
    const lines = fileContent.trim().split('\n').reverse(); // Show newest first

    return lines
        .map(line => {
            try {
                return JSON.parse(line) as AuditEntry;
            } catch {
                return null;
            }
        })
        .filter((entry): entry is AuditEntry => entry !== null)
        .slice(0, 100); // Limit to last 100 entries for performance
}
