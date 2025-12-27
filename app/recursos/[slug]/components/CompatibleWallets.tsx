import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlug, faBriefcase, faLock, faFire, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/domains/resources/legacy-api';

interface CompatibleWalletsProps {
 resourceName: string;
 showCompatibleWallets: boolean;
}

export default function CompatibleWallets({ resourceName, showCompatibleWallets }: CompatibleWalletsProps) {
 if (!showCompatibleWallets) return null;

 return (
  <>
   <section className="space-y-6">
<h2 className="text-2xl title-newtab flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
     Wallets Compatíveis
    </h2>
    <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
     Você pode usar essas wallets populares como extensões no {resourceName}:
    </p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
     <Link
      href="/recursos?search=wallet"
      className="p-4 rounded-xl transition-all hover:bg-[var(--bg-secondary)] text-center group border border-transparent hover:border-[var(--border-light)]"
      aria-label="Ver todas as wallets disponíveis"
     >
      <FontAwesomeIcon icon={faBriefcase} className="text-2xl mb-2 block mx-auto group-hover:scale-110 transition-transform text-[var(--brand-primary)]" />
<h3 className="title-newtab text-sm" style={{ color: 'var(--text-primary)' }}>
       Ver Wallets
      </h3>
     </Link>
     <Link
      href="/recursos?search=hardware"
      className="p-4 rounded-xl transition-all hover:bg-[var(--bg-secondary)] text-center group border border-transparent hover:border-[var(--border-light)]"
      aria-label="Ver cold wallets (hardware wallets)"
     >
      <FontAwesomeIcon icon={faLock} className="text-2xl mb-2 block mx-auto group-hover:scale-110 transition-transform text-[var(--brand-primary)]" />
<h3 className="title-newtab text-sm" style={{ color: 'var(--text-primary)' }}>
       Cold Wallets
      </h3>
     </Link>
     <Link
      href="/recursos?search=hot"
      className="p-4 rounded-xl transition-all hover:bg-[var(--bg-secondary)] text-center group border border-transparent hover:border-[var(--border-light)]"
      aria-label="Ver hot wallets (software wallets)"
     >
      <FontAwesomeIcon icon={faFire} className="text-2xl mb-2 block mx-auto group-hover:scale-110 transition-transform text-[var(--brand-primary)]" />
<h3 className="title-newtab text-sm" style={{ color: 'var(--text-primary)' }}>
       Hot Wallets
      </h3>
     </Link>
     <Link
      href="/recursos"
      className="p-4 rounded-xl transition-all hover:bg-[var(--bg-secondary)] text-center group border border-transparent hover:border-[var(--border-light)]"
      aria-label="Ver todos os recursos verificados"
     >
      <FontAwesomeIcon icon={faThLarge} className="text-2xl mb-2 block mx-auto group-hover:scale-110 transition-transform text-[var(--brand-primary)]" />
<h3 className="title-newtab text-sm" style={{ color: 'var(--text-primary)' }}>
       Todos Recursos
      </h3>
     </Link>
    </div>
   </section>
  </>
 );
}
