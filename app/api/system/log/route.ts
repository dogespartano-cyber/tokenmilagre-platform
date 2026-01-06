/**
 * System Logging API
 * Centralized endpoint for Agent Flight Recorder logs.
 * Replaces direct shell 'echo' commands.
 * 
 * Features:
 * - Zod validation
 * - Rate limiting (100 req/min per IP)
 */

import { NextRequest, NextResponse } from 'next/server';
import { SystemLogSchema } from '@/lib/knowledge/schemas';
import * as fs from 'fs';
import * as path from 'path';

// ─────────────────────────────────────────────────────────────────────────────
// Rate Limiting (In-Memory)
// ─────────────────────────────────────────────────────────────────────────────

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 100;          // Max requests
const RATE_LIMIT_WINDOW_MS = 60000;  // 1 minute window
const CLEANUP_INTERVAL_MS = 300000;  // Cleanup every 5 minutes

// Cleanup stale entries periodically
let lastCleanup = Date.now();
function cleanupRateLimits() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

    lastCleanup = now;
    for (const [key, entry] of rateLimitMap.entries()) {
        if (entry.resetAt <= now) {
            rateLimitMap.delete(key);
        }
    }
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
    cleanupRateLimits();

    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || entry.resetAt <= now) {
        // New window
        const newEntry: RateLimitEntry = {
            count: 1,
            resetAt: now + RATE_LIMIT_WINDOW_MS
        };
        rateLimitMap.set(ip, newEntry);
        return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: newEntry.resetAt };
    }

    if (entry.count >= RATE_LIMIT_MAX) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count++;
    return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetAt: entry.resetAt };
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || request.headers.get('x-real-ip')
            || 'unknown';

        const rateLimit = checkRateLimit(ip);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded',
                    retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetAt / 1000)),
                        'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
                    }
                }
            );
        }

        const body = await request.json();

        // Validate with Zod
        const validation = SystemLogSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid log format', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { agent, intent, tool, trustScore, verification } = validation.data;

        // Format log entry for backward compatibility with monitor_flight_recorder.sh
        // FORMAT: ISO_DATE [AGENT] Intent (Tool: ..., Score: ...)
        const timestamp = new Date().toISOString();
        const logLine = `${timestamp} [${agent.toUpperCase()}] ${intent} (Tool: ${tool || 'N/A'}, Score: ${trustScore}, Ver: ${verification || 'N/A'})\n`;

        // Append to file
        const logPath = path.resolve(process.cwd(), '.agent/logs/flight_recorder.log');

        // Ensure dir exists
        const dir = path.dirname(logPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.appendFileSync(logPath, logLine);

        return NextResponse.json(
            { success: true, timestamp },
            {
                headers: {
                    'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
                    'X-RateLimit-Remaining': String(rateLimit.remaining),
                    'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetAt / 1000))
                }
            }
        );

    } catch (error: any) {
        console.error('[/api/system/log] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
