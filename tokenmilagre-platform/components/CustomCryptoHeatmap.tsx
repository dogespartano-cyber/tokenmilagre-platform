'use client';

import { useState, useEffect } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}

interface TreemapData {
  name: string;
  symbol: string;
  size: number;
  change: number;
  price: number;
  image: string;
  rank: number;
}

// Custom content for treemap cells
interface CustomContentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  symbol: string;
  change: number;
  price: number;
  image: string;
  rank: number;
}

const CustomContent = (props: CustomContentProps) => {
  const { x, y, width, height, symbol, change, price, image, rank } = props;

  // Só mostrar conteúdo se o quadrado for grande o suficiente
  const isLargeEnough = width > 80 && height > 60;
  const isMedium = width > 60 && height > 40;

  // Definir cor baseada na variação
  const getColor = (change: number) => {
    if (change > 5) return '#10B981'; // Verde forte
    if (change > 0) return '#34D399'; // Verde claro
    if (change > -5) return '#EF4444'; // Vermelho claro
    return '#DC2626'; // Vermelho forte
  };

  const getBgColor = (change: number) => {
    if (change > 5) return 'rgba(16, 185, 129, 0.2)';
    if (change > 0) return 'rgba(16, 185, 129, 0.15)';
    if (change > -5) return 'rgba(239, 68, 68, 0.15)';
    return 'rgba(239, 68, 68, 0.2)';
  };

  const color = getColor(change);
  const bgColor = getBgColor(change);

  return (
    <g>
      {/* Background */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: bgColor,
          stroke: color,
          strokeWidth: 2,
          cursor: 'pointer',
        }}
        className="transition-all duration-300 hover:opacity-80"
      />

      {/* Conteúdo */}
      {isLargeEnough && (
        <>
          {/* Logo */}
          {image && (
            <image
              x={x + 8}
              y={y + 8}
              width={24}
              height={24}
              href={image}
              style={{ opacity: 0.9 }}
            />
          )}

          {/* Rank */}
          <text
            x={x + width - 8}
            y={y + 18}
            textAnchor="end"
            fill="#94A3B8"
            fontSize="11"
            fontWeight="600"
          >
            #{rank}
          </text>

          {/* Symbol */}
          <text
            x={x + 8}
            y={y + 45}
            fill="#E0E6ED"
            fontSize="14"
            fontWeight="700"
          >
            {symbol?.toUpperCase()}
          </text>

          {/* Price */}
          <text
            x={x + 8}
            y={y + 62}
            fill="#94A3B8"
            fontSize="11"
            fontFamily="monospace"
          >
            ${price < 1
              ? price.toFixed(6)
              : price.toLocaleString('en-US', { maximumFractionDigits: 2 })
            }
          </text>

          {/* Change % */}
          <text
            x={x + 8}
            y={y + height - 8}
            fill={color}
            fontSize="16"
            fontWeight="700"
            fontFamily="monospace"
          >
            {change > 0 ? '+' : ''}{change.toFixed(2)}%
          </text>
        </>
      )}

      {/* Conteúdo médio (só símbolo e %) */}
      {!isLargeEnough && isMedium && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill="#E0E6ED"
            fontSize="12"
            fontWeight="700"
          >
            {symbol?.toUpperCase()}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 8}
            textAnchor="middle"
            fill={color}
            fontSize="14"
            fontWeight="700"
            fontFamily="monospace"
          >
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </text>
        </>
      )}

      {/* Pequeno (só %) */}
      {!isLargeEnough && !isMedium && width > 30 && height > 20 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 4}
          textAnchor="middle"
          fill={color}
          fontSize="10"
          fontWeight="700"
          fontFamily="monospace"
        >
          {change > 0 ? '+' : ''}{change.toFixed(0)}%
        </text>
      )}
    </g>
  );
};

// Custom tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TreemapData;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gradient-to-br from-[#142841] to-[#1E3A5F] border-2 border-[#2A4A6E] rounded-lg p-4 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          {data.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.image} alt={data.name} className="w-8 h-8 rounded-full" />
          )}
          <div>
            <p className="text-[#FFFFFF] font-bold text-base">{data.name}</p>
            <p className="text-[#94A3B8] text-xs uppercase">{data.symbol}</p>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-[#94A3B8]">Rank:</span>
            <span className="text-[#E0E6ED] font-semibold">#{data.rank}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#94A3B8]">Preço:</span>
            <span className="text-[#FFFFFF] font-mono font-semibold">
              ${data.price < 1
                ? data.price.toFixed(6)
                : data.price.toLocaleString('en-US', { maximumFractionDigits: 2 })
              }
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#94A3B8]">Market Cap:</span>
            <span className="text-[#E0E6ED] font-mono">
              ${(data.size / 1e9).toFixed(2)}B
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#94A3B8]">24h:</span>
            <span className={`font-bold font-mono ${
              data.change >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
            }`}>
              {data.change > 0 ? '+' : ''}{data.change.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function CustomCryptoHeatmap() {
  const [data, setData] = useState<TreemapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h'
      );
      const json: CryptoData[] = await response.json();

      // Transform data for treemap
      const treemapData: TreemapData[] = json.map(coin => ({
        name: coin.name,
        symbol: coin.symbol,
        size: coin.market_cap,
        change: coin.price_change_percentage_24h || 0,
        price: coin.current_price,
        image: coin.image,
        rank: coin.market_cap_rank,
      }));

      setData(treemapData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#142841] to-[#1E3A5F] rounded-2xl p-12 border-2 border-[#2A4A6E] shadow-xl">
        <div className="flex flex-col items-center justify-center gap-4">
          <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 text-[#10B981] animate-spin" />
          <p className="text-[#94A3B8] text-lg">Carregando mapa de calor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#142841] to-[#1E3A5F] rounded-2xl border-2 border-[#2A4A6E] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#2A4A6E]/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-[#94A3B8]" />
          <p className="text-[#94A3B8] text-sm">
            Tamanho = Market Cap | Cor = Variação 24h | Top 50 moedas
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#10B981]"></div>
            <span className="text-[#94A3B8]">Alta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#EF4444]"></div>
            <span className="text-[#94A3B8]">Queda</span>
          </div>
        </div>
      </div>

      {/* Treemap */}
      <div className="p-4" style={{ height: '650px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="size"
            stroke="transparent"
            content={<CustomContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#2A4A6E]/60 text-center">
        <p className="text-[#64748B] text-xs">
          🔄 Atualizado a cada 60 segundos | Dados: CoinGecko API
        </p>
      </div>
    </div>
  );
}
