/**
 * Execute Confirmed Tool API
 * Executes a tool after user confirmation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { executeConfirmedTool, rejectPendingActivity } from '@/lib/copilot/tool-executor';
import { ToolExecutionContext } from '@/lib/copilot/types';
import prisma from '@/lib/generated/prisma';

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // 2. Authorization (only ADMIN)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Apenas ADMIN pode usar o Copilot' }, { status: 403 });
    }

    // 3. Parse body
    const body = await request.json();
    const { activityId, action } = body;

    if (!activityId || !action) {
      return NextResponse.json({ error: 'activityId e action são obrigatórios' }, { status: 400 });
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: 'action deve ser "approve" ou "reject"' }, { status: 400 });
    }

    // 4. Find activity
    const activity = await prisma.copilotActivity.findUnique({
      where: { id: activityId }
    });

    if (!activity) {
      return NextResponse.json({ error: 'Atividade não encontrada' }, { status: 404 });
    }

    // 5. Verify ownership
    if (activity.userId !== session.user.id) {
      return NextResponse.json({ error: 'Você não tem permissão para executar esta atividade' }, { status: 403 });
    }

    // 6. Verify status
    if (activity.status !== 'pending') {
      return NextResponse.json({ error: `Atividade já está ${activity.status}` }, { status: 400 });
    }

    // 7. Handle rejection
    if (action === 'reject') {
      await rejectPendingActivity(activityId);
      return NextResponse.json({
        success: true,
        message: 'Ação rejeitada pelo usuário',
        status: 'rejected'
      });
    }

    // 8. Execute tool
    const parameters = activity.parameters ? JSON.parse(activity.parameters) : {};

    const context: ToolExecutionContext = {
      userId: session.user.id,
      userName: session.user.name || session.user.email,
      userRole: session.user.role,
      sessionId: `session_${Date.now()}`,
      timestamp: new Date()
    };

    const result = await executeConfirmedTool(
      activity.action,
      parameters,
      context,
      activityId
    );

    return NextResponse.json({
      success: result.success,
      result,
      message: result.success ? 'Ferramenta executada com sucesso' : 'Erro ao executar ferramenta'
    });

  } catch (error: any) {
    console.error('[Execute Tool API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao executar ferramenta' },
      { status: 500 }
    );
  }
}

/**
 * GET: Get activity details
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // 2. Authorization (only ADMIN)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Apenas ADMIN pode usar o Copilot' }, { status: 403 });
    }

    // 3. Get activityId from query
    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get('activityId');

    if (!activityId) {
      return NextResponse.json({ error: 'activityId é obrigatório' }, { status: 400 });
    }

    // 4. Find activity
    const activity = await prisma.copilotActivity.findUnique({
      where: { id: activityId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!activity) {
      return NextResponse.json({ error: 'Atividade não encontrada' }, { status: 404 });
    }

    // 5. Verify ownership
    if (activity.userId !== session.user.id) {
      return NextResponse.json({ error: 'Você não tem permissão para ver esta atividade' }, { status: 403 });
    }

    // 6. Return activity details
    return NextResponse.json({
      success: true,
      activity: {
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
      }
    });

  } catch (error: any) {
    console.error('[Get Activity API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar atividade' },
      { status: 500 }
    );
  }
}
