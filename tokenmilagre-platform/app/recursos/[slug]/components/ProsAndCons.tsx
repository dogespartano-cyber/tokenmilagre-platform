import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBalanceScale, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/resources';

interface ProsAndConsProps {
  prosAndCons: Resource['prosAndCons'];
}

export default function ProsAndCons({ prosAndCons }: ProsAndConsProps) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
        <FontAwesomeIcon icon={faBalanceScale} className="text-2xl text-[var(--brand-primary)]" />
        Análise Honesta: Prós e Contras
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Prós */}
        <div
          className="p-6 rounded-2xl border transition-all hover:shadow-md"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderColor: 'rgba(16, 185, 129, 0.2)'
          }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
            <FontAwesomeIcon icon={faCheck} className="text-green-500" /> Vantagens
          </h3>
          <ul className="space-y-4" role="list">
            {prosAndCons.pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
                <span className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contras */}
        <div
          className="p-6 rounded-2xl border transition-all hover:shadow-md"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            borderColor: 'rgba(245, 158, 11, 0.2)'
          }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" /> Limitações
          </h3>
          <ul className="space-y-4" role="list">
            {prosAndCons.cons.map((con, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" aria-hidden="true" />
                <span className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
