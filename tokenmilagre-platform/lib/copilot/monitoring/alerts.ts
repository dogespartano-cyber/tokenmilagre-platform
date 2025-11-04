/**
 * Alert Management System
 * Processes and manages alerts from monitoring
 */

import { Alert, HealthCheckResult } from './monitor';

export interface AlertHistory {
  id: string;
  alert: Alert;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

// In-memory alert storage (can be moved to database later)
const alertHistory: AlertHistory[] = [];
let nextAlertId = 1;

/**
 * Process new alerts from health check
 */
export function processAlerts(healthCheck: HealthCheckResult): AlertHistory[] {
  const newAlerts: AlertHistory[] = [];

  for (const alert of healthCheck.alerts) {
    // Check if similar alert already exists and is not acknowledged
    const existingAlert = alertHistory.find(
      h =>
        !h.acknowledged &&
        h.alert.type === alert.type &&
        h.alert.priority === alert.priority &&
        h.alert.message === alert.message
    );

    // Skip if alert already exists
    if (existingAlert) {
      continue;
    }

    // Create new alert
    const alertRecord: AlertHistory = {
      id: `alert_${nextAlertId++}`,
      alert,
      timestamp: healthCheck.timestamp,
      acknowledged: false
    };

    alertHistory.push(alertRecord);
    newAlerts.push(alertRecord);
  }

  // Clean old acknowledged alerts (keep last 100)
  cleanOldAlerts();

  return newAlerts;
}

/**
 * Get active (unacknowledged) alerts
 */
export function getActiveAlerts(): AlertHistory[] {
  return alertHistory.filter(h => !h.acknowledged);
}

/**
 * Get all alerts (including acknowledged)
 */
export function getAllAlerts(limit = 50): AlertHistory[] {
  return alertHistory
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Get alerts by priority
 */
export function getAlertsByPriority(priority: Alert['priority']): AlertHistory[] {
  return alertHistory.filter(h => !h.acknowledged && h.alert.priority === priority);
}

/**
 * Get alerts by type
 */
export function getAlertsByType(type: Alert['type']): AlertHistory[] {
  return alertHistory.filter(h => !h.acknowledged && h.alert.type === type);
}

/**
 * Acknowledge an alert
 */
export function acknowledgeAlert(alertId: string, userId?: string): boolean {
  const alert = alertHistory.find(h => h.id === alertId);

  if (!alert) {
    return false;
  }

  alert.acknowledged = true;
  alert.acknowledgedAt = new Date();
  alert.acknowledgedBy = userId;

  return true;
}

/**
 * Acknowledge all alerts of a specific type
 */
export function acknowledgeAlertsByType(type: Alert['type'], userId?: string): number {
  let count = 0;

  for (const alert of alertHistory) {
    if (!alert.acknowledged && alert.alert.type === type) {
      alert.acknowledged = true;
      alert.acknowledgedAt = new Date();
      alert.acknowledgedBy = userId;
      count++;
    }
  }

  return count;
}

/**
 * Acknowledge all alerts
 */
export function acknowledgeAllAlerts(userId?: string): number {
  let count = 0;

  for (const alert of alertHistory) {
    if (!alert.acknowledged) {
      alert.acknowledged = true;
      alert.acknowledgedAt = new Date();
      alert.acknowledgedBy = userId;
      count++;
    }
  }

  return count;
}

/**
 * Clean old acknowledged alerts
 */
function cleanOldAlerts(): void {
  const maxHistory = 100;

  if (alertHistory.length > maxHistory) {
    // Keep only last 100 alerts (prioritize unacknowledged)
    const active = alertHistory.filter(h => !h.acknowledged);
    const acknowledged = alertHistory
      .filter(h => h.acknowledged)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, maxHistory - active.length);

    alertHistory.length = 0;
    alertHistory.push(...active, ...acknowledged);
  }
}

/**
 * Get alert statistics
 */
export function getAlertStats() {
  const active = getActiveAlerts();

  return {
    total: alertHistory.length,
    active: active.length,
    acknowledged: alertHistory.filter(h => h.acknowledged).length,
    byPriority: {
      critical: active.filter(a => a.alert.priority === 'critical').length,
      high: active.filter(a => a.alert.priority === 'high').length,
      medium: active.filter(a => a.alert.priority === 'medium').length,
      low: active.filter(a => a.alert.priority === 'low').length
    },
    byType: {
      quality: active.filter(a => a.alert.type === 'quality').length,
      freshness: active.filter(a => a.alert.type === 'freshness').length,
      media: active.filter(a => a.alert.type === 'media').length,
      quota: active.filter(a => a.alert.type === 'quota').length,
      database: active.filter(a => a.alert.type === 'database').length
    }
  };
}

/**
 * Format alert for display
 */
export function formatAlert(alert: Alert): string {
  const priorityEmoji = {
    critical: '🔴',
    high: '⚠️',
    medium: '⚡',
    low: 'ℹ️'
  };

  const typeLabel = {
    quality: 'Qualidade',
    freshness: 'Atualização',
    media: 'Mídia',
    quota: 'Quota API',
    database: 'Banco de Dados'
  };

  return `${priorityEmoji[alert.priority]} [${typeLabel[alert.type]}] ${alert.message}`;
}

/**
 * Get recommended actions for alerts
 */
export function getRecommendedActions(): string[] {
  const active = getActiveAlerts();
  const actions: string[] = [];

  // Group by priority
  const critical = active.filter(a => a.alert.priority === 'critical');
  const high = active.filter(a => a.alert.priority === 'high');

  // Add actions for critical alerts
  for (const alertRecord of critical) {
    if (alertRecord.alert.action) {
      actions.push(`[URGENTE] ${alertRecord.alert.action}`);
    }
  }

  // Add actions for high priority alerts
  for (const alertRecord of high) {
    if (alertRecord.alert.action) {
      actions.push(`[PRIORITÁRIO] ${alertRecord.alert.action}`);
    }
  }

  return actions;
}
