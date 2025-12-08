'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { EditorRoot, EditorContent, type JSONContent, StarterKit } from 'novel';
import { useState } from 'react';

interface NovelEditorProps {
    initialContent?: JSONContent;
    onSave?: (content: JSONContent) => void;
    placeholder?: string;
}

export default function NovelEditor({
    initialContent,
    onSave,
    placeholder = 'Comece a escrever seu artigo...'
}: NovelEditorProps) {
    const { theme } = useTheme();
    const [content, setContent] = useState<JSONContent | undefined>(initialContent);

    const handleSave = () => {
        if (onSave && content) {
            onSave(content);
        }
    };

    return (
        <div
            className="rounded-2xl border-2 overflow-hidden"
            style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
            }}
        >
            {/* Header do Editor */}
            <div
                className="flex items-center justify-between px-6 py-4 border-b-2"
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                }}
            >
                <h3
                    className="font-bold text-lg"
                    style={{ color: 'var(--text-primary)' }}
                >
                    ✍️ Editor de Artigos
                </h3>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                    💾 Salvar
                </button>
            </div>

            {/* Novel Editor */}
            <div
                className="prose max-w-none p-6"
                style={{ color: 'var(--text-primary)' }}
            >
                <EditorRoot>
                    <EditorContent
                        initialContent={initialContent}
                        extensions={[StarterKit]}
                        onUpdate={({ editor }) => {
                            const json = editor.getJSON();
                            setContent(json);
                        }}
                        className={theme === 'dark' ? 'novel-dark' : 'novel-light'}
                        editorProps={{
                            attributes: {
                                class: 'prose prose-lg focus:outline-none min-h-[500px]',
                                style: `color: var(--text-primary); background-color: var(--bg-elevated);`
                            }
                        }}
                    />
                </EditorRoot>
            </div>

            {/* Footer com Info */}
            <div
                className="px-6 py-3 border-t-2 flex items-center justify-between"
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                }}
            >
                <p
                    className="text-sm"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    💡 Use <kbd className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>/</kbd> para comandos rápidos
                </p>
                <p
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                >
                    {content ? 'Editor com conteúdo' : 'Editor vazio'}
                </p>
            </div>
        </div>
    );
}
