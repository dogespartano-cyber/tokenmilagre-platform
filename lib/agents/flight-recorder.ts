
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

/**
 * Tipos de eventos para o Flight Recorder
 */
export type FlightEvent = {
    agent: string;
    intent: string;
    tool: string;
    params: Record<string, unknown>;
    result: 'success' | 'failure';
    trustScore: number; // 0-10
    timestamp?: string;
};

/**
 * Log Entry imutável com Hash Chain
 */
interface FlightLogEntry extends FlightEvent {
    timestamp: string;
    _prevHash: string;
    _hash: string;
}

/**
 * Flight Recorder - Sistema de Caixa Preta para Agentes
 * Grava logs estruturados e imutáveis com encadeamento criptográfico (Blockchain-lite).
 */
export class FlightRecorder {
    private logPath: string;

    constructor(projectRoot: string = process.cwd()) {
        const logDir = path.join(projectRoot, 'Feedback', 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        this.logPath = path.join(logDir, 'flight_data_recorder.jsonl');
    }

    /**
     * Registra um evento crítico com hash chain
     */
    public log(event: FlightEvent): void {
        const prevHash = this.getLastHash();
        const timestamp = event.timestamp || new Date().toISOString();

        // Payload para hash inclui o hash anterior (Chain)
        const payload = JSON.stringify({ ...event, timestamp, _prevHash: prevHash });
        const hash = this.calculateHash(payload);

        const entry: FlightLogEntry = {
            ...event,
            timestamp,
            _prevHash: prevHash,
            _hash: hash
        };

        const line = JSON.stringify(entry) + '\n';
        fs.appendFileSync(this.logPath, line, 'utf8');

        // Se Trust Score for baixo, alerta no console
        if (event.trustScore < 6) {
            console.warn(`⚠️ [LOW TRUST ACTION] Agent ${event.agent} executed ${event.tool} with trust score ${event.trustScore}`);
        }
    }

    /**
     * Lê a última linha para obter o hash anterior (Genesis = '0000000000000000000000000000000000000000000000000000000000000000')
     */
    private getLastHash(): string {
        try {
            if (!fs.existsSync(this.logPath)) {
                return '0'.repeat(64); // Genesis Hash
            }

            const data = fs.readFileSync(this.logPath, 'utf8').trim();
            if (!data) return '0'.repeat(64);

            const lines = data.split('\n');
            const lastLine = lines[lines.length - 1];

            if (!lastLine) return '0'.repeat(64);

            const lastEntry = JSON.parse(lastLine);
            return lastEntry._hash || '0'.repeat(64);
        } catch (error) {
            console.warn("FlightRecorder: Failed to read previous hash, resetting chain.", error);
            return 'ERROR_CHAIN_BROKEN_' + Date.now();
        }
    }

    /**
     * Gera SHA-256 do payload
     */
    private calculateHash(payload: string): string {
        return crypto.createHash('sha256').update(payload).digest('hex');
    }
}

// Singleton para uso fácil
export const flightRecorder = new FlightRecorder();
