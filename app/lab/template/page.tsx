'use client';

import { useState } from 'react';
import TipTapEditor from '@/app/lab/editor/TipTapEditor';
import ModularArticleRenderer from '@/lib/domains/articles/editor/components/ModularArticleRenderer';

export default function ArticleTemplateLab() {
    const [content, setContent] = useState<string>('<p>Comece a editar...</p>');
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

    return (
        <div className="min-h-screen bg-milagre-900 text-white p-8">
            <header className="max-w-7xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-milagre-gold mb-2">Lab: Modular Article Template</h1>
                <p className="text-gray-400">Teste do novo sistema de edição e renderização de artigos</p>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Column */}
                <div className={`flex flex-col gap-4 ${activeTab === 'preview' ? 'hidden lg:flex' : ''}`}>
                    <div className="bg-milagre-800 p-4 rounded-xl border border-milagre-700 flex justify-between items-center">
                        <h2 className="font-bold text-lg">Editor (Admin)</h2>
                        <button
                            className="lg:hidden bg-milagre-700 px-3 py-1 rounded text-sm"
                            onClick={() => setActiveTab('preview')}
                        >
                            Ver Preview
                        </button>
                    </div>

                    <TipTapEditor
                        initialContent={content}
                        onChange={setContent}
                    />

                    <div className="bg-black/30 p-4 rounded-lg text-xs font-mono overflow-auto max-h-40 border border-gray-700">
                        <div className="text-gray-500 mb-1">// Real-time HTML Output</div>
                        {content}
                    </div>
                </div>

                {/* Renderer Column */}
                <div className={`flex flex-col gap-4 ${activeTab === 'edit' ? 'hidden lg:flex' : ''}`}>
                    <div className="bg-milagre-800 p-4 rounded-xl border border-milagre-700 flex justify-between items-center">
                        <h2 className="font-bold text-lg">Frontend Renderer (User)</h2>
                        <button
                            className="lg:hidden bg-milagre-700 px-3 py-1 rounded text-sm"
                            onClick={() => setActiveTab('edit')}
                        >
                            Voltar ao Editor
                        </button>
                    </div>

                    <div className="bg-milagre-900 rounded-xl border border-milagre-800 shadow-2xl min-h-[600px] p-8">
                        {/* Simulation of Article Page Layout */}
                        <article className="max-w-none">
                            <span className="text-milagre-gold text-sm font-bold tracking-wider mb-4 block">CRYPTO EDUCATION</span>
                            <h1 className="text-4xl font-bold mb-6 text-white">The Future of Decentralized Finance</h1>
                            <div className="flex items-center gap-4 mb-8 text-sm text-gray-400 border-b border-gray-800 pb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-milagre-gold/20"></div>
                                    <span>TokenMilagre Team</span>
                                </div>
                                <span>•</span>
                                <span>5 min read</span>
                            </div>

                            {/* The Modular Content */}
                            <ModularArticleRenderer content={content} />
                        </article>
                    </div>
                </div>
            </main>
        </div>
    );
}
