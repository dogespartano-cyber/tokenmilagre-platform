/**
 * Task Scheduler for Copilot Automation
 * Manages scheduled tasks using node-cron
 */

import cron from 'node-cron';
import { prisma } from '@/lib/prisma';
import { notifyTaskCompletion } from '../monitoring/notifier';

export interface ScheduledTask {
  name: string;
  description: string;
  schedule: string; // Cron expression
  handler: () => Promise<any>;
  enabled: boolean;
  runOnStartup?: boolean;
}

interface ActiveTask {
  task: ScheduledTask;
  cronJob: cron.ScheduledTask;
  lastRun?: Date;
  nextRun?: Date;
  runCount: number;
}

const activeTasks = new Map<string, ActiveTask>();

/**
 * Start the scheduler
 */
export async function startScheduler(tasks: ScheduledTask[]): Promise<void> {
  console.log('🚀 Starting Copilot Scheduler...');

  for (const task of tasks) {
    if (task.enabled) {
      scheduleTask(task);
    }
  }

  console.log(`✅ Scheduler started with ${activeTasks.size} active task(s)`);
}

/**
 * Schedule a single task
 */
export function scheduleTask(task: ScheduledTask): void {
  // Validate cron expression
  if (!cron.validate(task.schedule)) {
    console.error(`❌ Invalid cron expression for task "${task.name}": ${task.schedule}`);
    return;
  }

  // Remove existing task if any
  if (activeTasks.has(task.name)) {
    unscheduleTask(task.name);
  }

  // Create cron job
  const cronJob = cron.schedule(
    task.schedule,
    async () => {
      await executeTask(task);
    },
    {
      scheduled: true,
      timezone: 'America/Sao_Paulo' // Timezone do Brasil
    }
  );

  // Store active task
  activeTasks.set(task.name, {
    task,
    cronJob,
    runCount: 0
  });

  console.log(`📅 Scheduled task: ${task.name} (${task.schedule})`);

  // Run on startup if configured
  if (task.runOnStartup) {
    console.log(`▶️  Running task on startup: ${task.name}`);
    executeTask(task).catch(error => {
      console.error(`Error running task on startup:`, error);
    });
  }
}

/**
 * Unschedule a task
 */
export function unscheduleTask(taskName: string): boolean {
  const activeTask = activeTasks.get(taskName);

  if (!activeTask) {
    return false;
  }

  activeTask.cronJob.stop();
  activeTasks.delete(taskName);

  console.log(`🛑 Unscheduled task: ${taskName}`);
  return true;
}

/**
 * Execute a task manually
 */
export async function executeTaskManually(taskName: string): Promise<any> {
  const activeTask = activeTasks.get(taskName);

  if (!activeTask) {
    throw new Error(`Task not found: ${taskName}`);
  }

  return await executeTask(activeTask.task);
}

/**
 * Execute task handler and log results
 */
async function executeTask(task: ScheduledTask): Promise<any> {
  const activeTask = activeTasks.get(task.name);
  const startTime = Date.now();

  console.log(`\n⏱️  Executing task: ${task.name}`);
  console.log(`   Time: ${new Date().toISOString()}`);

  try {
    // Execute handler
    const result = await task.handler();

    const duration = Date.now() - startTime;

    // Update task info
    if (activeTask) {
      activeTask.lastRun = new Date();
      activeTask.runCount++;
    }

    // Save to database
    await saveTaskExecution(task.name, 'success', result, null);

    // Notify success
    await notifyTaskCompletion(task.name, 'success', {
      duration: `${duration}ms`,
      result
    });

    console.log(`✅ Task completed: ${task.name} (${duration}ms)`);

    return result;

  } catch (error: any) {
    const duration = Date.now() - startTime;

    // Save error to database
    await saveTaskExecution(task.name, 'failed', null, error.message);

    // Notify failure
    await notifyTaskCompletion(task.name, 'failed', {
      duration: `${duration}ms`,
      error: error.message
    });

    console.error(`❌ Task failed: ${task.name} (${duration}ms)`, error);

    throw error;
  }
}

/**
 * Save task execution to database
 */
async function saveTaskExecution(
  taskName: string,
  status: string,
  result: any,
  error: string | null
): Promise<void> {
  try {
    // Find or create task
    let task = await prisma.automationTask.findFirst({
      where: { name: taskName }
    });

    if (!task) {
      // Create task record
      task = await prisma.automationTask.create({
        data: {
          name: taskName,
          description: `Scheduled task: ${taskName}`,
          type: 'scheduled',
          enabled: true,
          runCount: 0
        }
      });
    }

    // Update task
    await prisma.automationTask.update({
      where: { id: task.id },
      data: {
        lastRun: new Date(),
        runCount: { increment: 1 },
        lastStatus: status,
        lastResult: result ? JSON.stringify(result) : null,
        lastError: error
      }
    });

  } catch (dbError) {
    console.error('Failed to save task execution to database:', dbError);
    // Don't throw - task execution should continue even if logging fails
  }
}

/**
 * Get active tasks
 */
export function getActiveTasks(): Array<{
  name: string;
  description: string;
  schedule: string;
  enabled: boolean;
  lastRun?: Date;
  runCount: number;
}> {
  return Array.from(activeTasks.values()).map(at => ({
    name: at.task.name,
    description: at.task.description,
    schedule: at.task.schedule,
    enabled: at.task.enabled,
    lastRun: at.lastRun,
    runCount: at.runCount
  }));
}

/**
 * Get task status
 */
export function getTaskStatus(taskName: string): ActiveTask | undefined {
  return activeTasks.get(taskName);
}

/**
 * Stop all tasks
 */
export function stopScheduler(): void {
  console.log('🛑 Stopping Copilot Scheduler...');

  for (const [name, activeTask] of activeTasks.entries()) {
    activeTask.cronJob.stop();
  }

  activeTasks.clear();

  console.log('✅ Scheduler stopped');
}

/**
 * Get scheduler statistics
 */
export function getSchedulerStats() {
  const tasks = getActiveTasks();

  return {
    totalTasks: tasks.length,
    enabledTasks: tasks.filter(t => t.enabled).length,
    totalRuns: tasks.reduce((sum, t) => sum + t.runCount, 0),
    lastRun: tasks
      .filter(t => t.lastRun)
      .sort((a, b) => (b.lastRun?.getTime() || 0) - (a.lastRun?.getTime() || 0))[0]?.lastRun
  };
}
