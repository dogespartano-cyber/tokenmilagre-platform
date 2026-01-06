/**
 * Knowledge Search API
 * 
 * Search the knowledge graph using semantic queries
 * 
 * POST /api/knowledge/search
 * Body: { query: string, type?: KnowledgeType, limit?: number }
 */

import { NextRequest, NextResponse } from 'next/server';
import { knowledgeTracker } from '@/lib/knowledge';
import { SearchKnowledgeSchema } from '@/lib/knowledge/schemas';
import type { KnowledgeType } from '@/lib/knowledge/schemas';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate with Zod
        const validation = SearchKnowledgeSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { query, type, limit } = validation.data;

        // Check availability
        const isAvailable = await knowledgeTracker.checkAvailability();

        // Perform search
        const results = await knowledgeTracker.search({
            query,
            type: type as KnowledgeType,
            limit
        });

        return NextResponse.json({
            success: true,
            graphitiAvailable: isAvailable,
            query,
            results,
            count: results.length
        });

    } catch (error: any) {
        console.error('[/api/knowledge/search] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
