/**
 * Conversor de Markdown para HTML
 * 
 * Versão simplificada com suporte a:
 * - Markdown padrão (headings, bold, italic, listas, etc)
 * - Code blocks
 * - Tabelas GFM
 */

import { marked, Renderer } from 'marked';

// Criar renderer customizado com estilos do tema
const renderer = new Renderer();

renderer.heading = function ({ tokens, depth }: any) {
    const text = this.parser.parseInline(tokens);
    const level = depth;
    const colors = ['var(--brand-primary)', 'var(--brand-primary)', 'var(--text-primary)'];
    const color = colors[Math.min(level - 1, 2)];
    const sizes = ['2rem', '1.5rem', '1.25rem', '1rem', '0.875rem', '0.75rem'];
    const size = sizes[level - 1];

    return `<h${level} style="color: ${color}; font-size: ${size}; font-weight: 700; margin: 1rem 0 0.5rem;">${text}</h${level}>`;
};

renderer.paragraph = function ({ tokens }: any) {
    const text = this.parser.parseInline(tokens);
    return `<p style="color: var(--text-secondary); margin: 0.75rem 0; line-height: 1.7;">${text}</p>`;
};

renderer.strong = function ({ tokens }: any) {
    const text = this.parser.parseInline(tokens);
    return `<strong style="color: var(--brand-primary); font-weight: 600;">${text}</strong>`;
};

renderer.blockquote = function ({ tokens }: any) {
    const quote = this.parser.parse(tokens);
    return `<blockquote style="
        border-left: 4px solid var(--brand-primary);
        padding-left: 1rem;
        margin: 1rem 0;
        color: var(--text-tertiary);
        font-style: italic;
    ">${quote}</blockquote>`;
};

renderer.code = function ({ text, lang }: any) {
    const code = text;
    const language = lang;
    return `<pre style="
        background: var(--bg-tertiary);
        border: 1px solid var(--border-light);
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        overflow-x: auto;
    "><code class="language-${language || 'text'}" style="
        color: var(--text-primary);
        font-family: 'Fira Code', monospace;
        font-size: 0.9em;
    ">${code}</code></pre>`;
};

renderer.codespan = function ({ text }: any) {
    const code = text;
    return `<code style="
        background: var(--bg-tertiary);
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: 'Fira Code', monospace;
        font-size: 0.9em;
        color: var(--brand-primary);
    ">${code}</code>`;
};

renderer.list = function ({ items, ordered }: any) {
    const body = items.map((item: any) => this.listitem(item)).join('');
    const tag = ordered ? 'ol' : 'ul';
    return `<${tag} style="
        padding-left: 1.5rem;
        margin: 0.75rem 0;
        color: var(--text-secondary);
    ">${body}</${tag}>`;
};

renderer.listitem = function ({ tokens }: any) {
    const text = this.parser.parse(tokens);
    return `<li style="margin: 0.25rem 0;">${text}</li>`;
};

renderer.table = function ({ header, rows }: any) {
    const headerHtml = header.map((cell: any) => this.tablecell(cell)).join('');
    const bodyHtml = rows.map((row: any) => this.tablerow({ text: row.map((cell: any) => this.tablecell(cell)).join('') })).join('');

    return `<table style="
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
    ">
        <thead style="background: var(--bg-tertiary);">${headerHtml}</thead>
        <tbody>${bodyHtml}</tbody>
    </table>`;
};

renderer.tablerow = function ({ text }: any) {
    return `<tr style="border-bottom: 1px solid var(--border-light);">${text}</tr>`;
};

renderer.tablecell = function ({ tokens, header, align }: any) {
    const content = this.parser.parseInline(tokens);
    const tag = header ? 'th' : 'td';
    const alignStyle = align ? `text-align: ${align};` : '';
    return `<${tag} style="
        padding: 0.75rem;
        color: var(--text-${header ? 'primary' : 'secondary'});
        ${alignStyle}
    ">${content}</${tag}>`;
};

renderer.hr = function () {
    return `<hr style="border: none; border-top: 1px solid var(--border-light); margin: 2rem 0;" />`;
};

renderer.link = function ({ href, title, tokens }: any) {
    const text = this.parser.parseInline(tokens);
    return `<a href="${href}" title="${title || ''}" style="
        color: var(--brand-primary);
        text-decoration: underline;
    ">${text}</a>`;
};

// Configurar marked com o renderer customizado
marked.setOptions({
    renderer,
    gfm: true,
    breaks: true,
});

/**
 * Processa callouts customizados antes de converter
 * Sintaxe: :::tipo{title="Título"} ... :::
 */
function processCallouts(markdown: string): string {
    const calloutRegex = /:::(tip|warning|note|security|danger)(?:\{title="([^"]+)"\})?\n([\s\S]*?):::/gm;

    const colorMap: Record<string, string> = {
        tip: 'var(--states-info-base)',
        warning: 'var(--states-warning-base)',
        note: 'var(--text-secondary)',
        security: 'var(--states-success-base)',
        danger: 'var(--states-error-base)',
    };

    const iconMap: Record<string, string> = {
        tip: '💡',
        warning: '⚠️',
        note: '📝',
        security: '🔐',
        danger: '🚨',
    };

    return markdown.replace(calloutRegex, (match, type, title, content) => {
        const color = colorMap[type] || 'var(--text-secondary)';
        const icon = iconMap[type] || '📝';
        const displayTitle = title || type.charAt(0).toUpperCase() + type.slice(1);

        return `
<div class="callout callout-${type}" style="
    background: var(--bg-tertiary);
    border: 1px solid ${color};
    border-left: 4px solid ${color};
    border-radius: 12px;
    margin: 1rem 0;
    overflow: hidden;
">
    <div style="
        background: color-mix(in srgb, ${color} 10%, transparent);
        padding: 0.75rem 1rem;
        font-weight: 600;
        color: ${color};
    ">
        ${icon} ${displayTitle}
    </div>
    <div style="padding: 0.75rem 1rem; color: var(--text-secondary);">
        ${marked.parse(content.trim())}
    </div>
</div>`;
    });
}

/**
 * Converte Markdown para HTML com estilos do tema
 */
export function markdownToHtml(markdown: string): string {
    if (!markdown) return '';

    // Primeiro processar callouts customizados
    const processedMarkdown = processCallouts(markdown);

    // Depois converter o resto com marked
    return marked.parse(processedMarkdown) as string;
}

/**
 * Converte Markdown para HTML de forma assíncrona
 */
export async function markdownToHtmlAsync(markdown: string): Promise<string> {
    return markdownToHtml(markdown);
}

export default markdownToHtml;
