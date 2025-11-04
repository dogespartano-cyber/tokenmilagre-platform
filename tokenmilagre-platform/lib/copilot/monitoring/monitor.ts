/**
 * Monitoring System for Copilot
 * Performs automatic health checks and detects issues
 */

import prisma from '@/lib/generated/prisma';

export interface HealthCheckResult {
  timestamp: Date;
  status: 'healthy' | 'warning' | 'critical';
  checks: {
    lowQualityArticles: CheckResult;
    outdatedArticles: CheckResult;
    missingCoverImages: CheckResult;
    apiQuota: CheckResult;
    databaseHealth: CheckResult;
  };
  alerts: Alert[];
  summary: string;
}

export interface CheckResult {
  status: 'pass' | 'warning' | 'fail';
  count?: number;
  threshold?: number;
  message: string;
}

export interface Alert {
  type: 'quality' | 'freshness' | 'media' | 'quota' | 'database';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: any;
  action?: string;
}

/**
 * Run comprehensive health check
 */
export async function runHealthCheck(): Promise<HealthCheckResult> {
  const timestamp = new Date();
  const checks: HealthCheckResult['checks'] = {
    lowQualityArticles: await checkLowQualityArticles(),
    outdatedArticles: await checkOutdatedArticles(),
    missingCoverImages: await checkMissingCoverImages(),
    apiQuota: await checkAPIQuota(),
    databaseHealth: await checkDatabaseHealth()
  };

  // Generate alerts based on checks
  const alerts: Alert[] = [];

  // Low quality articles alert
  if (checks.lowQualityArticles.status === 'fail') {
    alerts.push({
      type: 'quality',
      priority: 'high',
      message: `${checks.lowQualityArticles.count} artigos com score crítico (<50)`,
      details: { count: checks.lowQualityArticles.count },
      action: 'Usar analyze_content_quality para revisar'
    });
  } else if (checks.lowQualityArticles.status === 'warning') {
    alerts.push({
      type: 'quality',
      priority: 'medium',
      message: `${checks.lowQualityArticles.count} artigos com score baixo (<70)`,
      details: { count: checks.lowQualityArticles.count },
      action: 'Revisar e melhorar conteúdo'
    });
  }

  // Outdated articles alert
  if (checks.outdatedArticles.status === 'fail') {
    alerts.push({
      type: 'freshness',
      priority: 'high',
      message: `${checks.outdatedArticles.count} notícias com mais de 60 dias`,
      details: { count: checks.outdatedArticles.count },
      action: 'Usar check_outdated_articles para revisar'
    });
  } else if (checks.outdatedArticles.status === 'warning') {
    alerts.push({
      type: 'freshness',
      priority: 'medium',
      message: `${checks.outdatedArticles.count} notícias com mais de 30 dias`,
      details: { count: checks.outdatedArticles.count },
      action: 'Considerar atualizar ou arquivar'
    });
  }

  // Missing cover images alert
  if (checks.missingCoverImages.status === 'warning') {
    alerts.push({
      type: 'media',
      priority: 'low',
      message: `${checks.missingCoverImages.count} artigos publicados sem capa`,
      details: { count: checks.missingCoverImages.count },
      action: 'Gerar capas com IA para melhor engajamento'
    });
  }

  // API quota alert
  if (checks.apiQuota.status === 'fail') {
    alerts.push({
      type: 'quota',
      priority: 'critical',
      message: 'Quota de API crítica (>90%)',
      action: 'Reduzir uso ou aumentar limite'
    });
  } else if (checks.apiQuota.status === 'warning') {
    alerts.push({
      type: 'quota',
      priority: 'medium',
      message: 'Quota de API em atenção (>70%)',
      action: 'Monitorar uso de APIs'
    });
  }

  // Database health alert
  if (checks.databaseHealth.status === 'fail') {
    alerts.push({
      type: 'database',
      priority: 'critical',
      message: 'Problema de conexão com banco de dados',
      action: 'Verificar conexão e status do Neon/PostgreSQL'
    });
  }

  // Determine overall status
  let status: HealthCheckResult['status'] = 'healthy';
  if (alerts.some(a => a.priority === 'critical' || a.priority === 'high')) {
    status = 'critical';
  } else if (alerts.some(a => a.priority === 'medium' || a.priority === 'low')) {
    status = 'warning';
  }

  // Generate summary
  const summary = generateSummary(status, alerts, checks);

  return {
    timestamp,
    status,
    checks,
    alerts,
    summary
  };
}

/**
 * Check for low quality articles
 */
