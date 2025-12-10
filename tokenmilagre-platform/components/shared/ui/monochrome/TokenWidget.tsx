/**
 * TokenWidget Component - Sem Roxo
 *
 * Widget dedicado para exibir métricas financeiras do token
 * Deve ser usado APENAS na página /token, NÃO no header
 *
 * Funcionalidades:
 * - Exibir preço atual
 * - Exibir variação 24h
 * - Exibir market cap
 * - Exibir volume 24h
 * - Link para comprar
 *
 * Acessibilidade:
 * - Marcação semântica
 * - ARIA labels para valores dinâmicos
 * - Contraste adequado
 */

'use client';

import { useState, useEffect } from 'react';
import Button from './Button';

interface TokenData {
  price?: number;
  change24h?: number;
  marketCap?: number;
  volume24h?: number;
  lastUpdate?: Date;
}

interface TokenWidgetProps {
  tokenAddress?: string;
  variant?: 'compact' | 'full';
  showBuyButton?: boolean;
}

export default function TokenWidget({
  tokenAddress = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump',
  variant = 'full',
  showBuyButton = true
}: TokenWidgetProps) {
  const [tokenData, setTokenData] = useState<TokenData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulated data - replace with actual API call
    const fetchTokenData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call to pump.fun or Solana blockchain
        // const response = await fetch(`/api/token/${tokenAddress}`);
        // const data = await response.json();

        // Simulated data for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));

        setTokenData({
          price: 0.000123,
          change24h: 5.67,
          marketCap: 1234567,
          volume24h: 98765,
          lastUpdate: new Date()
        });
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados do token');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, [tokenAddress]);

  const formatPrice = (price?: number) => {
    if (!price) return '--';
    return `$${price.toFixed(6)}`;
  };

  const formatChange = (change?: number) => {
    if (change === undefined) return '--';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const formatLargeNumber = (num?: number) => {
    if (!num) return '--';
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  return (
    <>
      <style jsx>{`
        .token-widget {
          background-color: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
        }

        .token-widget-compact {
          padding: 1rem;
        }

        .token-widget-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-light);
        }

        .token-widget-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .token-widget-live {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-tertiary);
        }

        .live-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--color-accent);
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .token-widget-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .token-widget-compact .token-widget-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .metric {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metric-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font-display);
        }

        .metric-value-small {
          font-size: 1.125rem;
        }

        .metric-change {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .metric-change-positive {
          color: var(--color-green);
        }

        .metric-change-negative {
          color: var(--color-red);
        }

        .token-widget-footer {
          padding-top: 1rem;
          border-top: 1px solid var(--border-light);
        }

        .loading-skeleton {
          background: linear-gradient(
            90deg,
            var(--bg-page) 0%,
            var(--border-light) 50%,
            var(--bg-page) 100%
          );
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          height: 1.5rem;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .error-message {
          padding: 1rem;
          background-color: var(--state-error-bg);
          color: var(--state-error);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          text-align: center;
        }
      `}</style>

      <div className={`token-widget ${variant === 'compact' ? 'token-widget-compact' : ''}`}>
        <div className="token-widget-header">
          <h3 className="token-widget-title">$MILAGRE</h3>
          <div className="token-widget-live">
            <span className="live-indicator" aria-hidden="true"></span>
            <span>Ao vivo</span>
          </div>
        </div>

        {error ? (
          <div className="error-message" role="alert">
            {error}
          </div>
        ) : (
          <>
            <div className="token-widget-grid">
              {/* Price */}
              <div className="metric">
                <span className="metric-label">Preço</span>
                {loading ? (
                  <div className="loading-skeleton"></div>
                ) : (
                  <span className="metric-value" aria-label={`Preço atual: ${formatPrice(tokenData.price)}`}>
                    {formatPrice(tokenData.price)}
                  </span>
                )}
              </div>

              {/* 24h Change */}
              <div className="metric">
                <span className="metric-label">24h</span>
                {loading ? (
                  <div className="loading-skeleton"></div>
                ) : (
                  <span
                    className={`metric-change ${
                      (tokenData.change24h ?? 0) >= 0 ? 'metric-change-positive' : 'metric-change-negative'
                    }`}
                    aria-label={`Variação em 24 horas: ${formatChange(tokenData.change24h)}`}
                  >
                    {formatChange(tokenData.change24h)}
                  </span>
                )}
              </div>

              {variant === 'full' && (
                <>
                  {/* Market Cap */}
                  <div className="metric">
                    <span className="metric-label">Market Cap</span>
                    {loading ? (
                      <div className="loading-skeleton"></div>
                    ) : (
                      <span className="metric-value metric-value-small" aria-label={`Market cap: ${formatLargeNumber(tokenData.marketCap)}`}>
                        {formatLargeNumber(tokenData.marketCap)}
                      </span>
                    )}
                  </div>

                  {/* Volume 24h */}
                  <div className="metric">
                    <span className="metric-label">Volume 24h</span>
                    {loading ? (
                      <div className="loading-skeleton"></div>
                    ) : (
                      <span className="metric-value metric-value-small" aria-label={`Volume em 24 horas: ${formatLargeNumber(tokenData.volume24h)}`}>
                        {formatLargeNumber(tokenData.volume24h)}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {showBuyButton && (
              <div className="token-widget-footer">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  href={`https://pump.fun/coin/${tokenAddress}`}
                  external
                  icon={
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  }
                >
                  Comprar $MILAGRE
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
