import { prisma } from '../lib/prisma';

// Top 10 criptomoedas principais (para testar primeiro)
const TOP_CRYPTOS = [
  { coingeckoId: 'bitcoin', slug: 'bitcoin' },
  { coingeckoId: 'ethereum', slug: 'ethereum' },
  { coingeckoId: 'tether', slug: 'tether' },
  { coingeckoId: 'binancecoin', slug: 'bnb' },
  { coingeckoId: 'solana', slug: 'solana' },
  { coingeckoId: 'ripple', slug: 'xrp' },
  { coingeckoId: 'cardano', slug: 'cardano' },
  { coingeckoId: 'dogecoin', slug: 'dogecoin' },
  { coingeckoId: 'polygon', slug: 'polygon' },
  { coingeckoId: 'chainlink', slug: 'chainlink' },
];

async function seedCryptocurrencies() {
  console.log('🚀 Iniciando seed de criptomoedas...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const crypto of TOP_CRYPTOS) {
    try {
      console.log(`📊 Buscando dados de ${crypto.coingeckoId}...`);

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${crypto.coingeckoId}?localization=pt&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API retornou ${response.status}`);
      }

      const data: any = await response.json();

      // Preparar links sociais
      const socialLinks = data.links
        ? JSON.stringify({
            twitter: data.links.twitter_screen_name || null,
            telegram: data.links.telegram_channel_identifier || null,
            reddit: data.links.subreddit_url || null,
            forum: data.links.official_forum_url?.[0] || null,
          })
        : null;

      // Determinar blockchain
      let blockchain = 'Própria';
      if (data.asset_platform_id === 'ethereum') blockchain = 'Ethereum';
      else if (data.asset_platform_id === 'solana') blockchain = 'Solana';
      else if (data.asset_platform_id === 'binance-smart-chain') blockchain = 'BSC';
      else if (data.asset_platform_id === 'polygon-pos') blockchain = 'Polygon';

      // Criar/atualizar no banco
      await prisma.cryptocurrency.upsert({
        where: { slug: crypto.slug },
        update: {
          coingeckoId: data.id,
          symbol: data.symbol.toUpperCase(),
          name: data.name,
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
          description: data.description?.pt || data.description?.en || null,
          homepage: data.links?.homepage?.[0] || null,
          whitepaper: data.links?.whitepaper || null,
          blockchain,
          socialLinks,
          imageSmall: data.image?.small || null,
          imageLarge: data.image?.large || null,
          lastUpdated: new Date(),
        },
        create: {
          coingeckoId: data.id,
          symbol: data.symbol.toUpperCase(),
          name: data.name,
          slug: crypto.slug,
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
          description: data.description?.pt || data.description?.en || null,
          homepage: data.links?.homepage?.[0] || null,
          whitepaper: data.links?.whitepaper || null,
          blockchain,
          socialLinks,
          imageSmall: data.image?.small || null,
          imageLarge: data.image?.large || null,
        },
      });

      console.log(`✅ ${data.name} (${data.symbol.toUpperCase()}) - Salvo com sucesso!`);
      successCount++;

      // Delay para respeitar rate limit do CoinGecko (aumentado para 6s = 10 calls/min)
      await new Promise((resolve) => setTimeout(resolve, 6000));
    } catch (error) {
      console.error(`❌ Erro ao processar ${crypto.coingeckoId}:`, error);
      errorCount++;
    }
  }

  console.log(`\n✨ Seed concluído!`);
  console.log(`   ✅ Sucesso: ${successCount} moedas`);
  console.log(`   ❌ Erros: ${errorCount} moedas`);
}

// Executar seed
seedCryptocurrencies()
  .then(() => {
    console.log('\n🎉 Processo finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
