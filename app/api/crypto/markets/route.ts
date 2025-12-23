import { NextResponse } from 'next/server';

export const revalidate = 60; // Cache por 60 segundos no nível do Next.js

/**
 * Proxy para a API da CoinGecko (Markets)
 * Evita CORS e permite controle de rate limit (429) no servidor.
 */
export async function GET() {
    try {
        const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h,24h,7d';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: {
                revalidate: 60, // Cache de 1 minuto
            },
        });

        if (!response.ok) {
            if (response.status === 429) {
                return NextResponse.json(
                    { error: 'Rate limit exceeded', status: 429 },
                    { status: 429 }
                );
            }
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            }
        });
    } catch (error) {
        console.error('Erro no proxy de crypto data:', error);
        return NextResponse.json(
            { error: 'Falha ao buscar dados de cripto', message: error instanceof Error ? error.message : 'Erro desconhecido' },
            { status: 500 }
        );
    }
}
