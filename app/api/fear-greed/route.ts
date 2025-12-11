import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface FearGreedResponse {
  data: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update: string;
  }>;
}

// Cache em memória
let cachedData: {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
} | null = null;
let cacheExpiry: number = 0;

export async function GET() {
  try {
    // Verificar se temos cache válido
    const now = Date.now();
    if (cachedData && now < cacheExpiry) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }

    // Buscar dados frescos
    const response = await fetch('https://api.alternative.me/fng/', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Fear & Greed API error: ${response.status}`);
    }

    const data: FearGreedResponse = await response.json();
    const fearGreedData = data.data[0];

    // Calcular quando o cache expira baseado no time_until_update
    const timeUntilUpdate = parseInt(fearGreedData.time_until_update);
    cachedData = fearGreedData;
    cacheExpiry = now + (timeUntilUpdate * 1000); // Converter segundos para milissegundos

    return NextResponse.json({
      success: true,
      data: fearGreedData,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao buscar Fear & Greed Index:', error);

    // Se temos cache antigo, retornar mesmo que expirado
    if (cachedData) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true,
        stale: true,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Falha ao buscar Fear & Greed Index',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
