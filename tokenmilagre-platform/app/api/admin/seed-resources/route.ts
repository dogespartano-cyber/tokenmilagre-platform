import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Seed resources data from prisma/additional-resources
const seedResources = async () => {
  // Import resources from additional-resources
  const { additionalResources } = await import('@/prisma/additional-resources');

  let count = 0;

  for (const resource of additionalResources) {
    await prisma.resource.upsert({
      where: { slug: resource.slug },
      update: resource,
      create: resource,
    });
    count++;
  }

  return { success: true, count };
};

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is ADMIN
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Execute seed
    const result = await seedResources();

    return NextResponse.json({
      message: 'Resources seeded successfully',
      count: result.count,
    });
  } catch (error: any) {
    console.error('Error seeding resources:', error);
    return NextResponse.json(
      { error: 'Failed to seed resources', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check current resources count
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const count = await prisma.resource.count();
    const resources = await prisma.resource.findMany({
      select: {
        slug: true,
        name: true,
        category: true,
        verified: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      count,
      resources,
    });
  } catch (error: any) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources', details: error.message },
      { status: 500 }
    );
  }
}
