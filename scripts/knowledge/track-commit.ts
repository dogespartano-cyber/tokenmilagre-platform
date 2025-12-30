/**
 * Track Commit Script
 * 
 * Automatically tracks git commits in the knowledge graph.
 * Designed to be called from a git hook (post-commit).
 * 
 * Usage: npx tsx scripts/knowledge/track-commit.ts
 */

import { knowledgeTracker } from '../../lib/knowledge/tracker';
import { execSync } from 'child_process';

async function main() {
    console.log('🔗 Rastreando commit no grafo de conhecimento...');

    try {
        // Get last commit info
        const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
        const commitMessage = execSync('git log -1 --pretty=%B', { encoding: 'utf-8' }).trim();
        const commitAuthor = execSync('git log -1 --pretty=%an', { encoding: 'utf-8' }).trim();
        const changedFiles = execSync('git diff-tree --no-commit-id --name-only -r HEAD', { encoding: 'utf-8' })
            .trim()
            .split('\n')
            .filter(f => f.length > 0);

        // Check Graphiti availability
        const isAvailable = await knowledgeTracker.checkAvailability();
        if (!isAvailable) {
            console.log('⚠️  Graphiti não disponível, usando fallback');
        }

        // Determine type based on commit message
        let type: 'session' | 'decision' | 'troubleshoot' = 'session';
        const lowerMessage = commitMessage.toLowerCase();

        if (lowerMessage.includes('fix') || lowerMessage.includes('bug')) {
            type = 'troubleshoot';
        } else if (lowerMessage.includes('refactor') || lowerMessage.includes('design')) {
            type = 'decision';
        }

        // Track the commit
        const success = await knowledgeTracker.track(
            type,
            `Commit ${commitHash}: ${commitMessage}`,
            {
                commitHash,
                files: changedFiles,
                tags: extractTags(commitMessage)
            },
            commitAuthor
        );

        if (success) {
            console.log(`✅ Commit ${commitHash} rastreado`);
            console.log(`   Tipo: ${type}`);
            console.log(`   Arquivos: ${changedFiles.length}`);
        } else {
            console.log('⚠️  Falha ao rastrear commit (não-fatal)');
        }

    } catch (error) {
        // Non-fatal - don't block commits if tracking fails
        console.log('⚠️  Erro ao rastrear commit:', error);
    }
}

function extractTags(message: string): string[] {
    const tags: string[] = [];

    // Extract conventional commit type
    const typeMatch = message.match(/^(feat|fix|docs|style|refactor|test|chore|perf)[\(:]?/);
    if (typeMatch) {
        tags.push(typeMatch[1]);
    }

    // Extract scope if present
    const scopeMatch = message.match(/^\w+\(([^)]+)\)/);
    if (scopeMatch) {
        tags.push(scopeMatch[1]);
    }

    return tags;
}

main().catch(console.error);
