import { NextRequest, NextResponse } from 'next/server';
import { requireEditor } from '@/lib/shared/helpers/auth-helpers';
import { prisma } from '@/lib/core/prisma';

// GET /api/project-map - Listar todos os pontos no mapa
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const state = searchParams.get('state');

    const where: any = {};

    if (city) {
      where.city = city;
    }

    if (state) {
      where.state = state;
    }

    const mapPoints = await prisma.projectMap.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Buscar informações dos projetos associados
    const projectIds = mapPoints.map((p: any) => p.projectId);
    const projects = await prisma.socialProject.findMany({
      where: {
        slug: { in: projectIds },
      },
      select: {
        slug: true,
        name: true,
        description: true,
        category: true,
        coverImage: true,
        fundingGoal: true,
        currentFunding: true,
        verified: true,
        active: true,
      },
    });

    // Criar mapa de projetos por slug
    const projectMap = new Map(projects.map((p: any) => [p.slug, p]));

    // Combinar dados
    const enrichedMapPoints = mapPoints.map((point: any) => ({
      ...point,
      project: projectMap.get(point.projectId) || null,
    }));

    return NextResponse.json({
      success: true,
      data: enrichedMapPoints,
    });
  } catch (error) {
    console.error('Error fetching project map:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch map data' },
      { status: 500 }
    );
  }
}

// POST /api/project-map - Criar ponto no mapa
export async function POST(req: NextRequest) {
  try {
    const auth = await requireEditor(req);
    if (!auth.success) return auth.response;

    const body = await req.json();
    const {
      projectId,
      latitude,
      longitude,
      address,
      city,
      state,
      country,
      markerColor,
      markerIcon,
    } = body;

    // Validações
    if (!projectId || latitude === undefined || longitude === undefined || !city || !state) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verificar se projeto existe
    const project = await prisma.socialProject.findUnique({
      where: { slug: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Verificar se já existe um ponto para este projeto
    const existing = await prisma.projectMap.findUnique({
      where: { projectId },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Map point already exists for this project' },
        { status: 409 }
      );
    }

    const mapPoint = await prisma.projectMap.create({
      data: {
        projectId,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        city,
        state,
        country: country || '',
        markerColor: markerColor || '#8B5CF6',
        markerIcon,
      },
    });

    return NextResponse.json({
      success: true,
      data: mapPoint,
    });
  } catch (error) {
    console.error('Error creating map point:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create map point' },
      { status: 500 }
    );
  }
}
