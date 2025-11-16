import { Resource } from '@/lib/resources';

interface HowToStartProps {
  howToStart: Resource['howToStart'];
}

export default function HowToStart({ howToStart }: HowToStartProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
        {howToStart.title}
      </h2>
      <div className="space-y-4">
        {howToStart.steps.map((step) => (
          <div
            key={step.number}
            className="flex gap-4 p-5 rounded-xl"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--text-inverse)'
              }}
              aria-label={`Passo ${step.number}`}
            >
              {step.number}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
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
