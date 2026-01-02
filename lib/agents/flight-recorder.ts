
import * as fs from 'fs';
import * as path from 'path';

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
 * Flight Recorder - Sistema de Caixa Preta para Agentes
 * Grava logs estruturados e imutáveis das ações dos agentes.
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
     * Registra um evento crítico
     */
    public log(event: FlightEvent): void {
        const entry = {
            ...event,
            timestamp: event.timestamp || new Date().toISOString(),
            _integrity: this.generateIntegrityHash(event)
        };

        const line = JSON.stringify(entry) + '\n';
        fs.appendFileSync(this.logPath, line, 'utf8');

        // Se Trust Score for baixo, alerta no console
        if (event.trustScore < 6) {
            console.warn(`⚠️ [LOW TRUST ACTION] Agent ${event.agent} executed ${event.tool} with trust score ${event.trustScore}`);
        }
    }

    /**
     * Gera um hash simples para integridade (simulado para este exemplo)
     */
    private generateIntegrityHash(event: FlightEvent): string {
        return Buffer.from(JSON.stringify(event)).toString('base64').slice(0, 16);
    }
}

// Singleton para uso fácil
export const flightRecorder = new FlightRecorder();
