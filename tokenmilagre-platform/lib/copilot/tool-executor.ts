/**
 * Tool Executor
 * Handles tool execution with permission checks and audit logging
 */

import { CopilotTool, ToolPermissionLevel, ToolExecutionContext, ToolExecutionResult } from './types';
import { getToolByName } from './tools';
import { prisma } from '@/lib/prisma';

/**
 * Execute a tool with permission checks
 */
export async function executeTool(
  toolName: string,
  parameters: Record<string, any>,
  context: ToolExecutionContext
): Promise<ToolExecutionResult> {
  try {
    // Get tool definition
    const tool = getToolByName(toolName);

    if (!tool) {
      return {
        success: false,
        error: `Ferramenta "${toolName}" não encontrada`
      };
    }

    // Check if tool requires confirmation
    if (tool.permission !== ToolPermissionLevel.AUTO) {
      return {
        success: false,
        requiresConfirmation: true,
        confirmationMessage: buildConfirmationMessage(tool, parameters),
        data: {
          toolName: tool.name,
          parameters,
          permissionLevel: tool.permission
        }
      };
    }

    // Execute tool (AUTO permission)
    const result = await tool.execute(parameters, context);

    // Log execution
    await logToolExecution(toolName, parameters, result, context, false);

    return result;

  } catch (error: any) {
    console.error('[executeTool] Error:', error);
    return {
      success: false,
      error: error.message || 'Erro ao executar ferramenta'
    };
  }
}

/**
 * Execute a tool after user confirmation
 */
export async function executeConfirmedTool(
  toolName: string,
  parameters: Record<string, any>,
  context: ToolExecutionContext,
  activityId: string
): Promise<ToolExecutionResult> {
  try {
    const tool = getToolByName(toolName);

    if (!tool) {
      return {
        success: false,
        error: `Ferramenta "${toolName}" não encontrada`
      };
    }

    // Execute tool
    const result = await tool.execute(parameters, context);

    // Update activity log
    await prisma.copilotActivity.update({
      where: { id: activityId },
      data: {
        status: result.success ? 'executed' : 'failed',
        result: JSON.stringify(result),
        confirmed: true,
        confirmedAt: new Date()
      }
    });

    return result;

  } catch (error: any) {
    console.error('[executeConfirmedTool] Error:', error);

    // Update activity as failed
    await prisma.copilotActivity.update({
      where: { id: activityId },
      data: {
        status: 'failed',
        result: JSON.stringify({ error: error.message })
      }
    });

    return {
      success: false,
      error: error.message || 'Erro ao executar ferramenta'
    };
  }
}

/**
 * Create pending activity for confirmation
 */
export async function createPendingActivity(
  toolName: string,
  parameters: Record<string, any>,
  context: ToolExecutionContext
): Promise<{ activityId: string; confirmationMessage: string }> {
  const tool = getToolByName(toolName);

  if (!tool) {
    throw new Error(`Ferramenta "${toolName}" não encontrada`);
  }

  const activity = await prisma.copilotActivity.create({
    data: {
      userId: context.userId,
      action: toolName,
      parameters: JSON.stringify(parameters),
      status: 'pending',
      requiresConfirmation: true,
      confirmed: false
    }
  });

  return {
    activityId: activity.id,
    confirmationMessage: buildConfirmationMessage(tool, parameters)
  };
}

/**
 * Build confirmation message for user
 */
function buildConfirmationMessage(
  tool: CopilotTool,
  parameters: Record<string, any>
): string {
  let message = `**Confirmação Necessária**\n\n`;
  message += `🔧 **Ferramenta**: \`${tool.name}\`\n`;
  message += `🔐 **Nível de Permissão**: ${getPermissionLevelLabel(tool.permission)}\n\n`;
  message += `**Ação a ser executada**:\n`;
  message += `${getActionDescription(tool.name, parameters)}\n\n`;

  if (tool.permission === ToolPermissionLevel.CONFIRM_TWICE) {
    message += `⚠️ **ATENÇÃO**: Esta é uma ação destrutiva e irreversível!\n\n`;
  }

  message += `**Parâmetros**:\n`;
  message += formatParameters(parameters);

  return message;
}

