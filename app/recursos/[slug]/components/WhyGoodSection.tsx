import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/domains/resources/legacy-api';

interface WhyGoodSectionProps {
  whyGood: Resource['whyGood'];
}

export default function WhyGoodSection({ whyGood }: WhyGoodSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
        {whyGood.title}
      </h2>
      <div className="space-y-4">
        {whyGood.content.map((paragraph, index) => (
          <p
            key={index}
            className="leading-relaxed text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
