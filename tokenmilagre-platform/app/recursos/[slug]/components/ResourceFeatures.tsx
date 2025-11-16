import { Resource } from '@/lib/resources';

interface ResourceFeaturesProps {
  features: Resource['features'];
}

export default function ResourceFeatures({ features }: ResourceFeaturesProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
        Recursos Principais
      </h2>
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-5 rounded-xl border transition-all hover:shadow-md"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-light)'
            }}
          >
            <h3 className="text-lg font-bold mb-2 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              {feature.title}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
