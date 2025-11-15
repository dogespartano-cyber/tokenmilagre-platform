import { prisma } from '@/lib/prisma';

// Safe JSON parser with fallback
function safeJSONParse<T>(json: string, fallback: T, fieldName?: string): T {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error(`[resources.ts] JSON parse failed for field "${fieldName}":`, json.substring(0, 100));
    return fallback;
  }
}

// Types matching the database schema
export interface ResourceFromDB {
  id: string;
  slug: string;
  name: string;
  category: string;
  verified: boolean;
  shortDescription: string;
  officialUrl: string;
  platforms: string; // JSON
  tags: string; // JSON
  heroTitle: string;
  heroDescription: string;
  heroGradient: string;
  whyGoodTitle: string;
  whyGoodContent: string; // JSON
  features: string; // JSON
  howToStartTitle: string;
  howToStartSteps: string; // JSON
  pros: string; // JSON
  cons: string; // JSON
  faq: string; // JSON
  securityTips: string; // JSON
  showCompatibleWallets: boolean;
  relatedResources: string | null; // JSON
  views: number;
  createdAt: Date;
  updatedAt: Date;
  lastVerified: Date;
}

// Parsed types for frontend
export interface Resource {
  id: string;
  slug: string;
  name: string;
  category: string;
  verified: boolean;
  shortDescription: string;
  officialUrl: string;
  platforms: string[];
  tags: string[];
  hero: {
    title: string;
    description: string;
    gradient: string;
  };
  whyGood: {
    title: string;
    content: string[];
  };
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  howToStart: {
    title: string;
    steps: {
      number: number;
      title: string;
      description: string;
    }[];
  };
  prosAndCons: {
    pros: string[];
    cons: string[];
  };
  faq: {
    question: string;
    answer: string;
  }[];
  securityTips: {
    icon: string;
    title: string;
    description: string;
  }[];
  showCompatibleWallets: boolean;
  relatedResources?: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
  lastVerified: Date;
}

// Transform DB resource to frontend format
function parseResource(dbResource: ResourceFromDB): Resource {
  return {
    id: dbResource.id,
    slug: dbResource.slug,
    name: dbResource.name,
    category: dbResource.category,
    verified: dbResource.verified,
    shortDescription: dbResource.shortDescription,
    officialUrl: dbResource.officialUrl,
    platforms: safeJSONParse<string[]>(dbResource.platforms, [], 'platforms'),
    tags: safeJSONParse<string[]>(dbResource.tags, [], 'tags'),
    hero: {
      title: dbResource.heroTitle,
      description: dbResource.heroDescription,
      gradient: dbResource.heroGradient,
    },
    whyGood: {
      title: dbResource.whyGoodTitle,
      content: safeJSONParse<string[]>(dbResource.whyGoodContent, [], 'whyGoodContent'),
    },
    features: safeJSONParse<Array<{ icon: string; title: string; description: string }>>(
      dbResource.features,
      [],
      'features'
    ),
    howToStart: {
      title: dbResource.howToStartTitle,
      steps: safeJSONParse<Array<{ number: number; title: string; description: string }>>(
        dbResource.howToStartSteps,
        [],
        'howToStartSteps'
      ),
    },
    prosAndCons: {
      pros: safeJSONParse<string[]>(dbResource.pros, [], 'pros'),
      cons: safeJSONParse<string[]>(dbResource.cons, [], 'cons'),
    },
    faq: safeJSONParse<Array<{ question: string; answer: string }>>(dbResource.faq, [], 'faq'),
    securityTips: safeJSONParse<Array<{ icon: string; title: string; description: string }>>(
      dbResource.securityTips,
      [],
      'securityTips'
    ),
    showCompatibleWallets: dbResource.showCompatibleWallets,
    relatedResources: dbResource.relatedResources
      ? safeJSONParse<string[]>(dbResource.relatedResources, undefined, 'relatedResources')
      : undefined,
    views: dbResource.views,
    createdAt: dbResource.createdAt,
    updatedAt: dbResource.updatedAt,
    lastVerified: dbResource.lastVerified,
  };
}

/**
 * Get all resources
 * @param filters Optional filters (category, verified)
 * @returns Array of all resources
 */
export async function getAllResources(filters?: {
  category?: string;
  verified?: boolean;
}): Promise<Resource[]> {
  const where: any = {};

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.verified !== undefined) {
    where.verified = filters.verified;
  }

  const dbResources = await prisma.resource.findMany({
    where,
    orderBy: {
      name: 'asc',
    },
  });

  return dbResources.map(parseResource);
}

/**
 * Get a single resource by slug
 * @param slug The resource slug
 * @returns Resource or null if not found
 */
export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  const dbResource = await prisma.resource.findUnique({
    where: { slug },
  });

  if (dbResource) {
    return parseResource(dbResource);
  }

  return null;
}

/**
 * Get resources by category
 * @param category The category to filter by
 * @returns Array of resources in that category
 */
export async function getResourcesByCategory(category: string): Promise<Resource[]> {
  return getAllResources({ category, verified: true });
}

/**
 * Get all resource slugs (for static generation)
 * @returns Array of slugs
 */
export async function getAllResourceSlugs(): Promise<string[]> {
  const resources = await prisma.resource.findMany({
    select: {
      slug: true,
    },
  });

  return resources.map((r) => r.slug);
}

/**
 * Get related resources (same category, different slug)
 * @param category The category to match
 * @param currentSlug The current resource slug to exclude
 * @param limit Maximum number of related resources
 * @returns Array of related resources
 */
export async function getRelatedResources(
  category: string,
  currentSlug: string,
  limit: number = 3
): Promise<Resource[]> {
  const dbResources = await prisma.resource.findMany({
    where: {
      category,
      slug: {
        not: currentSlug,
      },
      verified: true,
    },
    take: limit,
    orderBy: {
      views: 'desc',
    },
  });

  return dbResources.map(parseResource);
}

/**
 * Get multiple resources by slugs (optimized - single query)
 * @param slugs Array of resource slugs
 * @returns Array of resources (filtered to valid resources only)
 */
export async function getResourcesBySlugs(slugs: string[]): Promise<Resource[]> {
  if (!slugs || slugs.length === 0) {
    return [];
  }

  const dbResources = await prisma.resource.findMany({
    where: {
      slug: {
        in: slugs,
      },
    },
  });

  return dbResources.map(parseResource);
}

/**
 * Increment view count for a resource
 * @param slug The resource slug
 */
export async function incrementResourceViews(slug: string): Promise<void> {
  await prisma.resource.update({
    where: { slug },
    data: {
      views: {
        increment: 1,
      },
    },
  });
}
