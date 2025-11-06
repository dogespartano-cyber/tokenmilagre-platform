import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/community-stories/[slug] - Buscar história específica
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const story = await prisma.communityStory.findUnique({
      where: { slug: params.slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            points: true,
            badges: true,
          },
        },
      },
    });

    if (!story) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: story,
    });
  } catch (error) {
    console.error('Error fetching community story:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch story' },
      { status: 500 }
    );
  }
}

// PATCH /api/community-stories/[slug] - Atualizar história
export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content, category, published, verified, featured, likes } = body;

    // Verificar permissões
    const story = await prisma.communityStory.findUnique({
      where: { slug: params.slug },
    });

    if (!story) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      );
    }

    // Apenas autor ou ADMIN/EDITOR pode editar
    const userRole = (session.user as any).role;
    const isOwner = story.userId === session.user.id;
    const isAdmin = userRole === 'ADMIN';
    const isEditor = userRole === 'EDITOR';

    if (!isOwner && !isAdmin && !isEditor) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Apenas ADMIN pode alterar verified e featured
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (published !== undefined) updateData.published = published;
    if (likes !== undefined) updateData.likes = likes;

    if (isAdmin) {
      if (verified !== undefined) updateData.verified = verified;
      if (featured !== undefined) updateData.featured = featured;
    }

    const updated = await prisma.communityStory.update({
      where: { slug: params.slug },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating community story:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update story' },
      { status: 500 }
    );
  }
}

// DELETE /api/community-stories/[slug] - Deletar história
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const story = await prisma.communityStory.findUnique({
      where: { slug: params.slug },
    });

    if (!story) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      );
    }

    // Apenas autor ou ADMIN pode deletar
    const userRole = (session.user as any).role;
    const isOwner = story.userId === session.user.id;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.communityStory.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({
      success: true,
      message: 'Story deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting community story:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete story' },
      { status: 500 }
    );
  }
}
