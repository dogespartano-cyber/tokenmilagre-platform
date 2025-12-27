import { NextResponse } from 'next/server';
import { prisma } from '@/lib/core/prisma';

export async function GET() {
    try {
        const curiosities = await prisma.curiosity.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(curiosities);
    } catch (error) {
        console.error('Error fetching curiosities:', error);
        return NextResponse.json({ error: 'Failed to fetch curiosities' }, { status: 500 });
    }
}
