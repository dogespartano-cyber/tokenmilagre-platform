import Link from 'next/link';
import { Resource } from '@/lib/resources';

interface CompatibleWalletsProps {
  resourceName: string;
  showCompatibleWallets: boolean;
}

export default function CompatibleWallets({ resourceName, showCompatibleWallets }: CompatibleWalletsProps) {
  if (!showCompatibleWallets) return null;

  return (
    <>
      {/* Divider */}
      <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
          Wallets Compatíveis
        </h2>
        <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Você pode usar essas wallets populares como extensões no {resourceName}:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/recursos?search=wallet"
            className="p-4 rounded-xl border transition-all hover:shadow-md hover:scale-105 text-center"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-light)'
            }}
            aria-label="Ver todas as wallets disponíveis"
          >
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
              Ver Wallets
            </h3>
          </Link>
          <Link
            href="/recursos?search=hardware"
            className="p-4 rounded-xl border transition-all hover:shadow-md hover:scale-105 text-center"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-light)'
            }}
            aria-label="Ver cold wallets (hardware wallets)"
          >
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
              Cold Wallets
            </h3>
          </Link>
          <Link
            href="/recursos?search=hot"
            className="p-4 rounded-xl border transition-all hover:shadow-md hover:scale-105 text-center"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-light)'
            }}
            aria-label="Ver hot wallets (software wallets)"
          >
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
              Hot Wallets
            </h3>
          </Link>
          <Link
            href="/recursos"
            className="p-4 rounded-xl border transition-all hover:shadow-md hover:scale-105 text-center"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-light)'
            }}
            aria-label="Ver todos os recursos verificados"
          >
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
              Todos Recursos
            </h3>
          </Link>
        </div>
      </section>
    </>
  );
}
