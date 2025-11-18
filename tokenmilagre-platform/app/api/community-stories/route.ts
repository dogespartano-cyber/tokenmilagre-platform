import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma, StoryCategory } from '@/lib/generated/prisma';

// GET /api/community-stories - Listar histórias
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: Prisma.CommunityStoryWhereInput = {};

    if (category && Object.values(StoryCategory).includes(category as StoryCategory)) {
      where.category = category as StoryCategory;
    }

    if (published !== null) {
      where.published = published === 'true';
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const [stories, total] = await Promise.all([
      prisma.communityStory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.communityStory.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: stories,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + stories.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching community stories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}

// POST /api/community-stories - Criar história
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
      slug,
      title,
      content,
      category,
      authorName,
      authorAvatar,
      published = false,
    } = body;

    // Validações
    if (!slug || !title || !content || !category || !authorName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validar categoria
    if (!Object.values(StoryCategory).includes(category as StoryCategory)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category. Must be: transformation, social_project, or achievement' },
        { status: 400 }
      );
    }

    // Verificar se slug já existe
    const existing = await prisma.communityStory.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 409 }
      );
    }

    const story = await prisma.communityStory.create({
      data: {
        slug,
        title,
        content,
        category: category as StoryCategory,
        authorName,
        authorAvatar,
        userId: session.user.id,
        published,
        verified: false, // Apenas ADMIN pode marcar como verified
      },
    });

    return NextResponse.json({
      success: true,
      data: story,
    });
  } catch (error) {
    console.error('Error creating community story:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create story' },
      { status: 500 }
    );
  }
}
