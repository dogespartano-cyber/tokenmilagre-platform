'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faSync } from '@fortawesome/free-solid-svg-icons';

// Importar conversores
import { markdownToHtml } from '@/lib/domains/articles/editor/converters/markdown-to-html';
import { htmlToMarkdown } from '@/lib/domains/articles/editor/converters/html-to-markdown';

const sampleMarkdown = `# Guia de Segurança Cripto

## Introdução

Este é um guia **essencial** para proteger seus ativos digitais.

:::tip{title="Dica Pro"}
Use uma hardware wallet para armazenar grandes quantidades.
:::

:::warning
Nunca compartilhe sua seed phrase!
:::

## Lista de Verificação

- Ativar 2FA em todas as exchanges
- Usar senhas únicas e fortes
- Verificar URLs antes de conectar wallet

## Código de Exemplo

\`\`\`javascript
const wallet = await connectWallet();
console.log(wallet.address);
\`\`\`

| Exchange | 2FA | Cold Storage |
|----------|-----|--------------|
| Binance  | Sim | Parcial      |
| Kraken   | Sim | Sim          |

> "Not your keys, not your coins" - Comunidade Cripto
`;

export default function ConvertersDemo() {
    const [markdown, setMarkdown] = useState(sampleMarkdown);
    const [html, setHtml] = useState('');
    const [convertedMarkdown, setConvertedMarkdown] = useState('');
    const [activeTab, setActiveTab] = useState<'md-to-html' | 'html-to-md'>('md-to-html');

    // Converter Markdown para HTML
    useEffect(() => {
        try {
            const result = markdownToHtml(markdown);
            setHtml(result);
        } catch (error) {
            console.error('Erro ao converter MD → HTML:', error);
        }
    }, [markdown]);

    // Converter HTML de volta para Markdown
    const handleConvertBack = () => {
        try {
            const result = htmlToMarkdown(html);
            setConvertedMarkdown(result);
            setActiveTab('html-to-md');
        } catch (error) {
            console.error('Erro ao converter HTML → MD:', error);
        }
    };

    return (
        <div className="min-h-screen p-8" style={{ background: 'var(--bg-primary)' }}>
            <div className="max-w-7xl mx-auto">
                <h1
                    className="text-3xl font-bold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                >
                    🔄 Demo: Conversores Markdown ↔ HTML
                </h1>
                <p
                    className="mb-8"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    Teste a conversão bidirecional com suporte a callouts customizados.
                </p>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('md-to-html')}
                        className="px-4 py-2 rounded-lg font-medium transition-all"
                        style={{
                            background: activeTab === 'md-to-html' ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                            color: activeTab === 'md-to-html' ? 'var(--text-inverse)' : 'var(--text-secondary)'
                        }}
                    >
                        Markdown → HTML
                    </button>
                    <button
                        onClick={() => setActiveTab('html-to-md')}
                        className="px-4 py-2 rounded-lg font-medium transition-all"
                        style={{
                            background: activeTab === 'html-to-md' ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                            color: activeTab === 'html-to-md' ? 'var(--text-inverse)' : 'var(--text-secondary)'
                        }}
                    >
                        HTML → Markdown
                    </button>
                </div>

                {activeTab === 'md-to-html' ? (
                    <div className="grid grid-cols-2 gap-6">
                        {/* Input Markdown */}
                        <div
                            className="rounded-xl overflow-hidden"
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-light)'
                            }}
                        >
                            <div
                                className="px-4 py-3 flex items-center justify-between"
                                style={{
                                    background: 'var(--bg-tertiary)',
                                    borderBottom: '1px solid var(--border-light)'
                                }}
                            >
                                <span className="font-medium" style={{ color: 'var(--brand-primary)' }}>
                                    📝 Markdown Input
                                </span>
                            </div>
                            <textarea
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                                className="w-full h-[600px] p-4 font-mono text-sm resize-none focus:outline-none"
                                style={{
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>

                        {/* Output HTML Preview */}
                        <div
                            className="rounded-xl overflow-hidden"
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-light)'
                            }}
                        >
                            <div
                                className="px-4 py-3 flex items-center justify-between"
                                style={{
                                    background: 'var(--bg-tertiary)',
                                    borderBottom: '1px solid var(--border-light)'
                                }}
                            >
                                <span className="font-medium" style={{ color: 'var(--brand-primary)' }}>
                                    🌐 HTML Output
                                </span>
                                <button
                                    onClick={handleConvertBack}
                                    className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-all"
                                    style={{
                                        background: 'var(--bg-primary)',
                                        color: 'var(--text-secondary)'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faSync} />
                                    Converter de volta
                                </button>
                            </div>
                            <div
                                className="h-[600px] overflow-y-auto p-4"
                                dangerouslySetInnerHTML={{ __html: html }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6">
                        {/* HTML Source */}
                        <div
                            className="rounded-xl overflow-hidden"
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-light)'
                            }}
                        >
                            <div
                                className="px-4 py-3"
                                style={{
                                    background: 'var(--bg-tertiary)',
                                    borderBottom: '1px solid var(--border-light)'
                                }}
                            >
                                <span className="font-medium" style={{ color: 'var(--brand-primary)' }}>
                                    🌐 HTML Source
                                </span>
                            </div>
                            <pre
                                className="h-[600px] overflow-auto p-4 font-mono text-xs"
                                style={{
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-secondary)'
                                }}
                            >
                                {html}
                            </pre>
                        </div>

                        {/* Converted Markdown */}
                        <div
                            className="rounded-xl overflow-hidden"
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-light)'
                            }}
                        >
                            <div
                                className="px-4 py-3"
                                style={{
                                    background: 'var(--bg-tertiary)',
                                    borderBottom: '1px solid var(--border-light)'
                                }}
                            >
                                <span className="font-medium" style={{ color: 'var(--brand-primary)' }}>
                                    📝 Markdown Convertido
                                </span>
                            </div>
                            <pre
                                className="h-[600px] overflow-auto p-4 font-mono text-sm whitespace-pre-wrap"
                                style={{
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                {convertedMarkdown || 'Clique em "Converter de volta" para ver o resultado.'}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
