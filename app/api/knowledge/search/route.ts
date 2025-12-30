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
import type { KnowledgeType } from '@/lib/knowledge/types';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query, type, limit = 10 } = body;

        if (!query || typeof query !== 'string') {
            return NextResponse.json(
                { error: 'Query is required and must be a string' },
                { status: 400 }
            );
        }

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
