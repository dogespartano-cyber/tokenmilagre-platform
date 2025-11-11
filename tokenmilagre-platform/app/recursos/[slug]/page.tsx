import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getResourceBySlug, getAllResourceSlugs } from '@/lib/resources';
import ResourceDetailClient from './ResourceDetailClient';

// Cache ISR: Revalida a cada 1 hora
export const revalidate = 3600;

// Permite gerar páginas dinamicamente para slugs não pré-gerados
export const dynamicParams = true;

// TEMPORARIAMENTE DESABILITADO para reduzir consumo de dados do banco
// Páginas serão geradas sob demanda (dynamic rendering)
// export async function generateStaticParams() {
//   const slugs = await getAllResourceSlugs();
//   return slugs.map((slug) => ({
//     slug,
//   }));
// }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    return {
      title: 'Recurso não encontrado',
    };
  }

  return {
    title: `${resource.name} - Recursos $MILAGRE`,
    description: resource.shortDescription,
  };
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  // Load related resources
  const relatedResourcesData = resource.relatedResources
    ? await Promise.all(
        resource.relatedResources.map(async (relatedSlug) => {
          const related = await getResourceBySlug(relatedSlug);
          return related;
        })
      )
    : [];

  // Filter out null values
  const validRelatedResources = relatedResourcesData.filter((r) => r !== null);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="resource-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": resource.name,
          "description": resource.hero.description,
          "url": resource.officialUrl,
          "applicationCategory": "BrowserApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}
      </Script>

      <ResourceDetailClient resource={resource} relatedResources={validRelatedResources} />
    </>
  );
}
