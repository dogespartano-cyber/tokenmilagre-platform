import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/social-projects - Listar projetos sociais
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const verified = searchParams.get('verified');
    const active = searchParams.get('active');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (verified === 'true') {
      where.verified = true;
    }

    if (active !== null) {
      where.active = active === 'true';
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const [projects, total] = await Promise.all([
      prisma.socialProject.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.socialProject.count({ where }),
    ]);

    // Parsear campos JSON
    const parsedProjects = projects.map((project) => ({
      ...project,
      tags: project.tags ? JSON.parse(project.tags) : [],
      gallery: project.gallery ? JSON.parse(project.gallery) : [],
    }));

    return NextResponse.json({
      success: true,
      data: parsedProjects,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + projects.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching social projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/social-projects - Criar projeto social
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Apenas ADMIN e EDITOR podem criar projetos
    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN' && userRole !== 'EDITOR') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      slug,
      name,
      description,
      longDescription,
      fundingGoal,
      currentFunding,
      currency,
      walletAddress,
      category,
      location,
      tags,
      startDate,
      endDate,
      coverImage,
      gallery,
      organizer,
      organizerEmail,
      organizerPhone,
      verified = false,
      active = true,
    } = body;

    // Validações
    if (!slug || !name || !description || !fundingGoal || !category || !startDate || !organizer) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verificar se slug já existe
    const existing = await prisma.socialProject.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 409 }
      );
    }

    const project = await prisma.socialProject.create({
      data: {
        slug,
        name,
        description,
        longDescription,
        fundingGoal: parseFloat(fundingGoal),
        currentFunding: currentFunding ? parseFloat(currentFunding) : 0,
        currency: currency || 'BRL',
        walletAddress,
        category,
        location,
        tags: tags ? JSON.stringify(tags) : null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        coverImage,
        gallery: gallery ? JSON.stringify(gallery) : null,
        organizer,
        organizerEmail,
        organizerPhone,
        verified: userRole === 'ADMIN' ? verified : false, // Apenas ADMIN pode marcar como verificado
        active,
      },
    });

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error creating social project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
