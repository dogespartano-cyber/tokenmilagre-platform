import { NextRequest, NextResponse } from 'next/server';
import { requireEditor, requireAdmin } from '@/lib/shared/helpers/auth-helpers';
import { prisma } from '@/lib/core/prisma';

// GET /api/social-projects/[slug] - Buscar projeto específico
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const project = await prisma.socialProject.findUnique({
      where: { slug: slug },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Incrementar views
    await prisma.socialProject.update({
      where: { slug: slug },
      data: { views: { increment: 1 } },
    });

    // Parsear campos JSON
    const parsed = {
      ...project,
      tags: project.tags ? JSON.parse(project.tags) : [],
      gallery: project.gallery ? JSON.parse(project.gallery) : [],
      views: project.views + 1,
    };

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error('Error fetching social project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PATCH /api/social-projects/[slug] - Atualizar projeto
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const auth = await requireEditor(req);
    if (!auth.success) return auth.response;

    const { user } = auth;

    const body = await req.json();
    const updateData: any = {};

    // Campos permitidos para atualização
    const allowedFields = [
      'name',
      'description',
      'longDescription',
      'fundingGoal',
      'currentFunding',
      'currency',
      'walletAddress',
      'category',
      'location',
      'startDate',
      'endDate',
      'coverImage',
      'organizer',
      'organizerEmail',
      'organizerPhone',
      'active',
      'supporters',
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        if (field === 'fundingGoal' || field === 'currentFunding') {
          updateData[field] = parseFloat(body[field]);
        } else if (field === 'startDate' || field === 'endDate') {
          updateData[field] = body[field] ? new Date(body[field]) : null;
        } else {
          updateData[field] = body[field];
        }
      }
    });

    // Arrays JSON
    if (body.tags !== undefined) {
      updateData.tags = JSON.stringify(body.tags);
    }
    if (body.gallery !== undefined) {
      updateData.gallery = JSON.stringify(body.gallery);
    }

    // Apenas ADMIN pode alterar verified e featured
    if (user.role === 'ADMIN') {
      if (body.verified !== undefined) updateData.verified = body.verified;
      if (body.featured !== undefined) updateData.featured = body.featured;
    }

    const updated = await prisma.socialProject.update({
      where: { slug: slug },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating social project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/social-projects/[slug] - Deletar projeto
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const auth = await requireAdmin(req);
    if (!auth.success) return auth.response;

    await prisma.socialProject.delete({
      where: { slug: slug },
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting social project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
