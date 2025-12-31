/**
 * Agent Health Dashboard
 *
 * Agregador central de métricas e observabilidade do ecossistema de agents.
 * Combina Registry, Validator e IntegrityTracker em um relatório unificado.
 *
 * @module lib/agents/health-dashboard
 */

import {
    loadAgentRegistry,
    getRegistryStats,
    listAllAgents,
    invalidateCache,
} from './agent-registry';
import { validateAllAgents, calculateHealthScore } from './agent-validator';
import {
    createSnapshot,
    loadLatestSnapshot,
    diffSnapshots,
    createIntegrityChain,
    verifyChainIntegrity,
    saveSnapshot,
} from './integrity-tracker';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface HealthMetrics {
    /** Score geral de saúde (0-100) */
    score: number;
    /** Status interpretado */
    status: 'healthy' | 'degraded' | 'critical';
    /** Timestamp do relatório */
    timestamp: Date;
}

export interface RegistryMetrics {
    totalAgents: number;
    totalWorkflows: number;
    totalFiles: number;
    byType: Record<string, number>;
}

export interface ValidationMetrics {
    validAgents: number;
    invalidAgents: number;
    totalIssues: number;
    errors: number;
    warnings: number;
    infos: number;
}

export interface IntegrityMetrics {
    chainValid: boolean;
    blocksCount: number;
    snapshotHash: string;
    changesDetected: number;
    changesSinceLastSnapshot: string[];
}

export interface GraphitiMetrics {
    status: 'online' | 'offline' | 'unknown';
    lastCheck: Date;
}

export interface HealthReport {
    health: HealthMetrics;
    registry: RegistryMetrics;
    validation: ValidationMetrics;
    integrity: IntegrityMetrics;
    graphiti: GraphitiMetrics;
    recommendations: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verifica status do Graphiti
 */
async function checkGraphitiStatus(): Promise<GraphitiMetrics> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);

        const response = await fetch('http://localhost:8000/health', {
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (response.ok) {
            return { status: 'online', lastCheck: new Date() };
        }
        return { status: 'offline', lastCheck: new Date() };
    } catch {
        return { status: 'offline', lastCheck: new Date() };
    }
}

/**
 * Interpreta score como status
 */
function interpretScore(score: number): 'healthy' | 'degraded' | 'critical' {
    if (score >= 90) return 'healthy';
    if (score >= 70) return 'degraded';
    return 'critical';
}

/**
 * Gera recomendações baseadas no estado atual
 */
function generateRecommendations(
    validation: ValidationMetrics,
    integrity: IntegrityMetrics,
    graphiti: GraphitiMetrics
): string[] {
    const recommendations: string[] = [];

    // Erros de validação
    if (validation.errors > 0) {
        recommendations.push(`🔴 Corrija ${validation.errors} erro(s) crítico(s) de validação`);
    }

    // Warnings de validação
    if (validation.warnings > 0) {
        recommendations.push(`🟡 Revise ${validation.warnings} warning(s) de validação`);
    }

    // Mudanças detectadas
    if (integrity.changesDetected > 0) {
        recommendations.push(`🔄 ${integrity.changesDetected} agent(s) modificado(s) desde último snapshot`);
    }

    // Graphiti offline
    if (graphiti.status === 'offline') {
        recommendations.push('⚠️ Graphiti está offline - considere verificar o serviço');
    }

    // Integridade quebrada
    if (!integrity.chainValid) {
        recommendations.push('❌ Cadeia de integridade está corrompida');
    }

    // Se tudo ok
    if (recommendations.length === 0) {
        recommendations.push('✅ Ecossistema saudável - nenhuma ação necessária');
    }

    return recommendations;
}

/**
 * Gera relatório completo de saúde
 */
