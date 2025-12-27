import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/core/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const curiosity = await prisma.curiosity.findUnique({
            where: { slug }
        });

        if (!curiosity) {
            return NextResponse.json({ error: 'Curiosity not found' }, { status: 404 });
        }

        return NextResponse.json(curiosity);
    } catch (error) {
        console.error('Error fetching curiosity detail:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
