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
import type { KnowledgeType, KnowledgeMetadata } from '@/lib/knowledge/types';

const VALID_TYPES: KnowledgeType[] = [
    'session', 'decision', 'troubleshoot', 'codeindex', 'content', 'user_action'
];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, text, metadata, source } = body;

        // Validate type
        if (!type || !VALID_TYPES.includes(type)) {
            return NextResponse.json(
                { error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` },
                { status: 400 }
            );
        }

        // Validate text
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json(
                { error: 'Text is required and must be a non-empty string' },
                { status: 400 }
            );
        }

        // Track the episode
        const success = await knowledgeTracker.track(
            type as KnowledgeType,
            text,
            metadata as KnowledgeMetadata,
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
