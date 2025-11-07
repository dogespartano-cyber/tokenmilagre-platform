import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/gamification/award-points - Conceder pontos ao usuário
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId, points, reason, badge } = body;

    // Validações
    if (!userId || !points) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or points' },
        { status: 400 }
      );
    }

    // Apenas ADMIN pode conceder pontos
    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin only' },
        { status: 403 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
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
      const currentBadges = user.badges ? JSON.parse(user.badges) : [];
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
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        points: true,
        badges: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        badges: user.badges ? JSON.parse(user.badges) : [],
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
