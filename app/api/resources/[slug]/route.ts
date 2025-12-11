import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/core/prisma';
import { requireAdmin } from '@/lib/shared/helpers/auth-helpers';

/**
 * PATCH /api/resources/[slug] - Atualizar recurso (ADMIN apenas)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;


    const { slug } = await params;
    const body = await request.json();

    // Verificar se recurso existe
    const existing = await prisma.resource.findUnique({
      where: { slug }
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Recurso não encontrado' },
        { status: 404 }
      );
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: any = {};

    // Campos simples
    if (body.name) updateData.name = body.name;
    if (body.category) updateData.category = body.category;
    if (body.shortDescription) updateData.shortDescription = body.shortDescription;
    if (body.officialUrl) updateData.officialUrl = body.officialUrl;
    if (body.heroTitle) updateData.heroTitle = body.heroTitle;
    if (body.heroDescription) updateData.heroDescription = body.heroDescription;
    if (body.heroGradient) updateData.heroGradient = body.heroGradient;
    if (body.whyGoodTitle) updateData.whyGoodTitle = body.whyGoodTitle;
    if (body.howToStartTitle) updateData.howToStartTitle = body.howToStartTitle;
    if (typeof body.verified === 'boolean') updateData.verified = body.verified;
    if (typeof body.showCompatibleWallets === 'boolean') updateData.showCompatibleWallets = body.showCompatibleWallets;

    // Campos JSON - garantir que sejam strings
    if (body.platforms) {
      updateData.platforms = typeof body.platforms === 'string' ? body.platforms : JSON.stringify(body.platforms);
    }
    if (body.tags) {
      updateData.tags = typeof body.tags === 'string' ? body.tags : JSON.stringify(body.tags);
    }
    if (body.whyGoodContent) {
      updateData.whyGoodContent = typeof body.whyGoodContent === 'string' ? body.whyGoodContent : JSON.stringify(body.whyGoodContent);
    }
    if (body.features) {
      updateData.features = typeof body.features === 'string' ? body.features : JSON.stringify(body.features);
    }
    if (body.howToStartSteps) {
      updateData.howToStartSteps = typeof body.howToStartSteps === 'string' ? body.howToStartSteps : JSON.stringify(body.howToStartSteps);
    }
    if (body.pros) {
      updateData.pros = typeof body.pros === 'string' ? body.pros : JSON.stringify(body.pros);
    }
    if (body.cons) {
      updateData.cons = typeof body.cons === 'string' ? body.cons : JSON.stringify(body.cons);
    }
    if (body.faq) {
      updateData.faq = typeof body.faq === 'string' ? body.faq : JSON.stringify(body.faq);
    }
    if (body.securityTips) {
      updateData.securityTips = typeof body.securityTips === 'string' ? body.securityTips : JSON.stringify(body.securityTips);
    }
    if (body.relatedResources !== undefined) {
      updateData.relatedResources = body.relatedResources
        ? (typeof body.relatedResources === 'string' ? body.relatedResources : JSON.stringify(body.relatedResources))
        : null;
    }

    // Atualizar timestamp
    updateData.updatedAt = new Date();

    // Atualizar recurso
    const updated = await prisma.resource.update({
      where: { slug },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Recurso atualizado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao atualizar recurso:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar recurso' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resources/[slug] - Deletar recurso (ADMIN apenas)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;


    const { slug } = await params;

    // Verificar se recurso existe
    const existing = await prisma.resource.findUnique({
      where: { slug }
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Recurso não encontrado' },
        { status: 404 }
      );
    }

    // Deletar recurso
    await prisma.resource.delete({
      where: { slug }
    });

    return NextResponse.json({
      success: true,
      message: 'Recurso deletado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao deletar recurso:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar recurso' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/resources/[slug] - Obter recurso específico (público)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const resource = await prisma.resource.findUnique({
      where: { slug }
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: 'Recurso não encontrado' },
        { status: 404 }
      );
    }

    // Incrementar views
    await prisma.resource.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      data: resource
    });

  } catch (error) {
    console.error('Erro ao buscar recurso:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar recurso' },
      { status: 500 }
    );
  }
}
