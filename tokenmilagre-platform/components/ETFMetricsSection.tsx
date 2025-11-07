'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faExternalLinkAlt,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { TokenBTC, TokenETH } from '@token-icons/react';

// ==========================================
// 📊 ETFs de Criptomoedas - Dados em Tempo Real
// ==========================================
//
// Este componente exibe informações educacionais sobre ETFs
// e fornece links diretos para fontes de dados em tempo real.
// Não há dados estáticos que precisam ser atualizados manualmente.
//
// ==========================================

const EXTERNAL_SOURCES = [
  {
    name: 'Farside Investors',
    description: 'Dados diários atualizados em tempo real',
    urls: {
      bitcoin: 'https://farside.co.uk/btc/',
      ethereum: 'https://farside.co.uk/eth/'
    },
    icon: faChartLine
  },
  {
    name: 'CoinGlass',
    description: 'Dashboard completo com histórico',
    urls: {
      bitcoin: 'https://www.coinglass.com/bitcoin-etf',
      ethereum: 'https://www.coinglass.com/eth-etf'
    },
    icon: faChartLine
  },
  {
    name: 'SoSoValue',
    description: 'Análise detalhada e métricas',
    urls: {
      bitcoin: 'https://m.sosovalue.com/assets/etf/us-btc-spot',
      ethereum: 'https://m.sosovalue.com/assets/etf/us-eth-spot'
    },
    icon: faChartLine
  }
];

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

      {/* Aviso de Tempo Real */}
      <div
        className="rounded-xl p-4 border flex items-start gap-3"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-light)',
        }}
      >
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="w-5 h-5 mt-0.5"
          style={{ color: 'var(--brand-primary)' }}
        />
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Dados em Tempo Real
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Acesse as fontes oficiais abaixo para visualizar métricas atualizadas diariamente sobre fluxos de ETFs de criptomoedas.
          </p>
        </div>
      </div>

      {/* Seção Educacional */}
      <div
        className="rounded-2xl p-6 border shadow-md"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-light)',
        }}
      >
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          O que são ETFs de Criptomoedas?
        </h3>
        <div className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
          <p>
            <strong>ETF (Exchange-Traded Fund)</strong> é um fundo de investimento negociado em bolsa que permite investir em Bitcoin ou Ethereum sem precisar comprar e armazenar as moedas diretamente.
          </p>
          <p>
            <strong>Por que importam?</strong> Os ETFs facilitam o acesso institucional e de investidores tradicionais ao mercado cripto, trazendo bilhões em capital novo.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Inflows (entradas):</strong> Dinheiro novo entrando nos ETFs - sinal de demanda crescente</li>
            <li><strong>Outflows (saídas):</strong> Dinheiro saindo dos ETFs - pode indicar realização de lucros ou aversão ao risco</li>
            <li><strong>AUM (Assets Under Management):</strong> Total de ativos sob gestão dos ETFs</li>
          </ul>
        </div>
      </div>

      {/* Widget Farside Investors - Bitcoin */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <TokenBTC size={32} variant="branded" />
          <div>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Bitcoin ETF - Fluxos Diários
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Dados atualizados em tempo real via Farside Investors
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
              src="https://farside.co.uk/btc/"
              className="w-full h-full"
              style={{ border: 'none' }}
              loading="lazy"
              title="Bitcoin ETF Flows - Farside Investors"
            />
          </div>
        </div>
      </div>

      {/* Widget Farside Investors - Ethereum */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <TokenETH size={32} variant="branded" />
          <div>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Ethereum ETF - Fluxos Diários
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Dados atualizados em tempo real via Farside Investors
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
              src="https://farside.co.uk/eth/"
              className="w-full h-full"
              style={{ border: 'none' }}
              loading="lazy"
              title="Ethereum ETF Flows - Farside Investors"
            />
          </div>
        </div>
      </div>

      {/* Fontes de Dados Completos */}
      <div
        className="rounded-2xl p-6 border shadow-md"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-light)',
        }}
      >
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Outras Fontes de Dados em Tempo Real
        </h3>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          Explore análises detalhadas e dashboards completos sobre ETFs de criptomoedas:
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXTERNAL_SOURCES.map((source, index) => (
            <div
              key={index}
              className="rounded-xl p-5 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon
                  icon={source.icon}
                  className="w-5 h-5"
                  style={{ color: 'var(--brand-primary)' }}
                />
                <h4 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {source.name}
                </h4>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {source.description}
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={source.urls.bitcoin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-80"
                  style={{
                    background: 'linear-gradient(135deg, #f7931a, #e88c0c)',
                    color: 'white'
                  }}
                >
                  <span>Bitcoin ETF</span>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
                </a>
                <a
                  href={source.urls.ethereum}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-80"
                  style={{
                    background: 'linear-gradient(135deg, #627eea, #5269d4)',
                    color: 'white'
                  }}
                >
                  <span>Ethereum ETF</span>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
