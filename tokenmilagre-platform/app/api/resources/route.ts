import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/resources - Criar novo recurso (autenticado, ADMIN/EDITOR)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verificar se é ADMIN ou EDITOR
    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json(
        { success: false, error: 'Sem permissão. Apenas ADMIN e EDITOR podem criar recursos.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      slug,
      category,
      shortDescription,
      officialUrl,
      platforms,
      tags,
      heroTitle,
      heroDescription,
      heroGradient,
      whyGoodTitle,
      whyGoodContent,
      features,
      howToStartTitle,
      howToStartSteps,
      pros,
      cons,
      faq,
      securityTips,
      showCompatibleWallets = false,
      relatedResources = null
    } = body;

    // Validação básica
    if (!name || !slug || !category || !shortDescription || !officialUrl) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Verificar se slug já existe
    const existing = await prisma.resource.findUnique({
      where: { slug }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Slug já existe. Use outro nome para o recurso.' },
        { status: 400 }
      );
    }

    // Criar recurso
    const resource = await prisma.resource.create({
      data: {
        name,
        slug,
        category,
        verified: true, // Recursos criados por ADMIN/EDITOR são automaticamente verificados
        shortDescription,
        officialUrl,
        platforms: JSON.stringify(platforms || []),
        tags: JSON.stringify(tags || []),
        heroTitle,
        heroDescription,
        heroGradient,
        whyGoodTitle,
        whyGoodContent: JSON.stringify(whyGoodContent || []),
        features: JSON.stringify(features || []),
        howToStartTitle,
        howToStartSteps: JSON.stringify(howToStartSteps || []),
        pros: JSON.stringify(pros || []),
        cons: JSON.stringify(cons || []),
        faq: JSON.stringify(faq || []),
        securityTips: JSON.stringify(securityTips || []),
        showCompatibleWallets,
        relatedResources: relatedResources ? JSON.stringify(relatedResources) : null
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: resource.id,
        slug: resource.slug,
        name: resource.name,
        message: 'Recurso criado com sucesso!'
      }
    });
  } catch (error) {
    console.error('Erro ao criar recurso:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar recurso' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/resources - Listar recursos (público)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const verified = searchParams.get('verified');

    const where: { category?: string; verified?: boolean } = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (verified !== null) {
      where.verified = verified === 'true';
    } else {
      // Por padrão, mostrar apenas verificados
      where.verified = true;
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy: {
        views: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('Erro ao buscar recursos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar recursos' },
      { status: 500 }
    );
  }
}
