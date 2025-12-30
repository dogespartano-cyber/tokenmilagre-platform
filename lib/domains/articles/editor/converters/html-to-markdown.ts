/**
 * Conversor de HTML para Markdown
 * 
 * Converte HTML de volta para Markdown, preservando:
 * - Formatação básica (headings, bold, italic, links)
 * - Listas (ordered e unordered)
 * - Code blocks
 * - Tabelas
 * - Callouts customizados (convertidos para sintaxe :::)
 */

import TurndownService from 'turndown';

// Criar instância do Turndown com configurações padrão
const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    strongDelimiter: '**',
    emDelimiter: '*',
});

// Regra para converter callouts de volta para sintaxe Markdown
turndown.addRule('callout', {
    filter: (node) => {
        return (
            node.nodeName === 'DIV' &&
            node.classList.contains('callout')
        );
    },
    replacement: (content, node) => {
        const element = node as HTMLElement;

        // Extrair tipo do callout
        const typeMatch = element.className.match(/callout-(tip|warning|note|security|danger)/);
        const type = typeMatch ? typeMatch[1] : 'note';

        // Extrair título (primeiro div filho geralmente é o header)
        const header = element.querySelector('div:first-child');
        const title = header?.textContent?.replace(/^[^\s]+\s*/, '').trim() || '';

        // Extrair conteúdo
        const contentDiv = element.querySelector('div:last-child');
        const contentText = contentDiv?.textContent?.trim() || content.trim();

        if (title) {
            return `\n:::${type}{title="${title}"}\n${contentText}\n:::\n`;
        }
        return `\n:::${type}\n${contentText}\n:::\n`;
    }
});

// Regra para preservar code blocks com linguagem
turndown.addRule('fencedCodeBlock', {
    filter: (node) => {
        return (
            node.nodeName === 'PRE' &&
            node.querySelector('code') !== null
        );
    },
    replacement: (content, node) => {
        const codeElement = (node as HTMLElement).querySelector('code');
        if (!codeElement) return content;

        const classMatch = codeElement.className.match(/language-(\w+)/);
        const language = classMatch ? classMatch[1] : '';
        const code = codeElement.textContent || '';

        return `\n\`\`\`${language}\n${code}\n\`\`\`\n`;
    }
});

// Regra para inline code
turndown.addRule('inlineCode', {
    filter: (node) => {
        return (
            node.nodeName === 'CODE' &&
            node.parentNode?.nodeName !== 'PRE'
        );
    },
    replacement: (content) => {
        return `\`${content}\``;
    }
});

// Regra para tabelas
turndown.addRule('table', {
    filter: 'table',
    replacement: (content, node) => {
        const table = node as HTMLTableElement;
        const rows = Array.from(table.querySelectorAll('tr'));

        if (rows.length === 0) return content;

        let markdown = '\n';

        rows.forEach((row, rowIndex) => {
            const cells = Array.from(row.querySelectorAll('th, td'));
            const cellContents = cells.map(cell => cell.textContent?.trim() || '');

            markdown += '| ' + cellContents.join(' | ') + ' |\n';

            // Adicionar linha de separação após o header
            if (rowIndex === 0) {
                markdown += '| ' + cells.map(() => '---').join(' | ') + ' |\n';
            }
        });

        return markdown + '\n';
    }
});

/**
 * Converte HTML para Markdown
 */
export function htmlToMarkdown(html: string): string {
    if (!html) return '';

    // Limpar HTML antes de converter
    const cleanHtml = html
        .replace(/style="[^"]*"/g, '') // Remover estilos inline
        .replace(/\s+/g, ' ') // Normalizar espaços
        .trim();

    return turndown.turndown(cleanHtml);
}

/**
 * Converte HTML para Markdown de forma assíncrona
 */
export async function htmlToMarkdownAsync(html: string): Promise<string> {
    return htmlToMarkdown(html);
}

export default htmlToMarkdown;