/**
 * Get permission level label
 */
function getPermissionLevelLabel(level: ToolPermissionLevel): string {
  switch (level) {
    case ToolPermissionLevel.AUTO:
      return '✅ Automático (leitura)';
    case ToolPermissionLevel.CONFIRM:
      return '⏸️ Confirmação simples (escrita)';
    case ToolPermissionLevel.CONFIRM_TWICE:
      return '🚨 Confirmação dupla (destrutivo)';
  }
}

/**
 * Get action description based on tool and parameters
 */
function getActionDescription(toolName: string, params: Record<string, any>): string {
  switch (toolName) {
    case 'read_articles':
      return `Buscar artigos no banco de dados${params.searchQuery ? ` com query "${params.searchQuery}"` : ''}`;

    case 'get_statistics':
      return 'Obter estatísticas completas do sistema';

    case 'create_article':
      return `Criar novo artigo "${params.title}" (tipo: ${params.type}, categoria: ${params.category})`;

    case 'update_article':
      const identifier = params.id ? `ID: ${params.id}` : `Slug: ${params.slug}`;
      const fields = Object.keys(params).filter(k => k !== 'id' && k !== 'slug').join(', ');
      return `Atualizar artigo (${identifier}) - Campos: ${fields}`;

    case 'delete_article':
      const deleteId = params.id ? `ID: ${params.id}` : `Slug: ${params.slug}`;
      return `DELETAR PERMANENTEMENTE artigo (${deleteId})\nMotivo: ${params.reason || 'Não especificado'}`;

    default:
      return `Executar ${toolName}`;
  }
}

/**
 * Format parameters for display
 */
function formatParameters(params: Record<string, any>): string {
  let formatted = '```json\n';
  formatted += JSON.stringify(params, null, 2);
  formatted += '\n```';
  return formatted;
}

/**
 * Log tool execution to database
 */
async function logToolExecution(
  toolName: string,
  parameters: Record<string, any>,
  result: ToolExecutionResult,
  context: ToolExecutionContext,
  requiresConfirmation: boolean
): Promise<void> {
  try {
    await prisma.copilotActivity.create({
      data: {
        userId: context.userId,
        action: toolName,
        parameters: JSON.stringify(parameters),
        result: JSON.stringify(result),
        status: result.success ? 'executed' : 'failed',
        requiresConfirmation,
        confirmed: !requiresConfirmation,
        confirmedAt: !requiresConfirmation ? new Date() : undefined
      }
    });
  } catch (error) {
    console.error('[logToolExecution] Failed to log:', error);
    // Don't throw - logging failure shouldn't break execution
  }
}

/**
 * Get recent activity for user
 */
export async function getRecentActivity(
  userId: string,
  limit: number = 20
): Promise<any[]> {
  try {
    const activities = await prisma.copilotActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return activities.map((activity: any) => ({
      id: activity.id,
      action: activity.action,
      parameters: activity.parameters ? JSON.parse(activity.parameters) : {},
      result: activity.result ? JSON.parse(activity.result) : null,
      status: activity.status,
      requiresConfirmation: activity.requiresConfirmation,
      confirmed: activity.confirmed,
      confirmedAt: activity.confirmedAt,
      createdAt: activity.createdAt,
      user: activity.user
    }));
  } catch (error) {
    console.error('[getRecentActivity] Error:', error);
    return [];
  }
}

/**
 * Reject pending activity
 */
export async function rejectPendingActivity(activityId: string): Promise<void> {
  await prisma.copilotActivity.update({
    where: { id: activityId },
    data: {
      status: 'rejected',
      confirmed: false
    }
  });
}
