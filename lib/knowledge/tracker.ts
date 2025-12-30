/**
 * Knowledge Tracker
 * 
 * Central service for tracking and retrieving episodic knowledge.
 * Integrates with Graphiti for persistent graph storage.
 */

import { graphitiService } from '@/lib/services/graphiti.service';
import type {
    KnowledgeType,
    KnowledgeEpisode,
    KnowledgeMetadata,
    KnowledgeSearchParams,
    KnowledgeSearchResult,
    RecallContext,
    KnowledgeTrackerConfig
} from './types';
import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_CONFIG: KnowledgeTrackerConfig = {
    graphitiUrl: 'http://localhost:8000',
    enableFallback: true,
    fallbackPath: './Feedback/logs/knowledge-fallback.jsonl',
    defaultSource: 'claude-agent',
    debug: process.env.NODE_ENV === 'development'
};

/**
 * KnowledgeTracker - Unified knowledge management
 * 
 * @example
 * ```typescript
 * import { knowledgeTracker } from '@/lib/knowledge/tracker';
 * 
 * // Track a session
 * await knowledgeTracker.track('session', 
 *   'Fixed remarkGfm issue in ArtigoEducacionalClient',
 *   { files: ['app/educacao/[slug]/ArtigoEducacionalClient.tsx'] }
 * );
 * 
 * // Search for solutions
 * const results = await knowledgeTracker.search({
 *   query: 'markdown tables not rendering',
 *   type: 'troubleshoot'
 * });
 * ```
 */
export class KnowledgeTracker {
    private config: KnowledgeTrackerConfig;
    private isGraphitiAvailable: boolean | null = null;

