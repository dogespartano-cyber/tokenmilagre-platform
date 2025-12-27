import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBalanceScale, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/domains/resources/legacy-api';

interface ProsAndConsProps {
 prosAndCons: Resource['prosAndCons'];
}

export default function ProsAndCons({ prosAndCons }: ProsAndConsProps) {
 return (
  <section className="space-y-8">
<h2 className="text-2xl title-newtab flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
    Análise: Prós e Contras
   </h2>
   <div className="grid md:grid-cols-2 gap-8">
    {/* Prós */}
    <div>
<h3 className="title-newtab text-xl mb-6 flex items-center gap-2 font-inter ">
      <FontAwesomeIcon icon={faCheck} /> Vantagens
     </h3>
     <ul className="space-y-4" role="list">
      {prosAndCons.pros.map((pro, index) => (
       <li key={index} className="flex items-start gap-3">
        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" aria-hidden="true" />
        <span className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{pro}</span>
       </li>
      ))}
     </ul>
    </div>

    {/* Contras */}
    <div>
<h3 className="title-newtab text-xl mb-6 flex items-center gap-2 font-inter ">
      <FontAwesomeIcon icon={faExclamationTriangle} /> Limitações
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
