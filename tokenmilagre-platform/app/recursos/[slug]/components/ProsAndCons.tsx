import { Resource } from '@/lib/resources';

interface ProsAndConsProps {
  prosAndCons: Resource['prosAndCons'];
}

export default function ProsAndCons({ prosAndCons }: ProsAndConsProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
        Análise Honesta: Prós e Contras
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Prós */}
        <div
          className="p-6 rounded-xl border-2"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: '#10B981'
          }}
        >
          <h3 className="text-xl font-bold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
            Vantagens
          </h3>
          <ul className="space-y-2" role="list">
            {prosAndCons.pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1" aria-hidden="true">•</span>
                <span style={{ color: 'var(--text-secondary)' }}>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contras */}
        <div
          className="p-6 rounded-xl border-2"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: '#F59E0B'
          }}
        >
          <h3 className="text-xl font-bold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
            Limitações
          </h3>
          <ul className="space-y-2" role="list">
            {prosAndCons.cons.map((con, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-amber-500 mt-1" aria-hidden="true">•</span>
                <span style={{ color: 'var(--text-secondary)' }}>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
