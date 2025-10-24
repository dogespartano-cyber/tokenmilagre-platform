import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 60; // Cache por 60 segundos

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
      next: {
        revalidate: 60, // Cache por 60 segundos
      },
    });

    if (!response.ok) {
      throw new Error(`Fear & Greed API error: ${response.status}`);
    }

    const data: FearGreedResponse = await response.json();

    return NextResponse.json({
      success: true,
      data: data.data[0],
      cached: true,
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
