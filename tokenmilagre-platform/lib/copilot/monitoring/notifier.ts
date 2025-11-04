/**
 * Notification System
 * Sends notifications about alerts and important events
 */

import { Alert, HealthCheckResult } from './monitor';
import { AlertHistory } from './alerts';

export interface NotificationConfig {
  enabled: boolean;
  channels: {
    console: boolean;
    webhook?: string;
    email?: string;
  };
  minPriority: Alert['priority'];
}

const defaultConfig: NotificationConfig = {
  enabled: true,
  channels: {
    console: true
  },
  minPriority: 'medium'
};

let config = { ...defaultConfig };

/**
 * Configure notification system
 */
export function configureNotifier(newConfig: Partial<NotificationConfig>) {
  config = { ...config, ...newConfig };
}

/**
 * Send notification for new alerts
 */
export async function notifyAlerts(alerts: AlertHistory[]): Promise<void> {
  if (!config.enabled || alerts.length === 0) {
    return;
  }

  // Filter by minimum priority
  const priorityLevels: Alert['priority'][] = ['low', 'medium', 'high', 'critical'];
  const minPriorityIndex = priorityLevels.indexOf(config.minPriority);

  const filteredAlerts = alerts.filter(a => {
    const alertPriorityIndex = priorityLevels.indexOf(a.alert.priority);
    return alertPriorityIndex >= minPriorityIndex;
  });

  if (filteredAlerts.length === 0) {
    return;
  }

  // Send to configured channels
  if (config.channels.console) {
    await notifyConsole(filteredAlerts);
  }

  if (config.channels.webhook) {
    await notifyWebhook(filteredAlerts, config.channels.webhook);
  }

  if (config.channels.email) {
    await notifyEmail(filteredAlerts, config.channels.email);
  }
}

/**
 * Send notification for health check results
 */
export async function notifyHealthCheck(healthCheck: HealthCheckResult): Promise<void> {
  if (!config.enabled) {
    return;
  }

  if (config.channels.console) {
    console.log('\n🏥 Health Check Result:');
    console.log(`   Status: ${getStatusEmoji(healthCheck.status)} ${healthCheck.status.toUpperCase()}`);
    console.log(`   Time: ${healthCheck.timestamp.toISOString()}`);
    console.log(`   Summary: ${healthCheck.summary}`);
    console.log(`   Alerts: ${healthCheck.alerts.length}`);
  }
}

/**
 * Send notification for scheduled task completion
 */
export async function notifyTaskCompletion(
  taskName: string,
  status: 'success' | 'failed',
  details?: any
): Promise<void> {
  if (!config.enabled || !config.channels.console) {
    return;
  }

  const emoji = status === 'success' ? '✅' : '❌';
  console.log(`\n${emoji} Scheduled Task: ${taskName}`);
  console.log(`   Status: ${status.toUpperCase()}`);
  console.log(`   Time: ${new Date().toISOString()}`);

  if (details) {
    console.log(`   Details:`, details);
  }
}

/**
 * Console notification (default)
 */
async function notifyConsole(alerts: AlertHistory[]): Promise<void> {
  console.log('\n🚨 New Alerts Detected:');

  for (const alertRecord of alerts) {
    const alert = alertRecord.alert;
    const emoji = getPriorityEmoji(alert.priority);
    const typeLabel = getTypeLabel(alert.type);

    console.log(`\n${emoji} [${alert.priority.toUpperCase()}] ${typeLabel}`);
    console.log(`   Message: ${alert.message}`);

    if (alert.details) {
      console.log(`   Details:`, alert.details);
    }

    if (alert.action) {
      console.log(`   Action: ${alert.action}`);
    }

    console.log(`   Time: ${alertRecord.timestamp.toISOString()}`);
  }
}

/**
 * Webhook notification (optional)
 */
async function notifyWebhook(alerts: AlertHistory[], webhookUrl: string): Promise<void> {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      alerts: alerts.map(a => ({
        id: a.id,
        type: a.alert.type,
        priority: a.alert.priority,
        message: a.alert.message,
        details: a.alert.details,
        action: a.alert.action,
        timestamp: a.timestamp.toISOString()
      }))
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('Failed to send webhook notification:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending webhook notification:', error);
  }
}

/**
 * Email notification (optional, requires email service)
 */
async function notifyEmail(alerts: AlertHistory[], emailAddress: string): Promise<void> {
  // TODO: Implement email notification when email service is configured
  console.log(`Email notification would be sent to: ${emailAddress}`);
  console.log(`Alerts: ${alerts.length}`);
}

/**
 * Helper: Get priority emoji
 */
function getPriorityEmoji(priority: Alert['priority']): string {
  const emojis = {
    critical: '🔴',
    high: '⚠️',
    medium: '⚡',
    low: 'ℹ️'
  };
  return emojis[priority];
}

/**
 * Helper: Get status emoji
 */
function getStatusEmoji(status: HealthCheckResult['status']): string {
  const emojis = {
    healthy: '✅',
    warning: '⚠️',
    critical: '🔴'
  };
  return emojis[status];
}

/**
 * Helper: Get type label
 */
function getTypeLabel(type: Alert['type']): string {
  const labels = {
    quality: 'Qualidade de Conteúdo',
    freshness: 'Atualização de Artigos',
    media: 'Imagens de Capa',
    quota: 'Quota de API',
    database: 'Banco de Dados'
  };
  return labels[type];
}

/**
 * Format notification summary
 */
export function formatNotificationSummary(alerts: AlertHistory[]): string {
  if (alerts.length === 0) {
    return 'Nenhum alerta novo';
  }

  const critical = alerts.filter(a => a.alert.priority === 'critical').length;
  const high = alerts.filter(a => a.alert.priority === 'high').length;
  const medium = alerts.filter(a => a.alert.priority === 'medium').length;
  const low = alerts.filter(a => a.alert.priority === 'low').length;

  const parts = [];
  if (critical > 0) parts.push(`${critical} crítico(s)`);
  if (high > 0) parts.push(`${high} alto(s)`);
  if (medium > 0) parts.push(`${medium} médio(s)`);
  if (low > 0) parts.push(`${low} baixo(s)`);

  return `${alerts.length} novo(s) alerta(s): ${parts.join(', ')}`;
}
