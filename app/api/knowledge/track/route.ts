/**
 * Knowledge Track API
 * 
 * Track knowledge episodes in the graph
 * 
 * POST /api/knowledge/track
 * Body: { type: KnowledgeType, text: string, metadata?: object, source?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { knowledgeTracker } from '@/lib/knowledge';
import { TrackEpisodeSchema } from '@/lib/knowledge/schemas';
import type { KnowledgeType } from '@/lib/knowledge/schemas';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate with Zod
        const validation = TrackEpisodeSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { type, text, metadata, source } = validation.data;

        // Track the episode
        const success = await knowledgeTracker.track(
            type as KnowledgeType,
            text,
            metadata,
            source
        );

        return NextResponse.json({
            success,
            type,
            text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('[/api/knowledge/track] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
