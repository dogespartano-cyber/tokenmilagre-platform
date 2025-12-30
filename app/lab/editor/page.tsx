'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCode,
    faEye,
    faColumns,
    faSave,
    faFileImport,
    faFileExport,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';

// TipTap precisa ser carregado dinamicamente (client-only)
const TipTapEditor = dynamic(
    () => import('./TipTapEditor'),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-96 bg-milagre-darker rounded-xl">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-milagre-gold text-2xl" />
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
        // Simular save
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
        <div className="min-h-screen bg-milagre-dark">
            {/* Header */}
            <header className="bg-milagre-darker border-b border-milagre-gold/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Title */}
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                🧪 Lab: Editor Modular
                            </h1>
                            <p className="text-sm text-gray-400">
                                Ambiente de teste para o novo sistema de templates
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            {/* View Mode Toggle */}
                            <div className="flex bg-milagre-dark rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('edit')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'edit'
                                        ? 'bg-milagre-gold text-black'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <FontAwesomeIcon icon={faCode} className="mr-2" />
                                    Editor
                                </button>
                                <button
                                    onClick={() => setViewMode('split')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'split'
                                        ? 'bg-milagre-gold text-black'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <FontAwesomeIcon icon={faColumns} className="mr-2" />
                                    Split
                                </button>
                                <button
                                    onClick={() => setViewMode('preview')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'preview'
                                        ? 'bg-milagre-gold text-black'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                                    Preview
                                </button>
                            </div>

                            {/* Export */}
                            <button
                                onClick={handleExportMarkdown}
                                className="px-4 py-2 bg-milagre-dark border border-milagre-gold/30 text-milagre-gold rounded-lg hover:bg-milagre-gold/10 transition-all"
                            >
                                <FontAwesomeIcon icon={faFileExport} className="mr-2" />
                                Exportar
                            </button>

                            {/* Save */}
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-milagre-gold text-black font-medium rounded-lg hover:bg-milagre-gold/90 transition-all disabled:opacity-50"
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
                <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'
                    }`}>
                    {/* Editor Panel */}
                    {(viewMode === 'edit' || viewMode === 'split') && (
                        <div className="bg-milagre-darker rounded-xl border border-milagre-gold/20 overflow-hidden">
                            <div className="px-4 py-3 border-b border-milagre-gold/20 bg-milagre-dark/50">
                                <h2 className="text-sm font-medium text-milagre-gold">
                                    ✏️ Editor BlockNote
                                </h2>
                            </div>
                            <div className="p-4 min-h-[600px]">
                                <TipTapEditor
                                    onChange={handleContentChange}
                                />
                            </div>
                        </div>
                    )}

                    {/* Preview Panel */}
                    {(viewMode === 'preview' || viewMode === 'split') && (
                        <div className="bg-milagre-darker rounded-xl border border-milagre-gold/20 overflow-hidden">
                            <div className="px-4 py-3 border-b border-milagre-gold/20 bg-milagre-dark/50">
                                <h2 className="text-sm font-medium text-milagre-gold">
                                    👁️ Preview
                                </h2>
                            </div>
                            <div className="p-6 min-h-[600px] prose prose-invert max-w-none">
                                {content ? (
                                    <div
                                        className="text-gray-300"
                                        dangerouslySetInnerHTML={{ __html: content }}
                                    />
                                ) : (
                                    <p className="text-gray-500 italic">
                                        Comece a escrever no editor para ver o preview...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Debug Info */}
                <div className="mt-8 p-4 bg-milagre-darker/50 rounded-xl border border-milagre-gold/10">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">
                        📊 Debug Info
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">View Mode:</span>
                            <span className="ml-2 text-milagre-gold">{viewMode}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Content Length:</span>
                            <span className="ml-2 text-milagre-gold">{content.length} chars</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Status:</span>
                            <span className="ml-2 text-green-400">Ready</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
