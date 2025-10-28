import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Cache de 30 minutos para maximizar uso de cache
const CACHE_DURATION = 30 * 60 * 1000;

// Armazenar último fetch em memória
let lastFetch: { data: any[]; timestamp: number } | null = null;

export async function GET() {
  try {
    // Verificar cache em memória
    if (lastFetch && Date.now() - lastFetch.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: lastFetch.data,
        cached: true,
      });
    }

    // Buscar top 10 moedas do banco ordenadas por market cap rank
    const topCryptos = await prisma.cryptocurrency.findMany({
      where: {
        marketCapRank: {
          not: null,
        },
      },
      orderBy: {
        marketCapRank: 'asc',
      },
      take: 10,
      select: {
        id: true,
        slug: true,
        name: true,
        symbol: true,
        coingeckoId: true,
        currentPrice: true,
        priceChangePercentage24h: true,
        marketCapRank: true,
        imageSmall: true,
      },
    });

    // Atualizar cache em memória
    lastFetch = {
      data: topCryptos,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      success: true,
      data: topCryptos,
      cached: false,
    });
  } catch (error) {
    console.error('Erro ao buscar top criptomoedas:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar lista de criptomoedas',
      },
      { status: 500 }
    );
  }
}
