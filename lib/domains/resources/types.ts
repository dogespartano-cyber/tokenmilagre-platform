/**
 * 🌀 Resources Domain - Types
 * 
 * @agi-domain: resources
 * @agi-pattern: fractal auto-similar
 * 
 * All types and interfaces for the resources domain.
 * Extracted from lib/resources.ts for fractal organization.
 */

// ============================================
// DATABASE TYPES (raw from Prisma)
// ============================================

/**
 * Resource as stored in database (JSON fields as strings)
 */
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

// ============================================
// FRONTEND TYPES (parsed for consumption)
// ============================================

/**
 * Feature block for resource pages
 */
export interface ResourceFeature {
    icon: string;
    title: string;
    description: string;
}

/**
 * How-to-start step
 */
export interface HowToStartStep {
    number: number;
    title: string;
    description: string;
}

/**
 * FAQ item
 */
export interface FAQItem {
    question: string;
    answer: string;
}

/**
 * Security tip
 */
export interface SecurityTip {
    icon: string;
    title: string;
    description: string;
}

/**
 * Parsed Resource for frontend consumption
 */
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
    features: ResourceFeature[];
    howToStart: {
        title: string;
        steps: HowToStartStep[];
    };
    prosAndCons: {
        pros: string[];
        cons: string[];
    };
    faq: FAQItem[];
    securityTips: SecurityTip[];
    showCompatibleWallets: boolean;
    relatedResources?: string[];
    views: number;
    createdAt: Date;
    updatedAt: Date;
    lastVerified: Date;
}

// ============================================
// QUERY TYPES
// ============================================

/**
 * Resource query parameters for listing
 */
export interface ResourceQuery {
    page?: number;
    limit?: number;
    category?: string;
    verified?: boolean;
    search?: string;
    interactiveType?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'views' | 'name';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated resource list result
 */
export interface ResourceListResult {
    resources: Resource[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
}

/**
 * Resource statistics
 */
export interface ResourceStats {
    total: number;
    verified: number;
    byCategory: Record<string, number>;
    byInteractiveType: Record<string, number>;
    totalViews: number;
    avgViewsPerResource: number;
}

// ============================================
// CREATE/UPDATE TYPES
// ============================================

/**
 * Input for creating a new resource
 */
export interface ResourceCreateInput {
    slug: string;
    name: string;
    category: string;
    verified?: boolean;
    shortDescription: string;
    officialUrl: string;
    platforms: string[];
    tags: string[];
    heroTitle: string;
    heroDescription: string;
    heroGradient: string;
    whyGoodTitle: string;
    whyGoodContent: string[];
    features: ResourceFeature[];
    howToStartTitle: string;
    howToStartSteps: HowToStartStep[];
    pros: string[];
    cons: string[];
    faq: FAQItem[];
    securityTips: SecurityTip[];
    securityAudit?: string;
    securityAuditDate?: Date;
    auditedByCommunity?: boolean;
    toolConfig?: unknown;
    interactiveType?: string | null;
    showCompatibleWallets?: boolean;
    relatedResources?: string[];
}

/**
 * Input for updating a resource (all fields optional)
 */
export type ResourceUpdateInput = Partial<ResourceCreateInput>;

// ============================================
// RESOURCE CATEGORIES
// ============================================

/**
 * Valid resource categories
 */
export const RESOURCE_CATEGORIES = [
    'wallets',
    'exchanges',
    'browsers',
    'defi',
    'explorers',
    'tools',
] as const;

export type ResourceCategory = typeof RESOURCE_CATEGORIES[number];
