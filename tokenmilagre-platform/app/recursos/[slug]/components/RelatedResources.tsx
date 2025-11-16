import Link from 'next/link';
import { Resource } from '@/lib/resources';
import { getCategoryGradient } from '@/lib/category-helpers';

interface RelatedResourcesProps {
  relatedResources: Resource[];
}

export default function RelatedResources({ relatedResources }: RelatedResourcesProps) {
  if (!relatedResources || relatedResources.length === 0) return null;

  return (
    <>
      {/* Divider */}
      <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
          Você Também Pode Gostar
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {relatedResources.map((relatedResource) => (
            <Link
              key={relatedResource.slug}
              href={`/recursos/${relatedResource.slug}`}
              className="group p-5 rounded-xl border transition-all hover:shadow-lg hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)'
              }}
              aria-label={`Ver detalhes de ${relatedResource.name}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-1 rounded text-xs font-bold"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      color: 'var(--text-tertiary)'
                    }}
                  >
                    {relatedResource.category === 'browsers' ? 'Navegador' : relatedResource.category}
                  </span>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
                    style={{ background: getCategoryGradient(relatedResource.category) }}
                    aria-hidden="true"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  {relatedResource.name}
                </h3>
                <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {relatedResource.shortDescription}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
