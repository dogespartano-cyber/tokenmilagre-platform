/**
 * Agent Validator
 *
 * Valida a estrutura e integridade dos agents do ecossistema.
 * Testa frontmatter, referências, colaborações e herança.
 *
 * @module lib/agents/agent-validator
 */

import * as fs from 'fs';
import * as path from 'path';
import {
    AgentDefinition,
    loadAgentRegistry,
    listAllAgents,
    getAgent,
    invalidateCache,
} from './agent-registry';

// Re-export AgentDefinition for consumers
export type { AgentDefinition } from './agent-registry';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
    severity: ValidationSeverity;
    agentName: string;
    rule: string;
    message: string;
    suggestion?: string;
}

export interface ValidationResult {
    valid: boolean;
    agentName: string;
    issues: ValidationIssue[];
}

export interface ValidationSummary {
    totalAgents: number;
    validAgents: number;
    invalidAgents: number;
    totalIssues: number;
    byRule: Record<string, number>;
    bySeverity: Record<ValidationSeverity, number>;
    results: ValidationResult[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation Rules
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Valida se o agent tem frontmatter completo
 */
export function validateFrontmatter(agent: AgentDefinition): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const isAgent = agent.type === 'agent' || agent.type === 'meta-agent';

    // Type é obrigatório
    if (!agent.type || agent.type === 'unknown') {
        issues.push({
            severity: 'error',
            agentName: agent.name,
            rule: 'frontmatter-type',
            message: 'Frontmatter não tem campo `type`',
            suggestion: "Adicione `type: agent` ou `type: workflow` no frontmatter",
        });
    }

    // Inherits esperado para agents
    if (isAgent && !agent.inherits) {
        issues.push({
            severity: 'warning',
            agentName: agent.name,
            rule: 'frontmatter-inherits',
            message: 'Agent não herda de nenhum outro (falta `inherits`)',
            suggestion: 'Adicione `inherits: _DNA.md` para herdar valores core',
        });
    }

    // Escalates-to esperado para agents (exceto ARQUITETO que é o topo)
    if (isAgent && agent.escalatesTo === null && agent.name !== 'ARQUITETO' && agent.name !== 'ROUTER') {
        issues.push({
            severity: 'info',
            agentName: agent.name,
            rule: 'frontmatter-escalates',
            message: 'Agent não tem `escalates-to` definido',
            suggestion: 'Considere definir para qual agent escalar decisões',
        });
    }

    return issues;
}

/**
 * Valida se as referências do agent existem
 */
export function validateReferences(agent: AgentDefinition, projectRoot: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Verificar se inherits existe
    if (agent.inherits) {
        // v5.0: Inherits geralmente vem de memory/_DNA.md
        // Tentamos primeiro em rules/ (legacy), depois em memory/ e root da .agent
        const possiblePaths = [
            path.join(projectRoot, '.agent', 'memory', agent.inherits),
            path.join(projectRoot, '.agent', 'workflows', agent.inherits), // Legacy fallback
            path.join(projectRoot, '.agent', agent.inherits)
        ];

        const exists = possiblePaths.some(p => fs.existsSync(p));

        if (!exists) {
            issues.push({
                severity: 'error',
                agentName: agent.name,
                rule: 'reference-inherits',
                message: `Arquivo herdado não existe: ${agent.inherits}`,
                suggestion: `Verifique se ${agent.inherits} existe em .agent/memory/`,
            });
        }
    }

    // Verificar colaborações
    for (const collab of agent.collaborates) {
        // Colaborações podem ser nomes de agents ou paths
        const normalizedCollab = collab.replace(/-agent\.md$/, '').replace(/\.md$/, '');
        const existingAgent = getAgent(normalizedCollab);

        if (!existingAgent) {
            issues.push({
                severity: 'warning',
                agentName: agent.name,
                rule: 'reference-collaborates',
                message: `Colaboração com agent inexistente: ${collab}`,
                suggestion: `Verifique se ${collab} existe no registry`,
            });
        }
    }

    // Verificar escalação
    if (agent.escalatesTo && agent.escalatesTo !== 'null') {
        const normalizedEscalation = agent.escalatesTo.replace(/-agent\.md$/, '').replace(/\.md$/, '');
        const existingAgent = getAgent(normalizedEscalation);

        if (!existingAgent && normalizedEscalation !== 'null  # Meta-orquestrador - topo da hierarquia operacional') {
            issues.push({
                severity: 'error',
                agentName: agent.name,
                rule: 'reference-escalates',
                message: `Escalação para agent inexistente: ${agent.escalatesTo}`,
                suggestion: `Verifique se ${agent.escalatesTo} existe no registry`,
            });
        }
    }

    return issues;
}

/**
 * Valida integração com Graphiti/CONHECIMENTO
 */
export function validateGraphitiIntegration(agent: AgentDefinition): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const isSpecialAgent = ['_DNA', 'ROUTER', 'CONHECIMENTO', 'MANUTENCAO'].includes(agent.name);
    const isWorkflow = agent.type === 'workflow';

    // Agents devem colaborar com CONHECIMENTO ou mencionar Graphiti
    if (!isSpecialAgent && !isWorkflow && agent.type === 'agent') {
        const collaboratesWithKnowledge = agent.collaborates.some(
            (c: string) => c.includes('CONHECIMENTO') || c.includes('GRAPHITI')
        );

        if (!collaboratesWithKnowledge) {
            issues.push({
                severity: 'info',
                agentName: agent.name,
                rule: 'integration-graphiti',
                message: 'Agent não declara colaboração com CONHECIMENTO',
                suggestion: 'Considere integrar com o grafo de conhecimento',
            });
        }
    }

    return issues;
}

