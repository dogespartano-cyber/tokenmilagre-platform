/**
 * Prompt Loader Utility
 * 
 * Loads prompts from external .md files in .agent/templates/
 * Supports variable substitution (e.g., {{CURRENT_TIME}})
 * Includes in-memory caching for performance
 */

import * as fs from 'fs';
import * as path from 'path';

// Prompt types supported
export type PromptType = 'trends' | 'news' | 'educational' | 'resource';

// Cache for loaded prompts (in-memory)
const promptCache: Map<string, { content: string; timestamp: number }> = new Map();

// Cache TTL: 5 minutes in development, 1 hour in production
const CACHE_TTL_MS = process.env.NODE_ENV === 'development' ? 5 * 60 * 1000 : 60 * 60 * 1000;

/**
 * Get the path to a prompt file
 */
function getPromptPath(type: PromptType): string {
    // In Next.js, process.cwd() returns the project root
    return path.join(process.cwd(), '.agent', 'templates', `${type}.md`);
}

/**
 * Parse YAML frontmatter from markdown content
 * Returns the content after the frontmatter (skips metadata)
 */
function parseMarkdownContent(content: string): string {
    // Check if content starts with frontmatter (---)
    if (content.startsWith('---')) {
        const endOfFrontmatter = content.indexOf('---', 3);
        if (endOfFrontmatter !== -1) {
            // Return everything after the closing ---
            return content.slice(endOfFrontmatter + 3).trim();
        }
    }
    return content;
}

/**
 * Substitute variables in the prompt content
 */
function substituteVariables(content: string, variables: Record<string, string>): string {
    let result = content;

    for (const [key, value] of Object.entries(variables)) {
        // Replace both {{VAR}} and {{ VAR }} formats
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
        result = result.replace(regex, value);
    }

    return result;
}

/**
 * Get current time formatted in pt-BR
 */
export function getCurrentTimeFormatted(): string {
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        dateStyle: 'full',
        timeStyle: 'short'
    }).format(new Date());
}

/**
 * Load a prompt from an external .md file
 * 
 * @param type - The type of prompt to load
 * @param variables - Optional variables to substitute (default: includes CURRENT_TIME)
 * @returns The processed prompt content
 * 
 * @example
 * ```typescript
 * const newsPrompt = await loadPrompt('news');
 * const educationalPrompt = await loadPrompt('educational', { 
 *   CURRENT_TIME: 'domingo, 29 de dezembro de 2024 às 21:47' 
 * });
 * ```
 */
export async function loadPrompt(
    type: PromptType,
    variables?: Record<string, string>
): Promise<string> {
    const promptPath = getPromptPath(type);
    const cacheKey = type;

    // Check cache first
    const cached = promptCache.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_TTL_MS) {
        // Return cached content with variable substitution
        const finalVariables = {
            CURRENT_TIME: getCurrentTimeFormatted(),
            ...variables
        };
        return substituteVariables(cached.content, finalVariables);
    }

    // Read from file
    try {
        const rawContent = await fs.promises.readFile(promptPath, 'utf-8');
        const content = parseMarkdownContent(rawContent);

        // Update cache
        promptCache.set(cacheKey, { content, timestamp: now });

        // Substitute variables
        const finalVariables = {
            CURRENT_TIME: getCurrentTimeFormatted(),
            ...variables
        };

        return substituteVariables(content, finalVariables);
    } catch (error) {
        console.error(`[prompt-loader] Error loading prompt "${type}":`, error);
        throw new Error(`Failed to load prompt: ${type}`);
    }
}

/**
 * Synchronous version for use in non-async contexts
 * Note: Uses cached content if available, throws if file not in cache and can't be read
 */
export function loadPromptSync(
    type: PromptType,
    variables?: Record<string, string>
): string {
    const promptPath = getPromptPath(type);
    const cacheKey = type;

    // Check cache first
    const cached = promptCache.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_TTL_MS) {
        const finalVariables = {
            CURRENT_TIME: getCurrentTimeFormatted(),
            ...variables
        };
        return substituteVariables(cached.content, finalVariables);
    }

    // Read from file synchronously
    const rawContent = fs.readFileSync(promptPath, 'utf-8');
    const content = parseMarkdownContent(rawContent);

    // Update cache
    promptCache.set(cacheKey, { content, timestamp: now });

    // Substitute variables
    const finalVariables = {
        CURRENT_TIME: getCurrentTimeFormatted(),
        ...variables
    };

    return substituteVariables(content, finalVariables);
}

/**
 * Clear the prompt cache (useful for testing or hot-reloading)
 */
export function clearPromptCache(): void {
    promptCache.clear();
}

/**
 * Preload all prompts into cache (call during server startup)
 */
export async function preloadPrompts(): Promise<void> {
    const types: PromptType[] = ['trends', 'news', 'educational', 'resource'];

    await Promise.all(types.map(type => {
        try {
            return loadPrompt(type);
        } catch (error) {
            console.warn(`[prompt-loader] Could not preload prompt "${type}":`, error);
            return null;
        }
    }));

    console.log('[prompt-loader] Prompts preloaded into cache');
}
