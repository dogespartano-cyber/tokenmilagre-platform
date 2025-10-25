import { prisma } from '@/lib/prisma';
import { resources as hardcodedResources } from '@/lib/data/resources-data';

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
function parseResource(dbResource: any): Resource {
  return {
    id: dbResource.id,
    slug: dbResource.slug,
    name: dbResource.name,
    category: dbResource.category,
    verified: dbResource.verified,
    shortDescription: dbResource.shortDescription,
    officialUrl: dbResource.officialUrl,
    platforms: JSON.parse(dbResource.platforms),
    tags: JSON.parse(dbResource.tags),
    hero: {
      title: dbResource.heroTitle,
      description: dbResource.heroDescription,
      gradient: dbResource.heroGradient,
    },
    whyGood: {
      title: dbResource.whyGoodTitle,
      content: JSON.parse(dbResource.whyGoodContent),
    },
    features: JSON.parse(dbResource.features),
    howToStart: {
      title: dbResource.howToStartTitle,
      steps: JSON.parse(dbResource.howToStartSteps),
    },
    prosAndCons: {
      pros: JSON.parse(dbResource.pros),
      cons: JSON.parse(dbResource.cons),
    },
    faq: JSON.parse(dbResource.faq),
    securityTips: JSON.parse(dbResource.securityTips),
    showCompatibleWallets: dbResource.showCompatibleWallets,
    relatedResources: dbResource.relatedResources ? JSON.parse(dbResource.relatedResources) : undefined,
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
  try {
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

    // If database has resources, use them
    if (dbResources.length > 0) {
      return dbResources.map(parseResource);
    }

    // Fallback to hardcoded data if database is empty
    console.log('⚠️ Database empty, using hardcoded resources');
    let resources = hardcodedResources;

    // Apply filters to hardcoded data
    if (filters?.category) {
      resources = resources.filter(r => r.category === filters.category);
    }

    if (filters?.verified !== undefined) {
      resources = resources.filter(r => r.verified === filters.verified);
    }

    return resources.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching resources, using hardcoded fallback:', error);

    // Fallback on error
    let resources = hardcodedResources;

    if (filters?.category) {
      resources = resources.filter(r => r.category === filters.category);
    }

    if (filters?.verified !== undefined) {
      resources = resources.filter(r => r.verified === filters.verified);
    }

    return resources.sort((a, b) => a.name.localeCompare(b.name));
  }
}

/**
 * Get a single resource by slug
 * @param slug The resource slug
 * @returns Resource or null if not found
 */
export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  try {
    const dbResource = await prisma.resource.findUnique({
      where: { slug },
    });

    if (dbResource) {
      return parseResource(dbResource);
    }

    // Fallback to hardcoded data
    const hardcodedResource = hardcodedResources.find(r => r.slug === slug);
    return hardcodedResource || null;
  } catch (error) {
    console.error('Error fetching resource, using hardcoded fallback:', error);

    // Fallback on error
    const hardcodedResource = hardcodedResources.find(r => r.slug === slug);
    return hardcodedResource || null;
  }
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
  try {
    const resources = await prisma.resource.findMany({
      select: {
        slug: true,
      },
    });

    if (resources.length > 0) {
      return resources.map((r) => r.slug);
    }

    // Fallback to hardcoded data
    return hardcodedResources.map(r => r.slug);
  } catch (error) {
    console.error('Error fetching resource slugs, using hardcoded fallback:', error);
    return hardcodedResources.map(r => r.slug);
  }
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
  try {
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

    if (dbResources.length > 0) {
      return dbResources.map(parseResource);
    }

    // Fallback to hardcoded data
    return hardcodedResources
      .filter(r => r.category === category && r.slug !== currentSlug && r.verified)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching related resources, using hardcoded fallback:', error);

    // Fallback on error
    return hardcodedResources
      .filter(r => r.category === category && r.slug !== currentSlug && r.verified)
      .slice(0, limit);
  }
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