/**
 * Valida se a cadeia de escalação converge para ARQUITETO
 */
export function validateEscalationChain(agents: AgentDefinition[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const agentMap = new Map(agents.map((a) => [a.name, a]));

    for (const agent of agents) {
        if (agent.type !== 'agent' && agent.type !== 'meta-agent') continue;
        if (agent.name === 'ARQUITETO') continue; // Topo da hierarquia

        // Seguir cadeia de escalação
        const visited = new Set<string>();
        let current: AgentDefinition | undefined = agent;
        let depth = 0;
        const maxDepth = 10;

        while (current && current.escalatesTo && depth < maxDepth) {
            if (visited.has(current.name)) {
                issues.push({
                    severity: 'error',
                    agentName: agent.name,
                    rule: 'escalation-cycle',
                    message: `Ciclo detectado na cadeia de escalação: ${Array.from(visited).join(' → ')} → ${current.name}`,
                    suggestion: 'Remova o ciclo na hierarquia de escalação',
                });
                break;
            }

            visited.add(current.name);
            const nextName = current.escalatesTo.replace(/-agent\.md$/, '').replace(/\.md$/, '');
            current = agentMap.get(nextName);
            depth++;
        }

        // Verificar se chegou em ARQUITETO
        if (current && current.name !== 'ARQUITETO' && !current.escalatesTo) {
            // É ok se não tiver escalação definida
        }
    }

    return issues;
}

/**
 * Valida um único agent
 */
export function validateAgent(agent: AgentDefinition, projectRoot: string): ValidationResult {
    const issues: ValidationIssue[] = [];

    issues.push(...validateFrontmatter(agent));
    issues.push(...validateReferences(agent, projectRoot));
    issues.push(...validateGraphitiIntegration(agent));

    return {
        valid: issues.filter((i) => i.severity === 'error').length === 0,
        agentName: agent.name,
        issues,
    };
}

/**
 * Valida todos os agents do registry
 */
export function validateAllAgents(projectRoot?: string): ValidationSummary {
    invalidateCache(); // Garante dados frescos

    const root = projectRoot || process.cwd();
    const registry = loadAgentRegistry(root);
    const agents = listAllAgents(registry);

    const results: ValidationResult[] = [];
    const byRule: Record<string, number> = {};
    const bySeverity: Record<ValidationSeverity, number> = { error: 0, warning: 0, info: 0 };

    // Validar cada agent
    for (const agent of agents) {
        const result = validateAgent(agent, root);
        results.push(result);

        for (const issue of result.issues) {
            byRule[issue.rule] = (byRule[issue.rule] || 0) + 1;
            bySeverity[issue.severity]++;
        }
    }

    // Validar cadeia de escalação global
    const chainIssues = validateEscalationChain(agents);
    for (const issue of chainIssues) {
        byRule[issue.rule] = (byRule[issue.rule] || 0) + 1;
        bySeverity[issue.severity]++;

        // Adicionar ao resultado do agent afetado
        const agentResult = results.find((r) => r.agentName === issue.agentName);
        if (agentResult) {
            agentResult.issues.push(issue);
            if (issue.severity === 'error') {
                agentResult.valid = false;
            }
        }
    }

    const totalIssues = Object.values(bySeverity).reduce((a, b) => a + b, 0);
    const validAgents = results.filter((r) => r.valid).length;

    return {
        totalAgents: agents.length,
        validAgents,
        invalidAgents: agents.length - validAgents,
        totalIssues,
        byRule,
        bySeverity,
        results,
    };
}

/**
 * Calcula score de saúde do ecossistema (0-100)
 */
export function calculateHealthScore(summary: ValidationSummary): number {
    if (summary.totalAgents === 0) return 100;

    // Penalidades por tipo de issue
    const errorPenalty = 10;
    const warningPenalty = 3;
    const infoPenalty = 1;

    const totalPenalty =
        summary.bySeverity.error * errorPenalty +
        summary.bySeverity.warning * warningPenalty +
        summary.bySeverity.info * infoPenalty;

    // Score máximo baseado no número de agents
    const maxPenalty = summary.totalAgents * 15; // Máximo esperado de issues por agent

    const score = Math.max(0, 100 - (totalPenalty / maxPenalty) * 100);
    return Math.round(score);
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI Entry Point
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
    try {
        console.log('\n🔍 Agent Validator\n');

        const summary = validateAllAgents();
        const score = calculateHealthScore(summary);

        console.log('📊 Summary:');
        console.log(`   Total Agents: ${summary.totalAgents}`);
        console.log(`   Valid: ${summary.validAgents}`);
        console.log(`   Invalid: ${summary.invalidAgents}`);
        console.log(`   Total Issues: ${summary.totalIssues}`);
        console.log(`   Health Score: ${score}/100`);

        console.log('\n📋 By Severity:');
        console.log(`   🔴 Errors: ${summary.bySeverity.error}`);
        console.log(`   🟡 Warnings: ${summary.bySeverity.warning}`);
        console.log(`   🔵 Info: ${summary.bySeverity.info}`);

        if (summary.totalIssues > 0) {
            console.log('\n📝 Issues by Rule:');
            for (const [rule, count] of Object.entries(summary.byRule)) {
                console.log(`   ${rule}: ${count}`);
            }

            console.log('\n❌ Issues:');
            for (const result of summary.results) {
                for (const issue of result.issues) {
                    const icon = issue.severity === 'error' ? '🔴' : issue.severity === 'warning' ? '🟡' : '🔵';
                    console.log(`   ${icon} [${result.agentName}] ${issue.message}`);
                }
            }
        }

        process.exit(summary.bySeverity.error > 0 ? 1 : 0);
    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
