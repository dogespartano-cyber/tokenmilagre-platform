import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/resources';

interface ResourceFeaturesProps {
  features: Resource['features'];
}

export default function ResourceFeatures({ features }: ResourceFeaturesProps) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
        <FontAwesomeIcon icon={faLayerGroup} className="text-2xl text-[var(--brand-primary)]" />
        Recursos Principais
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-1"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-light)'
            }}
          >
            <h3 className="text-lg font-bold mb-3 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              {feature.title}
            </h3>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
