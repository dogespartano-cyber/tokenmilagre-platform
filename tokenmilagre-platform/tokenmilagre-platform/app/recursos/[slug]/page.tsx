import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import RecursoClient from './RecursoClient';

// Cache ISR
export const revalidate = 3600;

interface Resource {
  id: string;
  slug: string;
  name: string;
  category: string;
  verified: boolean;
  shortDescription: string;
  officialUrl: string;
  platforms: string[];
  tags: string[];
  citations?: string[]; // URLs das fontes
}

async function getResource(slug: string): Promise<Resource | null> {
  try {
    const resource = await prisma.resource.findUnique({
      where: { slug }
    });

    if (!resource) {
      return null;
    }

    // Parse sources
    let citations: string[] | undefined;
    if (resource.sources) {
      try {
        citations = JSON.parse(resource.sources);
      } catch (e) {
        console.error('Erro ao parsear sources:', e);
        citations = undefined;
      }
    }

    return {
      id: resource.id,
      slug: resource.slug,
      name: resource.name,
      category: resource.category,
      verified: resource.verified,
      shortDescription: resource.shortDescription,
      officialUrl: resource.officialUrl,
      platforms: JSON.parse(resource.platforms),
      tags: JSON.parse(resource.tags),
      citations,
    };
  } catch (error) {
    console.error('Erro ao buscar recurso:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResource(slug);

  if (!resource) {
    return {
      title: 'Recurso não encontrado | TokenMilagre',
      description: 'O recurso solicitado não foi encontrado.',
    };
  }

  const baseUrl = 'https://tokenmilagre.xyz';
  const resourceUrl = `${baseUrl}/recursos/${resource.slug}`;

  return {
    title: `${resource.name} | Recursos TokenMilagre`,
    description: resource.shortDescription.substring(0, 160),
    keywords: resource.tags.join(', '),
    openGraph: {
      title: resource.name,
      description: resource.shortDescription.substring(0, 160),
      type: 'website',
      url: resourceUrl,
      siteName: '$MILAGRE - TokenMilagre',
    },
    twitter: {
      card: 'summary_large_image',
      title: resource.name,
      description: resource.shortDescription.substring(0, 160),
      creator: '@TokenMilagre',
    },
  };
}

export default async function RecursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getResource(slug);

  // Buscar recursos relacionados
  let relatedResources: Resource[] = [];

  if (resource) {
    try {
      const resources = await prisma.resource.findMany({
        where: {
          id: { not: resource.id },
          category: resource.category
        },
        take: 4
      });

      relatedResources = resources.map(r => {
        let citations: string[] | undefined;
        if (r.sources) {
          try {
            citations = JSON.parse(r.sources);
          } catch (e) {
            citations = undefined;
          }
        }

        return {
          id: r.id,
          slug: r.slug,
          name: r.name,
          category: r.category,
          verified: r.verified,
          shortDescription: r.shortDescription,
          officialUrl: r.officialUrl,
          platforms: JSON.parse(r.platforms),
          tags: JSON.parse(r.tags),
          citations,
        };
      });
    } catch (error) {
      console.error('Erro ao buscar recursos relacionados:', error);
    }
  }

  return <RecursoClient resource={resource} relatedResources={relatedResources} />;
}
