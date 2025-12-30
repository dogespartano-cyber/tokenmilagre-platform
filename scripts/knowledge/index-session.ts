/**
 * Index Session Script
 * 
 * Indexes the current development session into the knowledge graph.
 * Usage: npx tsx scripts/knowledge/index-session.ts "Session summary here"
 * 
 * @example
 * npx tsx scripts/knowledge/index-session.ts "Fixed remarkGfm, externalized prompts"
 */

import { knowledgeTracker } from '../../lib/knowledge/tracker';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        // Try to read from session log file
        const today = new Date().toISOString().split('T')[0];
        const sessionFile = path.join(
            process.cwd(),
            'Feedback', 'logs',
            `SESSAO_${today}.md`
        );

        if (fs.existsSync(sessionFile)) {
            console.log(`📖 Lendo sessão de: ${sessionFile}`);
            const content = fs.readFileSync(sessionFile, 'utf-8');

            // Extract summary from markdown
            const summary = extractSummary(content);
            await indexSession(summary, extractFiles(content));
        } else {
            console.log(`
📝 Uso: npx tsx scripts/knowledge/index-session.ts "Resumo da sessão"

Ou crie um arquivo de sessão em:
  ${sessionFile}
      `);
            process.exit(1);
        }
    } else {
        // Use provided summary
        const summary = args.join(' ');
        await indexSession(summary);
    }
}

async function indexSession(summary: string, files?: string[]) {
    console.log('🧠 Iniciando indexação da sessão...');

    // Check Graphiti availability
    const isAvailable = await knowledgeTracker.checkAvailability();
    if (!isAvailable) {
        console.log('⚠️  Graphiti não disponível, usando fallback local');
    }

    // Track the session
    const success = await knowledgeTracker.trackSession(summary, files);

    if (success) {
        console.log('✅ Sessão indexada com sucesso!');
        console.log(`   Resumo: ${summary.substring(0, 100)}...`);
        if (files?.length) {
            console.log(`   Arquivos: ${files.length}`);
        }
    } else {
        console.log('❌ Falha ao indexar sessão');
        process.exit(1);
    }
}

function extractSummary(content: string): string {
    // Try to extract summary from markdown
    const lines = content.split('\n');
    const summaryLines: string[] = [];

    for (const line of lines) {
        // Skip headers and empty lines at start
        if (line.startsWith('#') || line.trim() === '') continue;

        // Take first few meaningful lines
        if (line.startsWith('-') || line.startsWith('*')) {
            summaryLines.push(line.replace(/^[-*]\s*/, '').trim());
        } else if (line.match(/^\d+\./)) {
            summaryLines.push(line.replace(/^\d+\.\s*/, '').trim());
        } else {
            summaryLines.push(line.trim());
        }

        if (summaryLines.length >= 5) break;
    }

    return summaryLines.join('. ');
}

function extractFiles(content: string): string[] {
    const files: string[] = [];

    // Match file paths
    const patterns = [
        /`([^`]+\.(ts|tsx|js|jsx|md|json|css))`/g,
        /\[([^\]]+\.(ts|tsx|js|jsx|md|json|css))\]/g
    ];

    for (const pattern of patterns) {
        const matches = content.matchAll(pattern);
        for (const match of matches) {
            if (match[1] && !files.includes(match[1])) {
                files.push(match[1]);
            }
        }
    }

    return files;
}

main().catch(console.error);
