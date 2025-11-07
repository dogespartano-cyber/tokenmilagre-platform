'use client';

import { TokenBTC, TokenETH } from '@token-icons/react';

// ==========================================
// 📊 ETFs de Criptomoedas - CoinGlass
// ==========================================
//
// Este componente exibe iframes do CoinGlass com dados
// em tempo real de fluxos de ETFs de Bitcoin e Ethereum.
//
// ==========================================

export default function ETFMetricsSection() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2" style={{ color: "var(--text-primary)" }}>
          ETFs de Bitcoin e Ethereum
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Acompanhe os fluxos de investimento institucional em criptomoedas através dos ETFs aprovados nos EUA
        </p>
      </div>

      {/* Widget CoinGlass - Bitcoin */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <TokenBTC size={32} variant="branded" />
          <div>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
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
            <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
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
    </div>
  );
}
