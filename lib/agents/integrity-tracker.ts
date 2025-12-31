/**
 * Integrity Tracker
 *
 * Sistema blockchain-like para rastrear mudanças nos agents.
 * Cada agent tem um hash do seu conteúdo, e mantemos histórico
 * de mudanças para garantir integridade e rastreabilidade.
 *
 * @module lib/agents/integrity-tracker
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { AgentDefinition, loadAgentRegistry, listAllAgents, invalidateCache } from './agent-registry';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface IntegrityBlock {
    /** Nome do agent */
    agentName: string;
    /** Hash SHA256 do conteúdo atual */
    hash: string;
    /** Hash do bloco anterior (para encadeamento) */
    previousHash: string;
    /** Timestamp da verificação */
    timestamp: Date;
    /** Tipo do agent */
    type: string;
    /** Tamanho em bytes */
    sizeBytes: number;
}

export interface IntegrityChain {
    /** Hash do bloco gênesis (primeiro registro) */
    genesisHash: string;
    /** Hash do último bloco */
    headHash: string;
    /** Todos os blocos na cadeia */
    blocks: IntegrityBlock[];
    /** Timestamp da criação da cadeia */
    createdAt: Date;
    /** Timestamp da última atualização */
    updatedAt: Date;
}

export interface IntegrityDiff {
    agentName: string;
    oldHash: string;
    newHash: string;
    changeType: 'added' | 'modified' | 'removed';
}

