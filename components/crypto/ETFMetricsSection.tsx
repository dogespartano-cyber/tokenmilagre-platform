'use client';

import { TokenBTC, TokenETH, TokenSOL } from '@token-icons/react';

// ==========================================
// 📊 ETFs de Criptomoedas - CoinGlass
// ==========================================
//
// Este componente exibe iframes do CoinGlass com dados
// em tempo real de fluxos de ETFs de Bitcoin, Ethereum e Solana.
//
// ==========================================

export default function ETFMetricsSection() {
 return (
  <div className="space-y-8">
   {/* Widget CoinGlass - Bitcoin */}
   <div className="space-y-4">
    <div className="flex items-center gap-3">
     <TokenBTC size={32} variant="branded" />
     <div>
<h3 className="title-newtab text-2xl" style={{ color: 'var(--text-primary)' }}>
       Bitcoin ETF - Fluxos Diários
      </h3>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
       Dados atualizados em tempo real via CoinGlass
      </p>
     </div>
    </div>
    <div className="backdrop-blur-xl rounded-2xl p-2 border-2 shadow-2xl overflow-hidden" style={{
     backgroundColor: 'var(--bg-elevated)',
     borderColor: 'var(--border-medium)'
    }}>
     <div className="rounded-xl overflow-hidden" style={{
      height: '600px',
      maxHeight: '70vh'
     }}>
      <iframe
       src="https://www.coinglass.com/bitcoin-etf"
       className="w-full h-full"
       style={{ border: 'none' }}
       loading="lazy"
       title="Bitcoin ETF Flows - CoinGlass"
      />
     </div>
    </div>
   </div>

   {/* Widget CoinGlass - Ethereum */}
   <div className="space-y-4">
    <div className="flex items-center gap-3">
     <TokenETH size={32} variant="branded" />
     <div>
<h3 className="title-newtab text-2xl" style={{ color: 'var(--text-primary)' }}>
       Ethereum ETF - Fluxos Diários
      </h3>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
       Dados atualizados em tempo real via CoinGlass
      </p>
     </div>
    </div>
    <div className="backdrop-blur-xl rounded-2xl p-2 border-2 shadow-2xl overflow-hidden" style={{
     backgroundColor: 'var(--bg-elevated)',
     borderColor: 'var(--border-medium)'
    }}>
     <div className="rounded-xl overflow-hidden" style={{
      height: '600px',
      maxHeight: '70vh'
     }}>
      <iframe
       src="https://www.coinglass.com/eth-etf"
       className="w-full h-full"
       style={{ border: 'none' }}
       loading="lazy"
       title="Ethereum ETF Flows - CoinGlass"
      />
     </div>
    </div>
   </div>

   {/* Widget CoinGlass - Solana */}
   <div className="space-y-4">
    <div className="flex items-center gap-3">
     <TokenSOL size={32} variant="branded" />
     <div>
<h3 className="title-newtab text-2xl" style={{ color: 'var(--text-primary)' }}>
       Solana ETF - Fluxos Diários
      </h3>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
       Dados atualizados em tempo real via CoinGlass
      </p>
     </div>
    </div>
    <div className="backdrop-blur-xl rounded-2xl p-2 border-2 shadow-2xl overflow-hidden" style={{
     backgroundColor: 'var(--bg-elevated)',
     borderColor: 'var(--border-medium)'
    }}>
     <div className="rounded-xl overflow-hidden" style={{
      height: '600px',
      maxHeight: '70vh'
     }}>
      <iframe
       src="https://www.coinglass.com/sol-etf"
       className="w-full h-full"
       style={{ border: 'none' }}
       loading="lazy"
       title="Solana ETF Flows - CoinGlass"
      />
     </div>
    </div>
   </div>
  </div>
 );
}
