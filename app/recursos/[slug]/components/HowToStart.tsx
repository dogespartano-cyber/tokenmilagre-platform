import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlagCheckered } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/domains/resources/legacy-api';

interface HowToStartProps {
 howToStart: Resource['howToStart'];
}

export default function HowToStart({ howToStart }: HowToStartProps) {
 return (
  <section className="space-y-8">
<h2 className="text-2xl title-newtab flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
    {howToStart.title}
   </h2>
   <div className="space-y-6 relative">
    {/* Linha conectora vertical (opcional, visual) */}
    <div
     className="absolute left-[27px] top-8 bottom-8 w-0.5 hidden md:block"
     style={{ backgroundColor: 'var(--border-light)' }}
    />

    {howToStart.steps.map((step, index) => (
     <div
      key={step.number}
      className="flex gap-6 relative"
     >
      <div
       className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg z-10"
       style={{
        backgroundColor: 'var(--bg-elevated)',
        color: 'var(--brand-primary)',
        border: '1px solid var(--border-light)'
       }}
       aria-label={`Passo ${step.number}`}
      >
       {step.number}
      </div>
      <div className="flex-1 py-2">
<h3 className="title-newtab text-lg mb-2 font-inter" style={{ color: 'var(--text-primary)' }}>
        {step.title}
       </h3>
       <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {step.description}
       </p>
      </div>
     </div>
    ))}
   </div>
  </section>
 );
}
