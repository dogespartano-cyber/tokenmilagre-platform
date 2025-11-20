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

    // Log para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('📦 Criando recurso:', {
        name: resourceData.name,
        slug: resourceData.slug,
        category: resourceData.category,
        fieldsCount: Object.keys(resourceData).length
      });
    }

    // Criar recurso
    const resource = await prisma.resource.create({
      data: resourceData
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
      name: error.name
    };
    console.error('Detalhes do erro:', JSON.stringify(errorDetails, null, 2));

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

    // Importar a função de parse se não estiver importada, ou implementar inline se necessário
    // Como não posso adicionar imports facilmente no topo sem ler o arquivo todo de novo e arriscar,
    // vou implementar uma versão simplificada do parse aqui mesmo ou usar o helper se conseguir importar.
    // O arquivo já tem imports no topo. Vou assumir que preciso adicionar o import ou copiar a lógica.
    // Melhor: vou usar a lógica de parse aqui mesmo para garantir.

    const parsedResources = resources.map(resource => ({
      ...resource,
      platforms: JSON.parse(resource.platforms || '[]'),
      tags: JSON.parse(resource.tags || '[]'),
      whyGoodContent: JSON.parse(resource.whyGoodContent || '[]'),
      features: JSON.parse(resource.features || '[]'),
      howToStartSteps: JSON.parse(resource.howToStartSteps || '[]'),
      pros: JSON.parse(resource.pros || '[]'),
      cons: JSON.parse(resource.cons || '[]'),
      faq: JSON.parse(resource.faq || '[]'),
      securityTips: JSON.parse(resource.securityTips || '[]'),
      relatedResources: resource.relatedResources ? JSON.parse(resource.relatedResources) : null
    }));

    return NextResponse.json({
      success: true,
      data: parsedResources
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
