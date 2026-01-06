import { z } from 'zod';

export const KnowledgeTypeSchema = z.enum([
    'session',
    'decision',
    'troubleshoot',
    'codeindex',
    'content',
    'user_action'
]);

export type KnowledgeType = z.infer<typeof KnowledgeTypeSchema>;

export const KnowledgeMetadataSchema = z.record(z.string(), z.any()).optional();

export const TrackEpisodeSchema = z.object({
    type: KnowledgeTypeSchema,
    text: z.string().min(1, "Text is required"),
    metadata: KnowledgeMetadataSchema,
    source: z.string().optional()
});

export const SearchKnowledgeSchema = z.object({
    query: z.string().min(1, "Query is required"),
    type: KnowledgeTypeSchema.optional(),
    limit: z.number().min(1).max(100).optional().default(10)
});

export const SystemLogSchema = z.object({
    agent: z.string(),
    intent: z.string(),
    tool: z.string().optional(),
    trustScore: z.number().min(0).max(10),
    verification: z.string().optional()
});
