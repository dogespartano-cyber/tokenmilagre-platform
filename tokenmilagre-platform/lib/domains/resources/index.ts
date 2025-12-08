/**
 * 🌀 Resources Domain - Public API
 * 
 * @agi-domain: resources
 * @agi-pattern: fractal auto-similar
 * @agi-entry-point: true
 * 
 * This is the public entry point for the resources domain.
 * All exports from this module are considered part of the public API.
 * 
 * Usage:
 * ```typescript
 * import { Resource, getAllResources } from '@/lib/domains/resources'
 * ```
 */

// ============================================
// TYPES (Public)
// ============================================
export type {
    Resource,
    ResourceFromDB,
    ResourceFeature,
    HowToStartStep,
    FAQItem,
    SecurityTip,
    ResourceQuery,
    ResourceListResult,
    ResourceStats,
    ResourceCreateInput,
    ResourceUpdateInput,
    ResourceCategory,
} from './types';

export { RESOURCE_CATEGORIES } from './types';

// ============================================
// DATA FUNCTIONS
// Re-exported from lib/resources.ts for backward compatibility
// TODO: Move implementation here in future refactor
// ============================================
export {
    getAllResources,
    getResourceBySlug,
    getResourcesByCategory,
    getAllResourceSlugs,
    getRelatedResources,
    getResourcesBySlugs,
    incrementResourceViews,
} from '@/lib/domains/resources/legacy-api';

// ============================================
// SCHEMAS
// Re-exported from lib/schemas/resource-schemas.ts
// TODO: Move implementation here in future refactor
// ============================================
export {
    resourceCategoryEnum,
    interactiveTypeEnum,
    slugSchema as resourceSlugSchema,  // Renamed to avoid collision with articles domain
    featureSchema,
    howToStartStepSchema,
    faqItemSchema,
    securityTipSchema,
    resourceCreateSchema,
    resourceUpdateSchema,
    resourceQuerySchema,
} from '@/lib/schemas/resource-schemas';

// ============================================
// SERVICE
// Re-exported from lib/services/resource-service.ts
// TODO: Move implementation here in future refactor
// ============================================
export { ResourceService } from './services/resource.service';
