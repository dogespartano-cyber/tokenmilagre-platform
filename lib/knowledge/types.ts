/**
 * Knowledge Tracking Types
 * 
 * Central type definitions for the unified knowledge system.
 * Used by KnowledgeTracker to categorize and structure episodic memory.
 */

/**
 * Categories of knowledge stored in the graph
 */
export type KnowledgeType =
    | 'session'        // Development sessions (what was done)
    | 'decision'       // Architectural decisions (why it was done)
    | 'troubleshoot'   // Problems and solutions
    | 'codeindex'      // Code structure index
    | 'content'        // Articles/content created
    | 'user_action';   // User interactions in the app

/**
 * Structured episode for knowledge tracking
 */
export interface KnowledgeEpisode {
    /** Category of knowledge */
    type: KnowledgeType;

    /** Human-readable description of the episode */
    text: string;

    /** Identifier (user, agent, system) */
    source: string;

    /** Additional structured data */
    metadata?: KnowledgeMetadata;

    /** ISO timestamp */
    timestamp?: string;
}

/**
 * Metadata attached to episodes
 */
export interface KnowledgeMetadata {
    /** Files involved */
    files?: string[];

    /** Git commit hash if applicable */
    commitHash?: string;

    /** Related slugs (articles, resources) */
    slugs?: string[];

    /** Tags for categorization */
    tags?: string[];

    /** Duration in seconds */
    duration?: number;

    /** Severity/importance (1-10) */
    importance?: number;

    /** Related episode IDs */
    relatedTo?: string[];

    /** Any additional data */
    [key: string]: unknown;
}

/**
 * Search query parameters
 */
export interface KnowledgeSearchParams {
    /** Natural language query */
    query: string;

    /** Filter by type */
    type?: KnowledgeType;

    /** Maximum results */
    limit?: number;

    /** Filter by source */
    source?: string;

    /** Filter by date range */
    since?: Date;
    until?: Date;
}

/**
 * Search result from graph
 */
export interface KnowledgeSearchResult {
    /** The matching episode text */
    text: string;

    /** Relevance score (0-1) */
    score: number;

    /** Episode metadata */
    metadata?: KnowledgeMetadata;

    /** When it was recorded */
    timestamp?: string;

    /** Source of the episode */
    source?: string;
}

/**
 * Recall context for session initialization
 */
export interface RecallContext {
    /** Recent session summaries */
    recentSessions: string[];

    /** Pending issues/tasks */
    openIssues: string[];

    /** Recent architectural decisions */
    recentDecisions: string[];

    /** Relevant troubleshooting history */
    troubleshootHistory: string[];
}

/**
 * Tracker configuration options
 */
export interface KnowledgeTrackerConfig {
    /** Graphiti API base URL */
    graphitiUrl?: string;

    /** Enable fallback to local file logging */
    enableFallback?: boolean;

    /** Local fallback log path */
    fallbackPath?: string;

    /** Default source identifier */
    defaultSource?: string;

    /** Enable debug logging */
    debug?: boolean;
}
