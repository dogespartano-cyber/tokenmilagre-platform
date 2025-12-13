/**
 * Shared Slug Utilities
 *
 * SINGLE SOURCE OF TRUTH for slug generation across the entire application.
 * Previously duplicated in:
 * - article-processor-client.ts
 * - UnifiedArticleGenerator.tsx
 *
 * Unified on 2025-12-13 for consistency and maintainability.
 */

/**
 * Generates a URL-friendly slug from a title
 *
 * @param title - The title to convert to a slug
 * @param addTimestamp - If true, adds a timestamp suffix for uniqueness (useful for news articles)
 * @returns A clean, URL-safe slug
 *
 * @example
 * generateSlug("Bitcoin Atinge $100mil!") // "bitcoin-atinge-100mil"
 * generateSlug("Bitcoin Atinge $100mil!", true) // "bitcoin-atinge-100mil-m1a2b3c4"
 */
export function generateSlug(title: string, addTimestamp: boolean = false): string {
    if (!title) return '';

    let slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')  // Remove acentos
        .replace(/[^\w\s-]/g, '')          // Remove caracteres especiais (incluindo $)
        .replace(/\s+/g, ' ')              // Normaliza espaços múltiplos
        .trim()                            // Remove espaços do início/fim
        .replace(/\s+/g, '-')              // Substitui espaços por hífens
        .replace(/-+/g, '-')               // Remove hífens duplicados
        .replace(/^-+|-+$/g, '');          // Remove hífens do início/fim

    if (addTimestamp) {
        // Usa timestamp base-36 para unicidade (~8 chars)
        const timestamp = Date.now().toString(36);
        const maxBaseSlugLength = 100 - timestamp.length - 1; // -1 para o hífen

        // Truncar slug base para caber com timestamp
        if (slug.length > maxBaseSlugLength) {
            slug = slug.substring(0, maxBaseSlugLength);
        }

        slug = `${slug}-${timestamp}`;
    } else {
        // Truncar para 100 caracteres (limite do banco de dados)
        slug = slug.substring(0, 100);
    }

    // Limpar hífens após todas as operações
    return slug
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Validates if a slug is properly formatted
 *
 * @param slug - The slug to validate
 * @returns True if the slug is valid
 */
export function isValidSlug(slug: string): boolean {
    if (!slug || typeof slug !== 'string') return false;

    // Slug must be 1-100 chars, lowercase letters, numbers, and hyphens only
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slug.length >= 1 && slug.length <= 100 && slugRegex.test(slug);
}

/**
 * Ensures a slug is unique by appending a suffix if needed
 *
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
    if (!existingSlugs.includes(baseSlug)) {
        return baseSlug;
    }

    let counter = 2;
    let uniqueSlug = `${baseSlug}-${counter}`;

    while (existingSlugs.includes(uniqueSlug)) {
        counter++;
        uniqueSlug = `${baseSlug}-${counter}`;
    }

    return uniqueSlug;
}
