import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 0; // Sem cache - dados sempre atualizados

interface FearGreedResponse {
  data: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update: string;
  }>;
}

export async function GET() {
  try {
    const response = await fetch('https://api.alternative.me/fng/', {
      cache: 'no-store', // Sem cache - busca sempre dados frescos
    });

    if (!response.ok) {
      throw new Error(`Fear & Greed API error: ${response.status}`);
    }

    const data: FearGreedResponse = await response.json();

    return NextResponse.json({
      success: true,
      data: data.data[0],
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao buscar Fear & Greed Index:', error);

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
