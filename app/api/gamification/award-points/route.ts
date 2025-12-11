import { NextRequest, NextResponse } from 'next/server';
import { authenticate, requireAdmin } from '@/lib/shared/helpers/auth-helpers';
import { prisma } from '@/lib/core/prisma';

// POST /api/gamification/award-points - Conceder pontos ao usuário (ADMIN apenas)
export async function POST(req: NextRequest) {
  try {
    // Apenas ADMIN pode conceder pontos
    const auth = await requireAdmin(req);
    if (!auth.success) return auth.response;

    const body = await req.json();
    const { userId, points, reason, badge } = body;

    // Validações
    if (!userId || !points) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or points' },
        { status: 400 }
      );
    }

    // Buscar usuário
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Atualizar pontos
    const updateData: any = {
      points: { increment: parseInt(points) },
    };

    // Adicionar badge se fornecido
    if (badge) {
      const currentBadges = targetUser.badges ? JSON.parse(targetUser.badges) : [];
      const newBadges = [...currentBadges, {
        id: badge.id || `badge_${Date.now()}`,
        name: badge.name,
        icon: badge.icon,
        description: badge.description,
        awardedAt: new Date().toISOString(),
        reason,
      }];
      updateData.badges = JSON.stringify(newBadges);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: updated.id,
        points: updated.points,
        badges: updated.badges ? JSON.parse(updated.badges) : [],
      },
      message: `Awarded ${points} points${badge ? ' and badge' : ''} to user`,
    });
  } catch (error) {
    console.error('Error awarding points:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to award points' },
      { status: 500 }
    );
  }
}

// GET /api/gamification/award-points - Buscar pontos e badges do usuário logado
export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!auth.success) return auth.response;

    const { user } = auth;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        points: true,
        badges: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...dbUser,
        badges: dbUser.badges ? JSON.parse(dbUser.badges) : [],
      },
    });
  } catch (error) {
    console.error('Error fetching user gamification data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
