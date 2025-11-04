/**
 * Trending Topics Cache
 * In-memory cache for trending crypto topics (can be upgraded to Redis)
 */

export interface TrendingTopic {
  title: string;
  description: string;
  category: string;
  urgency: 'high' | 'medium' | 'low';
  suggestedArticleType: 'news' | 'educational';
  keywords: string[];
}

export interface CachedTrendingData {
  category: string;
  topics: TrendingTopic[];
  lastUpdated: Date;
  expiresAt: Date;
}

// In-memory cache (upgrade to Redis for production)
const cache = new Map<string, CachedTrendingData>();

// Cache duration: 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * Update trending topics cache
 */
export async function updateTrendingCache(
  category: string,
  topics: TrendingTopic[]
): Promise<void> {
  const now = new Date();

  cache.set(category, {
    category,
    topics,
    lastUpdated: now,
    expiresAt: new Date(now.getTime() + CACHE_DURATION)
  });

  console.log(`✅ Updated trending cache for category: ${category} (${topics.length} topics)`);
}

/**
 * Get trending topics from cache
 */
export function getTrendingTopics(category: string): TrendingTopic[] | null {
  const cached = cache.get(category);

  if (!cached) {
    return null;
  }

  // Check if expired
  if (new Date() > cached.expiresAt) {
    cache.delete(category);
    return null;
  }

  return cached.topics;
}

/**
 * Get all cached trending topics
 */
export function getAllTrendingTopics(): Record<string, TrendingTopic[]> {
  const result: Record<string, TrendingTopic[]> = {};

  for (const [category, data] of cache.entries()) {
    // Skip expired
    if (new Date() > data.expiresAt) {
      cache.delete(category);
      continue;
    }

    result[category] = data.topics;
  }

  return result;
}

/**
 * Get cache status
 */
export function getCacheStatus(): {
  categories: string[];
  totalTopics: number;
  lastUpdated: Record<string, Date>;
  expiresAt: Record<string, Date>;
} {
  const categories: string[] = [];
  let totalTopics = 0;
  const lastUpdated: Record<string, Date> = {};
  const expiresAt: Record<string, Date> = {};

  for (const [category, data] of cache.entries()) {
    // Skip expired
    if (new Date() > data.expiresAt) {
      cache.delete(category);
      continue;
    }

    categories.push(category);
    totalTopics += data.topics.length;
    lastUpdated[category] = data.lastUpdated;
    expiresAt[category] = data.expiresAt;
  }

  return {
    categories,
    totalTopics,
    lastUpdated,
    expiresAt
  };
}

/**
 * Clear cache
 */
export function clearTrendingCache(category?: string): void {
  if (category) {
    cache.delete(category);
    console.log(`🗑️  Cleared trending cache for: ${category}`);
  } else {
    cache.clear();
    console.log('🗑️  Cleared all trending cache');
  }
}

/**
 * Get top trending topics across all categories
 */
export function getTopTrendingTopics(limit = 10): TrendingTopic[] {
  const allTopics: TrendingTopic[] = [];

  for (const [, data] of cache.entries()) {
    // Skip expired
    if (new Date() > data.expiresAt) {
      continue;
    }

    allTopics.push(...data.topics);
  }

  // Sort by urgency
  const urgencyWeight = {
    high: 3,
    medium: 2,
    low: 1
  };

  return allTopics
    .sort((a, b) => urgencyWeight[b.urgency] - urgencyWeight[a.urgency])
    .slice(0, limit);
}

/**
 * Check if cache needs refresh
 */
export function needsRefresh(category: string): boolean {
  const cached = cache.get(category);

  if (!cached) {
    return true;
  }

  // Refresh if less than 2 hours until expiration
  const twoHours = 2 * 60 * 60 * 1000;
  const timeUntilExpiration = cached.expiresAt.getTime() - Date.now();

  return timeUntilExpiration < twoHours;
}
