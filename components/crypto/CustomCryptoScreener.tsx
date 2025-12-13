'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useCryptoData } from '@/lib/domains/crypto/hooks/useCryptoData';
import { useCryptoTable } from '@/components/crypto/screener/useCryptoTable';
import { CryptoTable } from '@/components/crypto/screener/CryptoTable';
import { CryptoSearch } from '@/components/crypto/screener/CryptoSearch';
import { CryptoPagination } from '@/components/crypto/screener/CryptoPagination';

export default function CustomCryptoScreener() {
  const { data, loading } = useCryptoData();
  const { table, globalFilter, setGlobalFilter } = useCryptoTable(data);

  if (loading) {
    return (
      <div className="rounded-2xl p-12 border-2 shadow-xl" style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-medium)'
      }}>
        <div className="flex flex-col items-center justify-center gap-4">
          <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 animate-spin" style={{ color: 'var(--brand-primary)' }} />
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Carregando dados do mercado...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 border border-[var(--border-light)] shadow-xl">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-4xl">📊</div>
          <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Dados temporariamente indisponíveis</p>
          <p className="text-sm text-center max-w-md" style={{ color: 'var(--text-secondary)' }}>
            A API do CoinGecko pode estar com rate limit. Os dados serão atualizados automaticamente quando disponíveis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card static-glass-card rounded-2xl border border-[var(--border-light)] shadow-xl overflow-hidden">
      <CryptoSearch value={globalFilter} onChange={setGlobalFilter} />
      <CryptoTable table={table} />
      <CryptoPagination table={table} />
    </div>
  );
}
