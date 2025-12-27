import { prisma } from '@/lib/core/prisma';
import CuriosityDetailClient from './CuriosityDetailClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const curiosity = await prisma.curiosity.findUnique({
        where: { slug }
    });

    if (!curiosity) return { title: 'Curiosidade não encontrada' };

    return {
        title: `${curiosity.content} | Curiosidades Token Milagre`,
        description: curiosity.description || curiosity.content,
    };
}

export default async function CuriosityPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const curiosity = await prisma.curiosity.findUnique({
        where: { slug }
    });

    if (!curiosity) {
        notFound();
    }

    // Convert dates to strings for client component
    const serializableCuriosity = {
        ...curiosity,
        createdAt: curiosity.createdAt.toISOString(),
        updatedAt: curiosity.updatedAt.toISOString(),
    };

    return <CuriosityDetailClient curiosity={serializableCuriosity as any} />;
}
