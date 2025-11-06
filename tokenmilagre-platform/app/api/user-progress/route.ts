import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/user-progress - Buscar progresso do usuário
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const articleSlug = searchParams.get('articleSlug');
    const completed = searchParams.get('completed');

    const where: any = {
      userId: session.user.id,
    };

    if (articleSlug) {
      where.articleSlug = articleSlug;
    }

    if (completed !== null) {
      where.completed = completed === 'true';
    }

    const progress = await prisma.userProgress.findMany({
      where,
      orderBy: { lastAccessed: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST /api/user-progress - Criar ou atualizar progresso
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
    const {
      articleSlug,
      progress = 0,
      completed = false,
      quizScore,
    } = body;

    // Validações
    if (!articleSlug) {
      return NextResponse.json(
        { success: false, error: 'Missing articleSlug' },
        { status: 400 }
      );
    }

    // Verificar se artigo existe
    const article = await prisma.article.findUnique({
      where: { slug: articleSlug },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Verificar se já existe progresso
    const existing = await prisma.userProgress.findUnique({
      where: {
        userId_articleSlug: {
          userId: session.user.id,
          articleSlug,
        },
      },
    });

    let userProgress;

    if (existing) {
      // Atualizar
      const updateData: any = {
        progress: parseInt(progress),
        lastAccessed: new Date(),
      };

      if (completed) {
        updateData.completed = true;
        updateData.completedAt = new Date();
      }

      if (quizScore !== undefined) {
        updateData.quizScore = parseFloat(quizScore);
        updateData.quizAttempts = { increment: 1 };
      }

      userProgress = await prisma.userProgress.update({
        where: {
          userId_articleSlug: {
            userId: session.user.id,
            articleSlug,
          },
        },
        data: updateData,
      });

      // Se completou, conceder pontos
      if (completed && !existing.completed) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { points: { increment: 10 } }, // 10 pontos por completar
        });
      }
    } else {
      // Criar novo
      userProgress = await prisma.userProgress.create({
        data: {
          userId: session.user.id,
          articleSlug,
          progress: parseInt(progress),
          completed,
          completedAt: completed ? new Date() : null,
          quizScore: quizScore !== undefined ? parseFloat(quizScore) : null,
          quizAttempts: quizScore !== undefined ? 1 : 0,
        },
      });

      // Conceder pontos por começar
      await prisma.user.update({
        where: { id: session.user.id },
        data: { points: { increment: 5 } }, // 5 pontos por começar
      });
    }

    return NextResponse.json({
      success: true,
      data: userProgress,
    });
  } catch (error) {
    console.error('Error updating user progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