export async function generateHealthReport(projectRoot?: string): Promise<HealthReport> {
    invalidateCache();

    // Registry
    const registry = loadAgentRegistry(projectRoot);
    const stats = getRegistryStats(registry);

    const registryMetrics: RegistryMetrics = {
        totalAgents: stats.totalAgents,
        totalWorkflows: stats.totalWorkflows,
        totalFiles: stats.totalFiles,
        byType: stats.byType,
    };

    // Validation
    const validationSummary = validateAllAgents(projectRoot);
    const healthScore = calculateHealthScore(validationSummary);

    const validationMetrics: ValidationMetrics = {
        validAgents: validationSummary.validAgents,
        invalidAgents: validationSummary.invalidAgents,
        totalIssues: validationSummary.totalIssues,
        errors: validationSummary.bySeverity.error,
        warnings: validationSummary.bySeverity.warning,
        infos: validationSummary.bySeverity.info,
    };

    // Integrity
    const currentSnapshot = createSnapshot(projectRoot);
    const lastSnapshot = loadLatestSnapshot(projectRoot);
    const chain = createIntegrityChain(projectRoot);
    const chainIntegrity = verifyChainIntegrity(chain);

    let changesDetected = 0;
    let changesSinceLastSnapshot: string[] = [];

    if (lastSnapshot) {
        const diffs = diffSnapshots(lastSnapshot, currentSnapshot);
        changesDetected = diffs.length;
        changesSinceLastSnapshot = diffs.map((d) => `${d.agentName} (${d.changeType})`);
    }

    const integrityMetrics: IntegrityMetrics = {
        chainValid: chainIntegrity.valid,
        blocksCount: chain.blocks.length,
        snapshotHash: currentSnapshot.snapshotHash,
        changesDetected,
        changesSinceLastSnapshot,
    };

    // Graphiti
    const graphitiMetrics = await checkGraphitiStatus();

    // Health
    const healthMetrics: HealthMetrics = {
        score: healthScore,
        status: interpretScore(healthScore),
        timestamp: new Date(),
    };

    // Recommendations
    const recommendations = generateRecommendations(validationMetrics, integrityMetrics, graphitiMetrics);

    return {
        health: healthMetrics,
        registry: registryMetrics,
        validation: validationMetrics,
        integrity: integrityMetrics,
        graphiti: graphitiMetrics,
        recommendations,
    };
}

/**
 * Exibe relatório formatado no console
 */
export function printHealthReport(report: HealthReport): void {
    const statusIcon = report.health.status === 'healthy' ? '✅' : report.health.status === 'degraded' ? '🟡' : '🔴';

    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log(`║     🏥 AGENT HEALTH DASHBOARD - ${report.health.timestamp.toISOString().slice(0, 19)}     ║`);
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log(`║  ${statusIcon} Health Score: ${report.health.score}/100 (${report.health.status.toUpperCase()})`.padEnd(65) + '║');
    console.log('╠══════════════════════════════════════════════════════════════╣');

    // Registry
    console.log('║  📋 REGISTRY'.padEnd(65) + '║');
    console.log(`║     Agents: ${report.registry.totalAgents}`.padEnd(65) + '║');
    console.log(`║     Workflows: ${report.registry.totalWorkflows}`.padEnd(65) + '║');
    console.log(`║     Total Files: ${report.registry.totalFiles}`.padEnd(65) + '║');

    // Validation
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  ✓ VALIDATION'.padEnd(65) + '║');
    console.log(
        `║     Valid: ${report.validation.validAgents} | Invalid: ${report.validation.invalidAgents}`.padEnd(65) + '║'
    );
    console.log(
        `║     🔴 ${report.validation.errors} | 🟡 ${report.validation.warnings} | 🔵 ${report.validation.infos}`.padEnd(65) + '║'
    );

    // Integrity
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  ⛓️  INTEGRITY'.padEnd(65) + '║');
    console.log(`║     Chain: ${report.integrity.chainValid ? '✅ Valid' : '❌ Broken'}`.padEnd(65) + '║');
    console.log(`║     Blocks: ${report.integrity.blocksCount}`.padEnd(65) + '║');
    console.log(`║     Changes: ${report.integrity.changesDetected}`.padEnd(65) + '║');

    // Graphiti
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  🧠 GRAPHITI'.padEnd(65) + '║');
    const graphitiIcon = report.graphiti.status === 'online' ? '🟢' : '🔴';
    console.log(`║     Status: ${graphitiIcon} ${report.graphiti.status.toUpperCase()}`.padEnd(65) + '║');

    // Recommendations
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  💡 RECOMMENDATIONS'.padEnd(65) + '║');
    for (const rec of report.recommendations) {
        console.log(`║     ${rec}`.padEnd(65) + '║');
    }

    console.log('╚══════════════════════════════════════════════════════════════╝\n');
}

/**
 * Executa health check completo e retorna exit code apropriado
 */
export async function runHealthCheck(projectRoot?: string, save = true): Promise<number> {
    const report = await generateHealthReport(projectRoot);
    printHealthReport(report);

    // Salvar snapshot se solicitado
    if (save) {
        const snapshot = createSnapshot(projectRoot);
        saveSnapshot(snapshot, projectRoot);
        console.log('💾 Snapshot saved to Feedback/logs/agent-integrity.json\n');
    }

    // Retornar exit code baseado no status
    if (report.health.status === 'critical') return 2;
    if (report.health.status === 'degraded') return 1;
    return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI Entry Point
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
    runHealthCheck()
        .then((exitCode) => {
            process.exit(exitCode);
        })
        .catch((error) => {
            console.error('❌ Error:', error instanceof Error ? error.message : error);
            process.exit(1);
        });
}
