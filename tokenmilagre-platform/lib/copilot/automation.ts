/**
 * Copilot Automation System
 * Main entry point for Phase 3 automation features
 */

import { startScheduler, stopScheduler } from './scheduler/scheduler';
import { scheduledTasks } from './scheduler/tasks';
import { configureNotifier } from './monitoring/notifier';

let isRunning = false;

/**
 * Start copilot automation
 */
export async function startCopilotAutomation() {
  if (isRunning) {
    console.log('⚠️  Copilot automation already running');
    return;
  }

  console.log('\n🚀 Starting Copilot Automation System...\n');

  // Configure notifications
  configureNotifier({
    enabled: true,
    channels: {
      console: true
    },
    minPriority: 'medium'
  });

  // Start scheduler with all tasks
  await startScheduler(scheduledTasks);

  isRunning = true;

  console.log('\n✅ Copilot Automation System is now running!\n');
  console.log('Scheduled Tasks:');
  for (const task of scheduledTasks.filter(t => t.enabled)) {
    console.log(`  - ${task.name}: ${task.schedule}`);
  }
  console.log();
}

/**
 * Stop copilot automation
 */
export function stopCopilotAutomation() {
  if (!isRunning) {
    console.log('⚠️  Copilot automation not running');
    return;
  }

  console.log('\n🛑 Stopping Copilot Automation System...\n');

  stopScheduler();

  isRunning = false;

  console.log('✅ Copilot Automation System stopped\n');
}

/**
 * Check if automation is running
 */
export function isAutomationRunning(): boolean {
  return isRunning;
}

/**
 * Get automation status
 */
export function getAutomationStatus() {
  return {
    running: isRunning,
    features: {
      monitoring: true,
      scheduling: true,
      trending: true,
      forecasting: true,
      recommendations: true
    }
  };
}
