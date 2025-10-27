import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Interface para os dados do CoinGecko
interface CoinGeckoData {
  id: string;
  symbol: string;
  name: string;
  description?: {
    pt?: string;
    en?: string;
  };
  links?: {
    homepage?: string[];
    whitepaper?: string;
    twitter_screen_name?: string;
    telegram_channel_identifier?: string;
    subreddit_url?: string;
    official_forum_url?: string[];
  };
  image?: {
    thumb?: string;
    small?: string;
    large?: string;
  };
  market_data?: {
    current_price?: { usd?: number };
    market_cap?: { usd?: number };
    market_cap_rank?: number;
    total_volume?: { usd?: number };
    high_24h?: { usd?: number };
    low_24h?: { usd?: number };
    price_change_24h?: number;
    price_change_percentage_24h?: number;
    circulating_supply?: number;
    total_supply?: number;
    max_supply?: number;
    ath?: { usd?: number };
    ath_date?: { usd?: string };
    atl?: { usd?: number };
    atl_date?: { usd?: string };
  };
  asset_platform_id?: string | null;
}

// Cache de 5 minutos
const CACHE_DURATION = 5 * 60 * 1000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // 1. Buscar no banco de dados
    const crypto = await prisma.cryptocurrency.findUnique({
      where: { slug },
    });

    // 2. Se existe e está atualizado (< 5 min), retornar do cache
    if (crypto) {
      const timeSinceUpdate = Date.now() - crypto.lastUpdated.getTime();
      if (timeSinceUpdate < CACHE_DURATION) {
        return NextResponse.json({
          success: true,
          data: crypto,
          cached: true,
        });
      }
    }

    // 3. Buscar dados atualizados do CoinGecko
    const coingeckoId = crypto?.coingeckoId || slug;
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coingeckoId}?localization=pt&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Criptomoeda não encontrada' },
          { status: 404 }
        );
      }
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: CoinGeckoData = await response.json();

    // 4. Preparar links sociais
    const socialLinks = data.links
      ? JSON.stringify({
          twitter: data.links.twitter_screen_name || null,
          telegram: data.links.telegram_channel_identifier || null,
          reddit: data.links.subreddit_url || null,
          forum: data.links.official_forum_url?.[0] || null,
        })
      : null;

    // 5. Determinar blockchain
    let blockchain = 'Própria';
    if (data.asset_platform_id === 'ethereum') blockchain = 'Ethereum';
    else if (data.asset_platform_id === 'solana') blockchain = 'Solana';
    else if (data.asset_platform_id === 'binance-smart-chain') blockchain = 'BSC';
    else if (data.asset_platform_id === 'polygon-pos') blockchain = 'Polygon';

    // 6. Preparar dados para o banco
    const cryptoData = {
      coingeckoId: data.id,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      slug: slug,

      // Dados de mercado
      currentPrice: data.market_data?.current_price?.usd || null,
      marketCap: data.market_data?.market_cap?.usd || null,
      marketCapRank: data.market_data?.market_cap_rank || null,
      totalVolume: data.market_data?.total_volume?.usd || null,
      high24h: data.market_data?.high_24h?.usd || null,
      low24h: data.market_data?.low_24h?.usd || null,
      priceChange24h: data.market_data?.price_change_24h || null,
      priceChangePercentage24h: data.market_data?.price_change_percentage_24h || null,
      circulatingSupply: data.market_data?.circulating_supply || null,
      totalSupply: data.market_data?.total_supply || null,
      maxSupply: data.market_data?.max_supply || null,
      ath: data.market_data?.ath?.usd || null,
      athDate: data.market_data?.ath_date?.usd ? new Date(data.market_data.ath_date.usd) : null,
      atl: data.market_data?.atl?.usd || null,
      atlDate: data.market_data?.atl_date?.usd ? new Date(data.market_data.atl_date.usd) : null,

      // Informações descritivas
      description: data.description?.pt || data.description?.en || null,
      homepage: data.links?.homepage?.[0] || null,
      whitepaper: data.links?.whitepaper || null,
      blockchain,

      // Links sociais
      socialLinks,

      // Imagens
      imageSmall: data.image?.small || null,
      imageLarge: data.image?.large || null,

      lastUpdated: new Date(),
    };

    // 7. Criar ou atualizar no banco
    const savedCrypto = await prisma.cryptocurrency.upsert({
      where: { slug },
      update: cryptoData,
      create: cryptoData,
    });

    return NextResponse.json({
      success: true,
      data: savedCrypto,
      cached: false,
    });
  } catch (error) {
    console.error('Erro ao buscar criptomoeda:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar dados da criptomoeda',
      },
      { status: 500 }
    );
  }
}
