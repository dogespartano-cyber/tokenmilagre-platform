/**
 * Copilot Metrics API
 * Real-time metrics endpoint for dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getMonitoringStats } from '@/lib/copilot/monitoring/monitor';
import { getActiveAlerts, getAlertStats } from '@/lib/copilot/monitoring/alerts';
import { getSchedulerStats, getActiveTasks } from '@/lib/copilot/scheduler/scheduler';
import { getCacheStatus, getTopTrendingTopics } from '@/lib/copilot/cache/trending-cache';
import { getAllForecasts } from '@/lib/copilot/analytics/forecasting';
import { getTopRecommendations } from '@/lib/copilot/analytics/recommendations';
import { getToolsStats } from '@/lib/copilot/tools';

/**
 * GET /api/copilot/metrics
 * Returns real-time copilot metrics
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Only ADMIN can access
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado - apenas ADMIN' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const include = searchParams.get('include')?.split(',') || [
      'monitoring',
      'alerts',
      'scheduler',
      'trending',
      'forecasts',
      'recommendations',
      'tools'
    ];

    // Build response
    const response: any = {
      timestamp: new Date().toISOString(),
      status: 'ok'
    };

    // Monitoring metrics
    if (include.includes('monitoring')) {
      try {
        response.monitoring = await getMonitoringStats();
      } catch (error) {
        response.monitoring = { error: 'Failed to fetch monitoring stats' };
      }
    }

    // Alerts
    if (include.includes('alerts')) {
      try {
        response.alerts = {
          stats: getAlertStats(),
          active: getActiveAlerts().slice(0, 10).map(a => ({
            id: a.id,
            type: a.alert.type,
            priority: a.alert.priority,
            message: a.alert.message,
            action: a.alert.action,
            timestamp: a.timestamp
          }))
        };
      } catch (error) {
        response.alerts = { error: 'Failed to fetch alerts' };
      }
    }

    // Scheduler
    if (include.includes('scheduler')) {
      try {
        response.scheduler = {
          stats: getSchedulerStats(),
          tasks: getActiveTasks().map(t => ({
            name: t.name,
            description: t.description,
            schedule: t.schedule,
            enabled: t.enabled,
            lastRun: t.lastRun,
            runCount: t.runCount
          }))
        };
      } catch (error) {
        response.scheduler = { error: 'Failed to fetch scheduler stats' };
      }
    }

    // Trending topics
    if (include.includes('trending')) {
      try {
        response.trending = {
          cache: getCacheStatus(),
          top: getTopTrendingTopics(5).map(t => ({
            title: t.title,
            category: t.category,
            urgency: t.urgency,
            type: t.suggestedArticleType
          }))
        };
      } catch (error) {
        response.trending = { error: 'Failed to fetch trending topics' };
      }
    }

    // Forecasts
    if (include.includes('forecasts')) {
      try {
        const forecastData = await getAllForecasts();
        response.forecasts = {
          forecasts: forecastData.forecasts,
          generatedAt: forecastData.generatedAt
        };
      } catch (error) {
        response.forecasts = { error: 'Failed to fetch forecasts' };
      }
    }

    // Recommendations
    if (include.includes('recommendations')) {
      try {
        response.recommendations = await getTopRecommendations(10);
      } catch (error) {
        response.recommendations = { error: 'Failed to fetch recommendations' };
      }
    }

    // Tools stats
    if (include.includes('tools')) {
      try {
        response.tools = getToolsStats();
      } catch (error) {
        response.tools = { error: 'Failed to fetch tools stats' };
      }
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error fetching copilot metrics:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar métricas do copiloto' },
      { status: 500 }
    );
  }
}
