import { Resource } from '@/lib/resources';

interface WhyGoodSectionProps {
  whyGood: Resource['whyGood'];
}

export default function WhyGoodSection({ whyGood }: WhyGoodSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
        {whyGood.title}
      </h2>
      {whyGood.content.map((paragraph, index) => (
        <p
          key={index}
          className="leading-relaxed"
          style={{ color: 'var(--text-primary)' }}
        >
          {paragraph}
        </p>
      ))}
    </section>
  );
}
