'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowTrendUp,
  faArrowTrendDown,
  faChartLine,
  faExternalLinkAlt,
  faInfoCircle,
  faCalendarDays,
  faDollarSign,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';

// ==========================================
// 📊 DADOS DE ETFs - ATUALIZAR SEMANALMENTE
// ==========================================
//
// Como atualizar em nova sessão do Claude:
// 1. Peça: "Atualize os dados dos ETFs em components/ETFMetricsSection.tsx"
// 2. Forneça dados atualizados de Farside Investors:
//    - Bitcoin: https://farside.co.uk/btc/
//    - Ethereum: https://farside.co.uk/eth/
// 3. Ou peça ao Claude para buscar os dados mais recentes dessas fontes
//
// Última atualização: 2025-10-28
// Próxima atualização recomendada: Toda segunda-feira
// ==========================================

const ETF_DATA = {
  bitcoin: {
    name: 'Bitcoin ETFs (EUA)',
    symbol: 'BTC',
    lastUpdate: '2025-10-28',              // ← ATUALIZAR
    totalAUM: '$60.8B',                    // ← ATUALIZAR (Total Assets Under Management)
    inflows7d: '$5.2B',                    // ← ATUALIZAR (Soma últimos 7 dias)
    inflows30d: '$12.4B',                  // ← ATUALIZAR (Soma últimos 30 dias)
    topETFs: [
      { name: 'BlackRock IBIT', share: '48%', aum: '$29.2B' },  // ← ATUALIZAR
      { name: 'Fidelity FBTC', share: '21%', aum: '$12.8B' },   // ← ATUALIZAR
      { name: 'Grayscale GBTC', share: '15%', aum: '$9.1B' }    // ← ATUALIZAR
    ],
    trend: 'positive' as const,            // ← ATUALIZAR se necessário ('positive' | 'negative')
    description: 'ETFs de Bitcoin Spot aprovados pela SEC em janeiro de 2024, permitindo exposição regulada ao BTC.'
  },
  ethereum: {
    name: 'Ethereum ETFs (EUA)',
    symbol: 'ETH',
    lastUpdate: '2025-10-28',              // ← ATUALIZAR
    totalAUM: '$8.9B',                     // ← ATUALIZAR (Total Assets Under Management)
    inflows7d: '$1.89B',                   // ← ATUALIZAR (Soma últimos 7 dias)
    inflows30d: '$3.2B',                   // ← ATUALIZAR (Soma últimos 30 dias)
    topETFs: [
      { name: 'BlackRock ETHA', share: '42%', aum: '$3.7B' },   // ← ATUALIZAR
      { name: 'Fidelity FETH', share: '24%', aum: '$2.1B' },    // ← ATUALIZAR
      { name: 'Grayscale ETHE', share: '18%', aum: '$1.6B' }    // ← ATUALIZAR
    ],
    trend: 'positive' as const,            // ← ATUALIZAR se necessário ('positive' | 'negative')
    description: 'ETFs de Ethereum Spot lançados em julho de 2024, oferecendo acesso institucional ao ETH.'
  }
};

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
  const getTrendIcon = (trend: 'positive' | 'negative') => {
    return trend === 'positive' ? faArrowTrendUp : faArrowTrendDown;
  };

  const getTrendColor = (trend: 'positive' | 'negative') => {
    return trend === 'positive' ? '#22c55e' : '#ef4444';
  };

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

      {/* Aviso de Atualização */}
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
            Dados de Referência
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Métricas atualizadas semanalmente. Para dados em tempo real, acesse as fontes oficiais abaixo.
          </p>
        </div>
      </div>

      {/* ETF Cards Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bitcoin ETF Card */}
        <div
          className="rounded-2xl p-6 border shadow-lg"
          style={{
            background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-secondary) 100%)',
            borderColor: 'var(--border-light)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {ETF_DATA.bitcoin.name}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Atualizado: {new Date(ETF_DATA.bitcoin.lastUpdate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <FontAwesomeIcon
              icon={getTrendIcon(ETF_DATA.bitcoin.trend)}
              className="w-8 h-8"
              style={{ color: getTrendColor(ETF_DATA.bitcoin.trend) }}
            />
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faDollarSign} className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  AUM Total
                </p>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {ETF_DATA.bitcoin.totalAUM}
              </p>
            </div>

            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faCalendarDays} className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Inflows 7d
                </p>
              </div>
              <p className="text-2xl font-bold" style={{ color: getTrendColor(ETF_DATA.bitcoin.trend) }}>
                {ETF_DATA.bitcoin.inflows7d}
              </p>
            </div>
          </div>

          {/* Top ETFs */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faBuilding} className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
              <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Principais ETFs
              </h4>
            </div>
            <div className="space-y-2">
              {ETF_DATA.bitcoin.topETFs.map((etf, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {etf.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {etf.aum}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold px-2 py-1 rounded"
                    style={{
                      backgroundColor: 'var(--brand-primary)',
                      color: 'var(--text-inverse)'
                    }}
                  >
                    {etf.share}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {ETF_DATA.bitcoin.description}
          </p>
        </div>

        {/* Ethereum ETF Card */}
        <div
          className="rounded-2xl p-6 border shadow-lg"
          style={{
            background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-secondary) 100%)',
            borderColor: 'var(--border-light)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {ETF_DATA.ethereum.name}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Atualizado: {new Date(ETF_DATA.ethereum.lastUpdate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <FontAwesomeIcon
              icon={getTrendIcon(ETF_DATA.ethereum.trend)}
              className="w-8 h-8"
              style={{ color: getTrendColor(ETF_DATA.ethereum.trend) }}
            />
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faDollarSign} className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  AUM Total
                </p>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {ETF_DATA.ethereum.totalAUM}
              </p>
            </div>

            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faCalendarDays} className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Inflows 7d
                </p>
              </div>
              <p className="text-2xl font-bold" style={{ color: getTrendColor(ETF_DATA.ethereum.trend) }}>
                {ETF_DATA.ethereum.inflows7d}
              </p>
            </div>
          </div>

          {/* Top ETFs */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faBuilding} className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
              <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Principais ETFs
              </h4>
            </div>
            <div className="space-y-2">
              {ETF_DATA.ethereum.topETFs.map((etf, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {etf.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {etf.aum}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold px-2 py-1 rounded"
                    style={{
                      backgroundColor: 'var(--brand-primary)',
                      color: 'var(--text-inverse)'
                    }}
                  >
                    {etf.share}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {ETF_DATA.ethereum.description}
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

      {/* Fontes de Dados Completos */}
      <div
        className="rounded-2xl p-6 border shadow-md"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-light)',
        }}
      >
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Ver Dados Completos em Tempo Real
        </h3>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          Acesse as principais fontes de dados de ETFs para informações atualizadas diariamente:
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
