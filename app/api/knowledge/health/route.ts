/**
 * Knowledge Health API
 * 
 * Check health status of knowledge services
 * 
 * GET /api/knowledge/health
 */

import { NextResponse } from 'next/server';
import { knowledgeTracker } from '@/lib/knowledge';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
    try {
        // Check Graphiti
        const graphitiHealthy = await knowledgeTracker.checkAvailability();

        // Check fallback file
        const fallbackPath = path.join(process.cwd(), 'Feedback', 'logs', 'knowledge-fallback.jsonl');
        let fallbackLines = 0;
        let fallbackSize = 0;

        if (fs.existsSync(fallbackPath)) {
            const content = fs.readFileSync(fallbackPath, 'utf-8');
            fallbackLines = content.split('\n').filter(l => l.trim()).length;
            fallbackSize = fs.statSync(fallbackPath).size;
        }

        return NextResponse.json({
            status: graphitiHealthy ? 'healthy' : 'degraded',
            services: {
                graphiti: {
                    status: graphitiHealthy ? 'healthy' : 'unavailable',
                    url: 'http://localhost:8000'
                },
                fallback: {
                    status: 'available',
                    lines: fallbackLines,
                    sizeBytes: fallbackSize
                }
            },
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