    constructor(config: Partial<KnowledgeTrackerConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Check if Graphiti service is available
     */
    async checkAvailability(): Promise<boolean> {
        try {
            const isHealthy = await graphitiService.healthCheck();
            this.isGraphitiAvailable = isHealthy;
            return isHealthy;
        } catch {
            this.isGraphitiAvailable = false;
            return false;
        }
    }

    /**
     * Track a knowledge episode
     */
    async track(
        type: KnowledgeType,
        text: string,
        metadata?: KnowledgeMetadata,
        source?: string
    ): Promise<boolean> {
        const episode: KnowledgeEpisode = {
            type,
            text,
            source: source || this.config.defaultSource || 'unknown',
            metadata,
            timestamp: new Date().toISOString()
        };

        // Format text with type prefix for better search
        const formattedText = `[${type.toUpperCase()}] ${text}`;

        if (this.config.debug) {
            console.log('[KnowledgeTracker] Tracking:', { type, text: text.substring(0, 100) });
        }

        // Try Graphiti first
        if (this.isGraphitiAvailable !== false) {
            try {
                await graphitiService.addEpisode({
                    user_id: episode.source,
                    text: formattedText,
                    metadata: {
                        ...metadata,
                        knowledge_type: type,
                        timestamp: episode.timestamp
                    }
                });

                if (this.config.debug) {
                    console.log('[KnowledgeTracker] Tracked via Graphiti');
                }
                return true;
            } catch (error) {
                console.warn('[KnowledgeTracker] Graphiti failed, using fallback:', error);
                this.isGraphitiAvailable = false;
            }
        }

        // Fallback to local file
        if (this.config.enableFallback) {
            return this.trackToFile(episode);
        }

        return false;
    }

    /**
     * Fallback: Track to local JSONL file
     */
    private trackToFile(episode: KnowledgeEpisode): boolean {
        try {
            const fallbackPath = path.resolve(process.cwd(), this.config.fallbackPath || '');
            const dir = path.dirname(fallbackPath);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const line = JSON.stringify(episode) + '\n';
            fs.appendFileSync(fallbackPath, line);

            if (this.config.debug) {
                console.log('[KnowledgeTracker] Tracked to fallback file');
            }
            return true;
        } catch (error) {
            console.error('[KnowledgeTracker] Fallback write failed:', error);
            return false;
        }
    }

    /**
     * Search the knowledge graph
     */
    async search(params: KnowledgeSearchParams): Promise<KnowledgeSearchResult[]> {
        // Add type filter to query if specified
        let query = params.query;
        if (params.type) {
            query = `[${params.type.toUpperCase()}] ${query}`;
        }

        if (this.config.debug) {
            console.log('[KnowledgeTracker] Searching:', query);
        }

        try {
            const response = await graphitiService.search({
                query,
                limit: params.limit || 10
            });

            if (response.results && Array.isArray(response.results)) {
                return response.results.map((r: any) => ({
                    text: r.text || r.content || '',
                    score: r.score || 0.5,
                    metadata: r.metadata,
                    timestamp: r.timestamp,
                    source: r.source || r.user_id
                }));
            }

            return [];
        } catch (error) {
            console.error('[KnowledgeTracker] Search failed:', error);
            return [];
        }
    }

    /**
     * Recall context for session initialization
     * Call this at the start of a development session
     */
    async recall(options: {
        lastSessions?: number;
        recentDecisions?: number;
        includeTroubleshoot?: boolean;
    } = {}): Promise<RecallContext> {
        const {
            lastSessions = 3,
            recentDecisions = 5,
            includeTroubleshoot = true
        } = options;

        const context: RecallContext = {
            recentSessions: [],
            openIssues: [],
            recentDecisions: [],
            troubleshootHistory: []
        };

        try {
            // Fetch recent sessions
            const sessions = await this.search({
                query: 'session development completed',
                type: 'session',
                limit: lastSessions
            });
            context.recentSessions = sessions.map(s => s.text);

            // Fetch recent decisions
            const decisions = await this.search({
                query: 'decision architecture design',
                type: 'decision',
                limit: recentDecisions
            });
            context.recentDecisions = decisions.map(d => d.text);

            // Fetch troubleshoot history
            if (includeTroubleshoot) {
                const troubleshoot = await this.search({
                    query: 'problem solution fixed',
                    type: 'troubleshoot',
                    limit: 5
                });
                context.troubleshootHistory = troubleshoot.map(t => t.text);
            }

        } catch (error) {
            console.warn('[KnowledgeTracker] Recall partially failed:', error);
        }

        return context;
    }

    // ============= Convenience Methods =============

    /**
     * Track a development session summary
     */
    async trackSession(summary: string, files?: string[]): Promise<boolean> {
        return this.track('session', summary, { files });
    }

    /**
     * Track an architectural decision
     */
    async trackDecision(
        decision: string,
        reason: string,
        files?: string[]
    ): Promise<boolean> {
        return this.track('decision', `${decision}. Motivo: ${reason}`, { files });
    }

    /**
     * Track a troubleshooting solution
     */
    async trackTroubleshoot(
        problem: string,
        cause: string,
        solution: string,
        files?: string[]
    ): Promise<boolean> {
        const text = `Problema: ${problem}. Causa: ${cause}. Solução: ${solution}`;
        return this.track('troubleshoot', text, { files, tags: ['bug-fix'] });
    }

    /**
     * Track code index entry
     */
    async trackCodeIndex(
        filePath: string,
        description: string,
        dependencies?: string[]
    ): Promise<boolean> {
        const text = `Arquivo: ${filePath}. ${description}`;
        return this.track('codeindex', text, {
            files: [filePath],
            relatedTo: dependencies
        });
    }

    /**
     * Track content creation
     */
    async trackContent(
        slug: string,
        title: string,
        category: string
    ): Promise<boolean> {
        const text = `Conteúdo criado: "${title}" (${category})`;
        return this.track('content', text, { slugs: [slug], tags: [category] });
    }

    /**
     * Track user action in the app
     */
    async trackUserAction(
        userId: string,
        action: string,
        metadata?: KnowledgeMetadata
    ): Promise<boolean> {
        return this.track('user_action', action, metadata, userId);
    }
}

// Export singleton instance
export const knowledgeTracker = new KnowledgeTracker();
