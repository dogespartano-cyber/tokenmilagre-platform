import { resources } from '@/lib/data/resources-data';

// Export the Resource type from resources-data
export type { ResourceDetail as Resource } from '@/lib/data/resources-data';

/**
 * Get all resources
 * @param filters Optional filters (category, verified)
 * @returns Array of all resources
 */
export async function getAllResources(filters?: {
  category?: string;
  verified?: boolean;
}): Promise<typeof resources> {
  let filtered = resources;

  if (filters?.category) {
    filtered = filtered.filter(r => r.category === filters.category);
  }

  if (filters?.verified !== undefined) {
    filtered = filtered.filter(r => r.verified === filters.verified);
  }

  return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a single resource by slug
 * @param slug The resource slug
 * @returns Resource or null if not found
 */
export async function getResourceBySlug(slug: string) {
  const resource = resources.find(r => r.slug === slug);
  return resource || null;
}

/**
 * Get resources by category
 * @param category The category to filter by
 * @returns Array of resources in that category
 */
export async function getResourcesByCategory(category: string) {
  return getAllResources({ category, verified: true });
}

/**
 * Get all resource slugs (for static generation)
 * @returns Array of slugs
 */
export async function getAllResourceSlugs(): Promise<string[]> {
  return resources.map(r => r.slug);
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
) {
  return resources
    .filter(r => r.category === category && r.slug !== currentSlug)
    .slice(0, limit);
}
