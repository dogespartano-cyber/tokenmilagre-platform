'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCode,
    faEye,
    faColumns,
    faSave,
    faFileExport,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';

// TipTap precisa ser carregado dinamicamente (client-only)
// TipTap precisa ser carregado dinamicamente (client-only)
const TipTapEditor = dynamic(
    () => import('@/lib/domains/articles/editor/components/TipTapEditor'),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-96 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl" style={{ color: 'var(--brand-primary)' }} />
            </div>
        )
    }
);

type ViewMode = 'edit' | 'preview' | 'split';

export default function EditorLabPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('split');
    const [content, setContent] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const handleContentChange = useCallback((newContent: string) => {
        setContent(newContent);
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Conteúdo salvo:', content);
        setIsSaving(false);
    };

    const handleExportMarkdown = () => {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'artigo.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            {/* Header */}
            <header
                className="sticky top-0 z-50"
                style={{
                    background: 'var(--bg-secondary)',
                    borderBottom: '1px solid var(--border-light)'
                }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Title */}
                        <div>
                            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                🧪 Lab: Editor Modular
                            </h1>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Ambiente de teste para o novo sistema de templates
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            {/* View Mode Toggle */}
                            <div className="flex rounded-lg p-1" style={{ background: 'var(--bg-tertiary)' }}>
                                <button
                                    onClick={() => setViewMode('edit')}
                                    className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
                                    style={{
                                        background: viewMode === 'edit' ? 'var(--brand-primary)' : 'transparent',
                                        color: viewMode === 'edit' ? 'var(--text-inverse)' : 'var(--text-secondary)'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCode} className="mr-2" />
                                    Editor
                                </button>
                                <button
                                    onClick={() => setViewMode('split')}
                                    className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
                                    style={{
                                        background: viewMode === 'split' ? 'var(--brand-primary)' : 'transparent',
                                        color: viewMode === 'split' ? 'var(--text-inverse)' : 'var(--text-secondary)'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faColumns} className="mr-2" />
                                    Split
                                </button>
                                <button
                                    onClick={() => setViewMode('preview')}
                                    className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
                                    style={{
                                        background: viewMode === 'preview' ? 'var(--brand-primary)' : 'transparent',
                                        color: viewMode === 'preview' ? 'var(--text-inverse)' : 'var(--text-secondary)'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                                    Preview
                                </button>
                            </div>

                            {/* Export */}
                            <button
                                onClick={handleExportMarkdown}
                                className="px-4 py-2 rounded-lg transition-all"
                                style={{
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--brand-primary)'
                                }}
                            >
                                <FontAwesomeIcon icon={faFileExport} className="mr-2" />
                                Exportar
                            </button>

                            {/* Save */}
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 font-medium rounded-lg transition-all disabled:opacity-50"
                                style={{
                                    background: 'var(--brand-primary)',
                                    color: 'var(--text-inverse)'
                                }}
                            >
                                {isSaving ? (
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                                ) : (
                                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                                )}
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {/* Editor Panel */}
                    {(viewMode === 'edit' || viewMode === 'split') && (
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
                                <h2 className="text-sm font-medium" style={{ color: 'var(--brand-primary)' }}>
                                    ✏️ Editor TipTap
                                </h2>
                            </div>
                            <div className="p-4 min-h-[600px]">
                                <TipTapEditor onChange={handleContentChange} />
                            </div>
                        </div>
                    )}

                    {/* Preview Panel */}
                    {(viewMode === 'preview' || viewMode === 'split') && (
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
                                <h2 className="text-sm font-medium" style={{ color: 'var(--brand-primary)' }}>
                                    👁️ Preview
                                </h2>
                            </div>
                            <div className="p-6 min-h-[600px] prose prose-invert max-w-none">
                                {content ? (
                                    <div
                                        style={{ color: 'var(--text-secondary)' }}
                                        dangerouslySetInnerHTML={{ __html: content }}
                                    />
                                ) : (
                                    <p style={{ color: 'var(--text-muted)' }} className="italic">
                                        Comece a escrever no editor para ver o preview...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Debug Info */}
                <div
                    className="mt-8 p-4 rounded-xl"
                    style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-light)'
                    }}
                >
                    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        📊 Debug Info
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span style={{ color: 'var(--text-muted)' }}>View Mode:</span>
                            <span className="ml-2" style={{ color: 'var(--brand-primary)' }}>{viewMode}</span>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)' }}>Content Length:</span>
                            <span className="ml-2" style={{ color: 'var(--brand-primary)' }}>{content.length} chars</span>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                            <span className="ml-2" style={{ color: 'var(--states-success-base)' }}>Ready</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
