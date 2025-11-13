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

    // Validação completa de campos obrigatórios
    const requiredFields = {
      name,
      slug,
      category,
      shortDescription,
      officialUrl,
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
      securityTips
    };

    const missingFields: string[] = [];

    // Validar campos string
    ['name', 'slug', 'category', 'shortDescription', 'officialUrl', 'heroTitle', 'heroDescription', 'heroGradient', 'whyGoodTitle', 'howToStartTitle'].forEach(field => {
      if (!requiredFields[field as keyof typeof requiredFields]) {
        missingFields.push(field);
      }
    });

    // Validar arrays obrigatórios
    if (!Array.isArray(whyGoodContent) || whyGoodContent.length < 5) {
      missingFields.push('whyGoodContent (mínimo 5 parágrafos)');
    }
    if (!Array.isArray(features) || features.length < 6) {
      missingFields.push('features (mínimo 6)');
    }
    if (!Array.isArray(howToStartSteps) || howToStartSteps.length < 5) {
      missingFields.push('howToStartSteps (mínimo 5)');
    }
    if (!Array.isArray(pros) || pros.length < 8) {
      missingFields.push('pros (mínimo 8)');
    }
    if (!Array.isArray(cons) || cons.length < 5) {
      missingFields.push('cons (mínimo 5)');
    }
    if (!Array.isArray(faq) || faq.length < 4) {
      missingFields.push('faq (mínimo 4)');
    }
    if (!Array.isArray(securityTips) || securityTips.length < 6) {
      missingFields.push('securityTips (mínimo 6)');
    }

    // Validar URL
    if (officialUrl && !officialUrl.startsWith('http')) {
      missingFields.push('officialUrl (deve ser URL válida com http/https)');
    }

    if (missingFields.length > 0) {
      console.error('❌ Campos obrigatórios faltando:', missingFields);
      return NextResponse.json(
        {
          success: false,
          error: `Campos obrigatórios faltando: ${missingFields.join(', ')}`,
          details: { missingFields }
        },
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

    // Preparar dados com validação
    const resourceData: any = {
      name,
      slug,
      category,
      verified: true,
      shortDescription,
      officialUrl,
      platforms: typeof platforms === 'string' ? platforms : JSON.stringify(platforms || []),
      tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
      heroTitle: heroTitle || name,
      heroDescription: heroDescription || shortDescription,
      heroGradient: heroGradient || 'linear-gradient(135deg, #7C3AED, #F59E0B)',
      whyGoodTitle: whyGoodTitle || `Por que ${name} é uma boa escolha?`,
      whyGoodContent: typeof whyGoodContent === 'string' ? whyGoodContent : JSON.stringify(whyGoodContent || []),
      features: typeof features === 'string' ? features : JSON.stringify(features || []),
      howToStartTitle: howToStartTitle || `Como Começar a Usar ${name}`,
      howToStartSteps: typeof howToStartSteps === 'string' ? howToStartSteps : JSON.stringify(howToStartSteps || []),
      pros: typeof pros === 'string' ? pros : JSON.stringify(pros || []),
      cons: typeof cons === 'string' ? cons : JSON.stringify(cons || []),
      faq: typeof faq === 'string' ? faq : JSON.stringify(faq || []),
      securityTips: typeof securityTips === 'string' ? securityTips : JSON.stringify(securityTips || []),
      showCompatibleWallets: showCompatibleWallets || false,
      relatedResources: relatedResources
        ? (typeof relatedResources === 'string' ? relatedResources : JSON.stringify(relatedResources))
        : null
    };

    // Adicionar sources se fornecido
    if (body.sources) {
      resourceData.sources = typeof body.sources === 'string' ? body.sources : JSON.stringify(body.sources);
    }

    // Log para debug
    console.log('📦 Criando recurso:', {
      name: resourceData.name,
      slug: resourceData.slug,
      category: resourceData.category,
      officialUrl: resourceData.officialUrl,
      fieldsCount: Object.keys(resourceData).length,
      arrays: {
        whyGoodContent: resourceData.whyGoodContent ? JSON.parse(resourceData.whyGoodContent).length : 0,
        features: resourceData.features ? JSON.parse(resourceData.features).length : 0,
        howToStartSteps: resourceData.howToStartSteps ? JSON.parse(resourceData.howToStartSteps).length : 0,
        pros: resourceData.pros ? JSON.parse(resourceData.pros).length : 0,
        cons: resourceData.cons ? JSON.parse(resourceData.cons).length : 0,
        faq: resourceData.faq ? JSON.parse(resourceData.faq).length : 0,
        securityTips: resourceData.securityTips ? JSON.parse(resourceData.securityTips).length : 0
      }
    });

    // Criar recurso
    const resource = await prisma.resource.create({
      data: resourceData
    });

    console.log('✅ Recurso criado com sucesso:', {
      id: resource.id,
      slug: resource.slug,
      name: resource.name
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
  } catch (error: any) {
    console.error('❌ Erro ao criar recurso:', error);

    // Log detalhado do erro
    const errorDetails = {
      message: error.message,
      code: error.code,
      meta: error.meta,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
    console.error('Detalhes completos do erro:', JSON.stringify(errorDetails, null, 2));

    // Retornar mensagem mais específica
    const errorMessage = error.message || 'Erro ao criar recurso';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
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

    // ✅ REFATORAÇÃO: Suportar verified=all para mostrar todos
    if (verified !== null && verified !== 'all') {
      where.verified = verified === 'true';
    } else if (verified === null) {
      // Por padrão, mostrar apenas verificados
      where.verified = true;
    }
    // Se verified === 'all', não adiciona filtro (mostra todos)

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
  } catch (error: any) {
    console.error('❌ Erro ao buscar recursos:', error);

    // Log detalhado do erro
    const errorDetails = {
      message: error.message,
      code: error.code,
      meta: error.meta,
      name: error.name
    };
    console.error('Detalhes do erro:', JSON.stringify(errorDetails, null, 2));

    // Retornar mensagem mais específica
    const errorMessage = error.message || 'Erro ao buscar recursos';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}
