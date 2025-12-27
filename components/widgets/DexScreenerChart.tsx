'use client';

import { MISSION } from '@/lib/core/constants/mission';

interface DexScreenerChartProps {
  className?: string;
}

export function DexScreenerChart({ className = '' }: DexScreenerChartProps) {
  const TOKEN_ADDRESS = MISSION.BLOCKCHAIN.TOKEN_ADDRESS;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`https://dexscreener.com/solana/${TOKEN_ADDRESS}?embed=1&theme=dark&trades=0&info=0`}
          className="absolute top-0 left-0 w-full h-full rounded-2xl border-2 border-white/20"
          title="DexScreener Chart"
        />
      </div>
    </div>
  );
}
