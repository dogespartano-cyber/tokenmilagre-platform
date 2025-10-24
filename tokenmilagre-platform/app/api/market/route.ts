import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 60; // Cache por 60 segundos

interface CoinGeckoGlobalData {
  data: {
    total_market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    market_cap_percentage: {
      btc: number;
      eth: number;
    };
    market_cap_change_percentage_24h_usd: number;
  };
}

export async function GET() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/global', {
      next: {
        revalidate: 60, // Cache por 60 segundos
      },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: CoinGeckoGlobalData = await response.json();

    // Formatar dados para o frontend
    const marketData = {
      totalMarketCap: data.data.total_market_cap.usd,
      totalVolume: data.data.total_volume.usd,
      btcDominance: data.data.market_cap_percentage.btc,
      ethDominance: data.data.market_cap_percentage.eth,
      marketCapChange24h: data.data.market_cap_change_percentage_24h_usd,
    };

    return NextResponse.json({
      success: true,
      data: marketData,
      cached: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao buscar dados do mercado:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Falha ao buscar dados do mercado',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