async function checkLowQualityArticles(): Promise<CheckResult> {
  try {
    const criticalCount = await prisma.article.count({
      where: {
        published: true,
        factCheckScore: { lt: 50 }
      }
    });

    const lowCount = await prisma.article.count({
      where: {
        published: true,
        factCheckScore: { gte: 50, lt: 70 }
      }
    });

    if (criticalCount > 0) {
      return {
        status: 'fail',
        count: criticalCount,
        threshold: 50,
        message: `${criticalCount} artigos com score crítico (<50)`
      };
    }

    if (lowCount > 5) {
      return {
        status: 'warning',
        count: lowCount,
        threshold: 70,
        message: `${lowCount} artigos com score baixo (<70)`
      };
    }

    return {
      status: 'pass',
      count: 0,
      message: 'Qualidade dos artigos OK'
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Erro ao verificar qualidade'
    };
  }
}

/**
 * Check for outdated articles
 */
async function checkOutdatedArticles(): Promise<CheckResult> {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const criticalCount = await prisma.article.count({
      where: {
        type: 'news',
        published: true,
        createdAt: { lt: sixtyDaysAgo }
      }
    });

    const warningCount = await prisma.article.count({
      where: {
        type: 'news',
        published: true,
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
      }
    });

    if (criticalCount > 10) {
      return {
        status: 'fail',
        count: criticalCount,
        threshold: 60,
        message: `${criticalCount} notícias com mais de 60 dias`
      };
    }

    if (warningCount > 20) {
      return {
        status: 'warning',
        count: warningCount,
        threshold: 30,
        message: `${warningCount} notícias com mais de 30 dias`
      };
    }

    return {
      status: 'pass',
      count: warningCount,
      message: 'Freshness dos artigos OK'
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Erro ao verificar atualização'
    };
  }
}

/**
 * Check for missing cover images
 */
async function checkMissingCoverImages(): Promise<CheckResult> {
  try {
    const count = await prisma.article.count({
      where: {
        published: true,
        coverImage: null
      }
    });

    if (count > 20) {
      return {
        status: 'warning',
        count,
        message: `${count} artigos publicados sem capa`
      };
    }

    return {
      status: 'pass',
      count,
      message: count > 0 ? `${count} artigos sem capa` : 'Todas capas OK'
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Erro ao verificar capas'
    };
  }
}

/**
 * Check API quota usage (simplified - can be enhanced with actual API calls)
 */
async function checkAPIQuota(): Promise<CheckResult> {
  // TODO: Implementar verificação real de quota quando APIs tiverem endpoints
  // Por enquanto, retorna sempre OK
  return {
    status: 'pass',
    message: 'Quota de APIs OK (verificação não implementada)'
  };
}

/**
 * Check database health
 */
async function checkDatabaseHealth(): Promise<CheckResult> {
  try {
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: 'pass',
      message: 'Conexão com banco de dados OK'
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Erro de conexão com banco de dados'
    };
  }
}

/**
 * Generate summary text
 */
function generateSummary(
  status: HealthCheckResult['status'],
  alerts: Alert[],
  checks: HealthCheckResult['checks']
): string {
  if (status === 'healthy') {
    return '✅ Sistema saudável. Nenhum problema detectado.';
  }

  const criticalAlerts = alerts.filter(a => a.priority === 'critical').length;
  const highAlerts = alerts.filter(a => a.priority === 'high').length;
  const mediumAlerts = alerts.filter(a => a.priority === 'medium').length;
  const lowAlerts = alerts.filter(a => a.priority === 'low').length;

  const parts = [];

  if (criticalAlerts > 0) {
    parts.push(`🔴 ${criticalAlerts} alerta(s) crítico(s)`);
  }
  if (highAlerts > 0) {
    parts.push(`⚠️ ${highAlerts} alerta(s) de alta prioridade`);
  }
  if (mediumAlerts > 0) {
    parts.push(`⚡ ${mediumAlerts} alerta(s) de média prioridade`);
  }
  if (lowAlerts > 0) {
    parts.push(`ℹ️ ${lowAlerts} alerta(s) de baixa prioridade`);
  }

  return parts.join(', ');
}

/**
 * Get monitoring statistics
 */
export async function getMonitoringStats() {
  const healthCheck = await runHealthCheck();

  return {
    status: healthCheck.status,
    totalAlerts: healthCheck.alerts.length,
    alertsByPriority: {
      critical: healthCheck.alerts.filter(a => a.priority === 'critical').length,
      high: healthCheck.alerts.filter(a => a.priority === 'high').length,
      medium: healthCheck.alerts.filter(a => a.priority === 'medium').length,
      low: healthCheck.alerts.filter(a => a.priority === 'low').length
    },
    lastCheck: healthCheck.timestamp,
    summary: healthCheck.summary
  };
}
