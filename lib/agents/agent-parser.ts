/**
 * Agent Parser
 *
 * Utilitário para fazer parse de arquivos de agents (.md com YAML frontmatter)
 * e extrair metadados estruturados.
 *
 * @module lib/agents/agent-parser
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AgentMetadata {
    type: 'agent' | 'meta-agent' | 'workflow' | 'core-dna' | string;
    name?: string;
    role?: string;
    version?: string;
    trigger?: string;
    inherits?: string;
    collaborates?: string[];
    escalatesTo?: string | null;
    trustLevel?: string;
    priority?: string;
    tags?: string[];
    aliases?: string[];
    lastVerified?: string;
    source?: string;
    description?: string;
}

export interface AgentDefinition {
    /** Nome do agent (extraído do filename ou frontmatter) */
    name: string;
    /** Path absoluto do arquivo */
    filePath: string;
    /** Tipo do agent */
    type: AgentMetadata['type'];
    /** De qual agent herda valores */
    inherits: string | null;
    /** Lista de agents com quem colabora */
    collaborates: string[];
    /** Para qual agent escala decisões */
    escalatesTo: string | null;
    /** Triggers que ativam este agent */
    triggers: string[];
    /** Data da última verificação */
    lastVerified: Date | null;
    /** SHA256 hash do conteúdo para rastreabilidade blockchain-like */
    hash: string;
    /** Conteúdo raw do frontmatter */
    rawFrontmatter: AgentMetadata;
    /** Tamanho do arquivo em bytes */
    sizeBytes: number;
    /** Número de linhas */
    lineCount: number;
}

export interface ParseResult {
    success: boolean;
    agent?: AgentDefinition;
    error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---/;
const YAML_KEY_VALUE_REGEX = /^(\s*)([a-zA-Z_-]+):\s*(.*)$/;

// ─────────────────────────────────────────────────────────────────────────────
// Parser Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse YAML frontmatter de forma simplificada (sem dependência externa)
 * Suporta valores simples, arrays inline e arrays multi-linha
 */
export function parseYamlFrontmatter(content: string): AgentMetadata | null {
    const match = content.match(FRONTMATTER_REGEX);
    if (!match) return null;

    const yamlContent = match[1];
    const lines = yamlContent.split('\n');
    const result: Record<string, unknown> = {};

    let currentKey: string | null = null;
    let currentArray: string[] | null = null;

    for (const line of lines) {
        // Linha vazia
        if (!line.trim()) continue;

        // Array item (começa com -)
        if (line.trim().startsWith('-') && currentKey && currentArray) {
            const value = line.trim().slice(1).trim();
            if (value) {
                currentArray.push(value);
            }
            continue;
        }

        // Key-value pair
        const keyMatch = line.match(YAML_KEY_VALUE_REGEX);
        if (keyMatch) {
            // Salvar array anterior se existir
            if (currentKey && currentArray) {
                result[currentKey] = currentArray;
                currentArray = null;
            }

            const [, _indent, key, rawValue] = keyMatch;
            const value = rawValue.trim();

            // Converter camelCase para YAML key
            const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

            // Array inline [item1, item2]
            if (value.startsWith('[') && value.endsWith(']')) {
                const items = value
                    .slice(1, -1)
                    .split(',')
                    .map((s) => s.trim().replace(/^["']|["']$/g, ''))
                    .filter(Boolean);
                result[camelKey] = items;
                currentKey = null;
            }
            // Valor vazio (pode ser início de array multi-linha)
            else if (!value) {
                currentKey = camelKey;
                currentArray = [];
            }
            // Valor null explícito
            else if (value === 'null') {
                result[camelKey] = null;
                currentKey = null;
            }
            // Valor boolean
            else if (value === 'true' || value === 'false') {
                result[camelKey] = value === 'true';
                currentKey = null;
            }
            // Valor string (remover quotes se existirem)
            else {
                result[camelKey] = value.replace(/^["']|["']$/g, '');
                currentKey = null;
            }
        }
    }

    // Salvar último array se existir
    if (currentKey && currentArray) {
        result[currentKey] = currentArray;
    }

    return result as AgentMetadata;
}

/**
 * Extrai triggers de múltiplas fontes no frontmatter
 */
function extractTriggers(metadata: AgentMetadata): string[] {
    const triggers: string[] = [];

    // Trigger único
    if (metadata.trigger) {
        // Pode ser múltiplos triggers separados por vírgula
        const parts = metadata.trigger.split(',').map((s) => s.trim());
        triggers.push(...parts);
    }

    // Aliases também podem ser triggers
    if (metadata.aliases) {
        triggers.push(...metadata.aliases);
    }

    return [...new Set(triggers)]; // Remove duplicatas
}

/**
 * Gera hash SHA256 do conteúdo para rastreabilidade
 */
export function generateContentHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Parse completo de um arquivo de agent
 */
export function parseAgentFile(filePath: string): ParseResult {
    try {
        // Verificar se arquivo existe
        if (!fs.existsSync(filePath)) {
            return { success: false, error: `Arquivo não encontrado: ${filePath}` };
        }

        // Ler conteúdo
        const content = fs.readFileSync(filePath, 'utf-8');
        const stats = fs.statSync(filePath);

        // Parse frontmatter
        const metadata = parseYamlFrontmatter(content);
        if (!metadata) {
            return { success: false, error: `Frontmatter YAML não encontrado em: ${filePath}` };
        }

        // Extrair nome do arquivo (sem extensão e sufixo "-agent")
        const filename = path.basename(filePath, '.md');
        const name = metadata.name || filename.replace(/-agent$/, '').toUpperCase();

        // Construir definição do agent
        const agent: AgentDefinition = {
            name,
            filePath,
            type: metadata.type || 'unknown',
            inherits: metadata.inherits || null,
            collaborates: Array.isArray(metadata.collaborates)
                ? metadata.collaborates
                : metadata.collaborates
                    ? [metadata.collaborates]
                    : [],
            escalatesTo: metadata.escalatesTo !== undefined ? metadata.escalatesTo : null,
            triggers: extractTriggers(metadata),
            lastVerified: metadata.lastVerified ? new Date(metadata.lastVerified) : null,
            hash: generateContentHash(content),
            rawFrontmatter: metadata,
            sizeBytes: stats.size,
            lineCount: content.split('\n').length,
        };

        return { success: true, agent };
    } catch (error) {
        return {
            success: false,
            error: `Erro ao fazer parse de ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}

/**
 * Valida se um parse result é bem-sucedido e tem um agent
 */
export function isValidParseResult(result: ParseResult): result is ParseResult & { agent: AgentDefinition } {
    return result.success && result.agent !== undefined;
}
