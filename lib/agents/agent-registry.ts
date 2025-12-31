/**
 * Agent Registry
 *
 * Índice "vivo" de todos os agents do ecossistema.
 * Mantém cache em memória e permite consultas estruturadas.
 *
 * @module lib/agents/agent-registry
 */

import * as fs from 'fs';
import * as path from 'path';
import { AgentDefinition, parseAgentFile, isValidParseResult } from './agent-parser';

// Re-export AgentDefinition for consumers
export type { AgentDefinition } from './agent-parser';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface RegistryStats {
    totalAgents: number;
    totalWorkflows: number;
    totalFiles: number;
    lastUpdated: Date;
    byType: Record<string, number>;
}

export interface AgentRegistry {
    agents: Map<string, AgentDefinition>;
    stats: RegistryStats;
}

export interface RegistryFilter {
    type?: string | string[];
    hasCollaborations?: boolean;
    inheritsFrom?: string;
    escalatesTo?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const AGENTS_DIR = '.agent/workflows';
const AGENT_FILE_PATTERN = /\.md$/;

// Cache global
let cachedRegistry: AgentRegistry | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL_MS = 60000; // 1 minuto

// ─────────────────────────────────────────────────────────────────────────────
// Registry Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Encontra o diretório raiz do projeto (onde está package.json)
 */
export function findProjectRoot(startPath?: string): string {
    let currentPath = startPath || process.cwd();

    while (currentPath !== '/') {
        if (fs.existsSync(path.join(currentPath, 'package.json'))) {
            return currentPath;
        }
        currentPath = path.dirname(currentPath);
    }

    throw new Error('Não foi possível encontrar a raiz do projeto (package.json)');
}

/**
 * Lista todos os arquivos .md no diretório de agents
 */
export function listAgentFiles(projectRoot?: string): string[] {
    const root = projectRoot || findProjectRoot();
    const agentsPath = path.join(root, AGENTS_DIR);

    if (!fs.existsSync(agentsPath)) {
        throw new Error(`Diretório de agents não encontrado: ${agentsPath}`);
    }

    const files = fs.readdirSync(agentsPath);
    return files
        .filter((f) => AGENT_FILE_PATTERN.test(f))
        .map((f) => path.join(agentsPath, f))
        .sort();
}

/**
 * Carrega todos os agents e constrói o registry
 */
export function loadAgentRegistry(projectRoot?: string, forceRefresh = false): AgentRegistry {
    const now = Date.now();

    // Retornar cache se válido
    if (!forceRefresh && cachedRegistry && now - cacheTimestamp < CACHE_TTL_MS) {
        return cachedRegistry;
    }

    const root = projectRoot || findProjectRoot();
    const files = listAgentFiles(root);

    const agents = new Map<string, AgentDefinition>();
    const byType: Record<string, number> = {};

    let agentCount = 0;
    let workflowCount = 0;

    for (const filePath of files) {
        const result = parseAgentFile(filePath);

        if (isValidParseResult(result)) {
            const agent = result.agent;
            agents.set(agent.name, agent);

            // Contagem por tipo
            byType[agent.type] = (byType[agent.type] || 0) + 1;

            // Contagem separada de agents vs workflows
            if (agent.type === 'agent' || agent.type === 'meta-agent') {
                agentCount++;
            } else if (agent.type === 'workflow') {
                workflowCount++;
            }
        }
    }

    const registry: AgentRegistry = {
        agents,
        stats: {
            totalAgents: agentCount,
            totalWorkflows: workflowCount,
            totalFiles: files.length,
            lastUpdated: new Date(),
            byType,
        },
    };

    // Atualizar cache
    cachedRegistry = registry;
    cacheTimestamp = now;

    return registry;
}

/**
 * Obtém um agent específico pelo nome
 */
export function getAgent(name: string, registry?: AgentRegistry): AgentDefinition | undefined {
    const reg = registry || loadAgentRegistry();
    return reg.agents.get(name) || reg.agents.get(name.toUpperCase());
}

/**
 * Filtra agents por critérios
 */
export function filterAgents(filter: RegistryFilter, registry?: AgentRegistry): AgentDefinition[] {
    const reg = registry || loadAgentRegistry();
    const agents = Array.from(reg.agents.values());

    return agents.filter((agent) => {
        // Filtro por tipo
        if (filter.type) {
            const types = Array.isArray(filter.type) ? filter.type : [filter.type];
            if (!types.includes(agent.type)) return false;
        }

        // Filtro por colaborações
        if (filter.hasCollaborations !== undefined) {
            const hasCollab = agent.collaborates.length > 0;
            if (hasCollab !== filter.hasCollaborations) return false;
        }

        // Filtro por herança
        if (filter.inheritsFrom) {
            if (agent.inherits !== filter.inheritsFrom) return false;
        }

        // Filtro por escalação
        if (filter.escalatesTo) {
            if (agent.escalatesTo !== filter.escalatesTo) return false;
        }

        return true;
    });
}

/**
 * Lista todos os agents (conveniente para iteração)
 */
export function listAllAgents(registry?: AgentRegistry): AgentDefinition[] {
    const reg = registry || loadAgentRegistry();
    return Array.from(reg.agents.values());
}

/**
 * Obtém estatísticas do registry
 */
export function getRegistryStats(registry?: AgentRegistry): RegistryStats {
    const reg = registry || loadAgentRegistry();
    return reg.stats;
}

/**
 * Invalida o cache (útil após modificações)
 */
export function invalidateCache(): void {
    cachedRegistry = null;
    cacheTimestamp = 0;
}

/**
 * Constrói mapa de dependências (quem colabora com quem)
 */
export function buildDependencyMap(
    registry?: AgentRegistry
): Map<string, { collaborates: string[]; escalatesTo: string | null; inherits: string | null }> {
    const reg = registry || loadAgentRegistry();
    const depMap = new Map<string, { collaborates: string[]; escalatesTo: string | null; inherits: string | null }>();

    for (const [name, agent] of reg.agents) {
        depMap.set(name, {
            collaborates: agent.collaborates,
            escalatesTo: agent.escalatesTo,
            inherits: agent.inherits,
        });
    }

    return depMap;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI Entry Point (quando executado diretamente)
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
    try {
        const registry = loadAgentRegistry();
        console.log('\n🗂️  Agent Registry Loaded\n');
        console.log('📊 Stats:');
        console.log(`   Total Files: ${registry.stats.totalFiles}`);
        console.log(`   Agents: ${registry.stats.totalAgents}`);
        console.log(`   Workflows: ${registry.stats.totalWorkflows}`);
        console.log(`   By Type:`, registry.stats.byType);
        console.log(`   Last Updated: ${registry.stats.lastUpdated.toISOString()}`);

        console.log('\n📋 Agents:');
        for (const agent of listAllAgents(registry)) {
            const collab = agent.collaborates.length > 0 ? ` → [${agent.collaborates.join(', ')}]` : '';
            const escala = agent.escalatesTo ? ` ↑ ${agent.escalatesTo}` : '';
            console.log(`   ${agent.name} (${agent.type})${collab}${escala}`);
        }
    } catch (error) {
        console.error('❌ Erro:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
