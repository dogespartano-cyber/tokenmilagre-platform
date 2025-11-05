/**
 * Scheduled Tasks Definitions
 * Defines all automated tasks for the copilot
 */

import { ScheduledTask } from './scheduler';
import { runHealthCheck } from '../monitoring/monitor';
import { processAlerts } from '../monitoring/alerts';
import { notifyAlerts, notifyHealthCheck } from '../monitoring/notifier';
import { generateReportTool } from '../admin-tools';
import { suggestTrendingTopicsTool } from '../advanced-tools';
import { updateTrendingCache } from '../cache/trending-cache';
import { prisma } from '@/lib/prisma';

/**
 * Daily Health Check and Report (21h BRT)
 * Runs every day at 9 PM Brazil time
 */
const dailyHealthCheckTask: ScheduledTask = {
  name: 'daily_health_check',
  description: 'Verificação diária de saúde do sistema e geração de relatório',
  schedule: '0 21 * * *', // Every day at 21:00 (9 PM)
  enabled: true,
  runOnStartup: false,
  handler: async () => {
    // Run health check
    const healthCheck = await runHealthCheck();

    // Process alerts
    const newAlerts = processAlerts(healthCheck);

    // Notify about health check
    await notifyHealthCheck(healthCheck);

    // Notify new alerts
    if (newAlerts.length > 0) {
      await notifyAlerts(newAlerts);
    }

    // Generate daily report
    const report = await generateReportTool.execute({
      type: 'daily',
      sections: ['overview', 'articles', 'quality', 'recommendations']
    });

    // Save report to database
    if (report.success && report.data) {
      await prisma.copilotReport.create({
        data: {
          type: 'daily',
          title: `Relatório Diário - ${new Date().toLocaleDateString('pt-BR')}`,
          startDate: new Date(new Date().setHours(0, 0, 0, 0)),
          endDate: new Date(),
          summary: report.message || 'Relatório diário gerado',
          data: JSON.stringify(report.data),
          sections: JSON.stringify(['overview', 'articles', 'quality', 'recommendations']),
          generatedBy: 'automated',
          articlesAnalyzed: report.data.sections?.articles?.total || 0,
          alertsFound: newAlerts.length
        }
      });
    }

    return {
      healthCheck: {
        status: healthCheck.status,
        alerts: healthCheck.alerts.length,
        newAlerts: newAlerts.length
      },
      report: report.success ? 'Generated' : 'Failed'
    };
  }
};

/**
 * Weekly Report (Sundays at 20h BRT)
 * Comprehensive weekly analysis
 */
const weeklyReportTask: ScheduledTask = {
  name: 'weekly_report',
  description: 'Relatório semanal completo com análises e recomendações',
  schedule: '0 20 * * 0', // Every Sunday at 20:00 (8 PM)
  enabled: true,
  runOnStartup: false,
  handler: async () => {
    // Generate comprehensive weekly report
    const report = await generateReportTool.execute({
      type: 'weekly',
      sections: ['overview', 'articles', 'authors', 'quality', 'growth', 'recommendations']
    });

    // Save report
    if (report.success && report.data) {
      await prisma.copilotReport.create({
        data: {
          type: 'weekly',
          title: `Relatório Semanal - ${new Date().toLocaleDateString('pt-BR')}`,
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          endDate: new Date(),
          summary: report.message || 'Relatório semanal gerado',
          data: JSON.stringify(report.data),
          sections: JSON.stringify(['overview', 'articles', 'authors', 'quality', 'growth', 'recommendations']),
          generatedBy: 'automated'
        }
      });
    }

    return {
      status: report.success ? 'success' : 'failed',
      report: report.data
    };
  }
};

/**
 * Monthly Report (First day of month at 10h BRT)
 * Full monthly analysis with predictions
 */
const monthlyReportTask: ScheduledTask = {
  name: 'monthly_report',
  description: 'Relatório mensal completo com análises preditivas',
  schedule: '0 10 1 * *', // First day of every month at 10:00 (10 AM)
  enabled: true,
  runOnStartup: false,
  handler: async () => {
    // Generate monthly report
    const report = await generateReportTool.execute({
      type: 'monthly',
      sections: ['overview', 'articles', 'authors', 'quality', 'growth', 'recommendations']
    });

    // Save report
    if (report.success && report.data) {
      await prisma.copilotReport.create({
        data: {
          type: 'monthly',
          title: `Relatório Mensal - ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
          startDate: new Date(new Date().setDate(1)), // First day of month
          endDate: new Date(),
          summary: report.message || 'Relatório mensal gerado',
          data: JSON.stringify(report.data),
          sections: JSON.stringify(['overview', 'articles', 'authors', 'quality', 'growth', 'recommendations']),
          generatedBy: 'automated'
        }
      });
    }

    return {
      status: report.success ? 'success' : 'failed',
      report: report.data
    };
  }
};

/**
 * Update Trending Topics Cache (Daily at 8h BRT)
 * Fetches trending crypto topics and caches them
 */
const updateTrendingTopicsTask: ScheduledTask = {
  name: 'update_trending_topics',
  description: 'Atualiza cache de tópicos em alta no mundo crypto',
  schedule: '0 8 * * *', // Every day at 08:00 (8 AM)
  enabled: true,
  runOnStartup: true, // Run on startup to have fresh data
  handler: async () => {
    // Fetch trending topics for multiple categories
    const categories = ['bitcoin', 'ethereum', 'defi', 'all'] as const;
    const results: any = {};

    for (const category of categories) {
      try {
        const result = await suggestTrendingTopicsTool.execute({
          category,
          region: 'global',
          limit: 5
        });

        if (result.success && result.data) {
          results[category] = result.data;

          // Update cache
          await updateTrendingCache(category, result.data.topics || []);
        }
      } catch (error) {
        console.error(`Failed to fetch trending topics for ${category}:`, error);
        results[category] = { error: 'Failed to fetch' };
      }
    }

    return {
      categoriesUpdated: Object.keys(results).filter(k => !results[k].error).length,
      results
    };
  }
};

/**
 * Hourly Health Check (Every hour)
 * Quick health check without generating full report
 */
const hourlyHealthCheckTask: ScheduledTask = {
  name: 'hourly_health_check',
  description: 'Verificação de saúde a cada hora (silenciosa)',
  schedule: '0 * * * *', // Every hour at :00
  enabled: true,
  runOnStartup: false,
  handler: async () => {
    const healthCheck = await runHealthCheck();

    // Only process critical/high alerts
    const criticalAlerts = healthCheck.alerts.filter(
      a => a.priority === 'critical' || a.priority === 'high'
    );

    if (criticalAlerts.length > 0) {
      const newAlerts = processAlerts(healthCheck);
      await notifyAlerts(newAlerts);
    }

    return {
      status: healthCheck.status,
      criticalAlerts: criticalAlerts.length
    };
  }
};

/**
 * All scheduled tasks
 */
export const scheduledTasks: ScheduledTask[] = [
  dailyHealthCheckTask,
  weeklyReportTask,
  monthlyReportTask,
  updateTrendingTopicsTask,
  hourlyHealthCheckTask
];

/**
 * Get task by name
 */
export function getTaskByName(name: string): ScheduledTask | undefined {
  return scheduledTasks.find(t => t.name === name);
}

/**
 * Get enabled tasks
 */
export function getEnabledTasks(): ScheduledTask[] {
  return scheduledTasks.filter(t => t.enabled);
}