export interface IntegritySnapshot {
    /** Hash único do snapshot */
    snapshotHash: string;
    /** Timestamp do snapshot */
    timestamp: Date;
    /** Mapa de agent -> hash */
    hashes: Record<string, string>;
    /** Total de agents no snapshot */
    agentCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const GENESIS_HASH = '0'.repeat(64); // Hash inicial da cadeia
const INTEGRITY_FILE = 'Feedback/logs/agent-integrity.json';

// ─────────────────────────────────────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gera hash SHA256 de um objeto (para blocos encadeados)
 */
export function hashBlock(block: Omit<IntegrityBlock, 'hash'>): string {
    const content = JSON.stringify({
        agentName: block.agentName,
        previousHash: block.previousHash,
        timestamp: block.timestamp.toISOString(),
        type: block.type,
        sizeBytes: block.sizeBytes,
    });
    return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Gera hash de um snapshot inteiro
 */
export function hashSnapshot(hashes: Record<string, string>): string {
    const sortedKeys = Object.keys(hashes).sort();
    const content = sortedKeys.map((k) => `${k}:${hashes[k]}`).join('|');
    return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Cria um snapshot do estado atual de todos os agents
 */
export function createSnapshot(projectRoot?: string): IntegritySnapshot {
    invalidateCache();
    const registry = loadAgentRegistry(projectRoot);
    const agents = listAllAgents(registry);

    const hashes: Record<string, string> = {};
    for (const agent of agents) {
        hashes[agent.name] = agent.hash;
    }

    return {
        snapshotHash: hashSnapshot(hashes),
        timestamp: new Date(),
        hashes,
        agentCount: agents.length,
    };
}

/**
 * Compara dois snapshots e retorna as diferenças
 */
export function diffSnapshots(oldSnapshot: IntegritySnapshot, newSnapshot: IntegritySnapshot): IntegrityDiff[] {
    const diffs: IntegrityDiff[] = [];

    const allAgents = new Set([...Object.keys(oldSnapshot.hashes), ...Object.keys(newSnapshot.hashes)]);

    for (const agentName of allAgents) {
        const oldHash = oldSnapshot.hashes[agentName];
        const newHash = newSnapshot.hashes[agentName];

        if (!oldHash && newHash) {
            diffs.push({ agentName, oldHash: '', newHash, changeType: 'added' });
        } else if (oldHash && !newHash) {
            diffs.push({ agentName, oldHash, newHash: '', changeType: 'removed' });
        } else if (oldHash !== newHash) {
            diffs.push({ agentName, oldHash, newHash, changeType: 'modified' });
        }
    }

    return diffs;
}

/**
 * Cria cadeia de integridade a partir do estado atual
 */
export function createIntegrityChain(projectRoot?: string): IntegrityChain {
    invalidateCache();
    const registry = loadAgentRegistry(projectRoot);
    const agents = listAllAgents(registry);

    const blocks: IntegrityBlock[] = [];
    let previousHash = GENESIS_HASH;

    // Ordenar agents por nome para consistência
    const sortedAgents = [...agents].sort((a, b) => a.name.localeCompare(b.name));

    for (const agent of sortedAgents) {
        const blockWithoutHash: Omit<IntegrityBlock, 'hash'> = {
            agentName: agent.name,
            previousHash,
            timestamp: new Date(),
            type: agent.type,
            sizeBytes: agent.sizeBytes,
        };

        const block: IntegrityBlock = {
            ...blockWithoutHash,
            hash: agent.hash, // Usamos o hash do conteúdo como hash do bloco
        };

        blocks.push(block);
        previousHash = block.hash;
    }

    const now = new Date();
    return {
        genesisHash: GENESIS_HASH,
        headHash: previousHash,
        blocks,
        createdAt: now,
        updatedAt: now,
    };
}

/**
 * Verifica integridade da cadeia (nenhum bloco foi adulterado)
 */
export function verifyChainIntegrity(chain: IntegrityChain): { valid: boolean; brokenAt?: string } {
    let expectedPrevious = GENESIS_HASH;

    for (const block of chain.blocks) {
        if (block.previousHash !== expectedPrevious) {
            return { valid: false, brokenAt: block.agentName };
        }
        expectedPrevious = block.hash;
    }

    return { valid: true };
}

/**
 * Verifica se agents atuais correspondem à cadeia salva
 */
export function verifyAgentsAgainstChain(
    chain: IntegrityChain,
    projectRoot?: string
): { valid: boolean; tamperedAgents: string[] } {
    invalidateCache();
    const registry = loadAgentRegistry(projectRoot);
    const agents = listAllAgents(registry);

    const agentHashMap = new Map(agents.map((a) => [a.name, a.hash]));
    const tamperedAgents: string[] = [];

    for (const block of chain.blocks) {
        const currentHash = agentHashMap.get(block.agentName);
        if (currentHash && currentHash !== block.hash) {
            tamperedAgents.push(block.agentName);
        }
    }

    return {
        valid: tamperedAgents.length === 0,
        tamperedAgents,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Persistence
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Salva snapshot em arquivo
 */
export function saveSnapshot(snapshot: IntegritySnapshot, projectRoot?: string): void {
    const root = projectRoot || process.cwd();
    const filePath = path.join(root, INTEGRITY_FILE);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Carregar histórico existente ou criar novo
    let history: IntegritySnapshot[] = [];
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            history = JSON.parse(content);
        } catch {
            history = [];
        }
    }

    // Adicionar novo snapshot
    history.push(snapshot);

    // Manter apenas últimos 100 snapshots
    if (history.length > 100) {
        history = history.slice(-100);
    }

    fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
}

/**
 * Carrega último snapshot salvo
 */
export function loadLatestSnapshot(projectRoot?: string): IntegritySnapshot | null {
    const root = projectRoot || process.cwd();
    const filePath = path.join(root, INTEGRITY_FILE);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const history: IntegritySnapshot[] = JSON.parse(content);
        return history.length > 0 ? history[history.length - 1] : null;
    } catch {
        return null;
    }
}

/**
 * Carrega todo o histórico de snapshots
 */
export function loadSnapshotHistory(projectRoot?: string): IntegritySnapshot[] {
    const root = projectRoot || process.cwd();
    const filePath = path.join(root, INTEGRITY_FILE);

    if (!fs.existsSync(filePath)) {
        return [];
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch {
        return [];
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI Entry Point
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
    try {
        console.log('\n⛓️  Integrity Tracker\n');

        // Criar snapshot atual
        const currentSnapshot = createSnapshot();
        console.log('📸 Current Snapshot:');
        console.log(`   Hash: ${currentSnapshot.snapshotHash.slice(0, 16)}...`);
        console.log(`   Agents: ${currentSnapshot.agentCount}`);
        console.log(`   Timestamp: ${currentSnapshot.timestamp.toISOString()}`);

        // Carregar último snapshot salvo
        const lastSnapshot = loadLatestSnapshot();

        if (lastSnapshot) {
            console.log('\n📜 Last Saved Snapshot:');
            console.log(`   Hash: ${lastSnapshot.snapshotHash.slice(0, 16)}...`);
            console.log(`   Agents: ${lastSnapshot.agentCount}`);
            console.log(`   Timestamp: ${lastSnapshot.timestamp}`);

            // Comparar
            const diffs = diffSnapshots(lastSnapshot, currentSnapshot);

            if (diffs.length === 0) {
                console.log('\n✅ No changes detected since last snapshot');
            } else {
                console.log(`\n🔄 Changes detected: ${diffs.length}`);
                for (const diff of diffs) {
                    const icon = diff.changeType === 'added' ? '➕' : diff.changeType === 'removed' ? '➖' : '✏️';
                    console.log(`   ${icon} ${diff.agentName} (${diff.changeType})`);
                }
            }
        } else {
            console.log('\n📝 No previous snapshot found');
        }

        // Verificar integridade da cadeia
        const chain = createIntegrityChain();
        const chainIntegrity = verifyChainIntegrity(chain);

        console.log('\n⛓️  Chain Integrity:');
        console.log(`   Valid: ${chainIntegrity.valid ? '✅' : '❌'}`);
        console.log(`   Blocks: ${chain.blocks.length}`);
        console.log(`   Head: ${chain.headHash.slice(0, 16)}...`);

        // Perguntar se deve salvar
        console.log('\n💾 Saving current snapshot...');
        saveSnapshot(currentSnapshot);
        console.log('   Saved to Feedback/logs/agent-integrity.json');
    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
