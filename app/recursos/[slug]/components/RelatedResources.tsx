import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/domains/resources/legacy-api';

interface RelatedResourcesProps {
  relatedResources: Resource[];
}

export default function RelatedResources({ relatedResources }: RelatedResourcesProps) {
  if (!relatedResources || relatedResources.length === 0) return null;

  return (
    <>
      <section className="space-y-8">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
          Você Também Pode Gostar
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedResources.map((relatedResource) => (
            <Link
              key={relatedResource.slug}
              href={`/recursos/${relatedResource.slug}`}
              className="group block h-full"
              aria-label={`Ver detalhes de ${relatedResource.name}`}
            >
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      color: 'var(--text-tertiary)'
                    }}
                  >
                    {relatedResource.category === 'browsers' ? 'Navegador' : relatedResource.category}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      color: 'var(--text-secondary)'
                    }}
                    aria-hidden="true"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 font-[family-name:var(--font-poppins)] group-hover:text-[var(--brand-primary)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {relatedResource.name}
                  </h3>
                  <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {relatedResource.shortDescription}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
