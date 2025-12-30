'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { Callout } from '@/lib/domains/articles/editor/extensions/Callout';
import { Quiz } from '@/lib/domains/articles/editor/extensions/Quiz';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBold,
    faItalic,
    faListUl,
    faListOl,
    faQuoteLeft,
    faCode,
    faUndo,
    faRedo,
    faMinus,
    faLightbulb,
    faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

interface TipTapEditorProps {
    onChange?: (html: string) => void;
    initialContent?: string;
}

export default function TipTapEditor({ onChange, initialContent }: TipTapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: 'Comece a escrever seu artigo aqui...',
            }),
            Callout,
            Quiz,
        ],
        content: initialContent || '',
        immediatelyRender: false, // Evita hydration mismatch com SSR
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3',
            },
        },
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML());
            }
        },
    });

    // Chamar onChange no mount
    useEffect(() => {
        if (editor && onChange) {
            onChange(editor.getHTML());
        }
    }, [editor, onChange]);

    if (!editor) {
        return (
            <div className="flex items-center justify-center h-96 bg-milagre-darker rounded-xl">
                <div className="animate-pulse text-milagre-gold">Carregando editor...</div>
            </div>
        );
    }

    return (
        <div className="tiptap-editor-wrapper">
            {/* Toolbar */}
            <div
                className="flex flex-wrap gap-1 p-2 rounded-t-xl"
                style={{
                    background: 'var(--bg-tertiary)',
                    borderBottom: '1px solid var(--border-light)'
                }}
            >
                {/* Headings */}
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className="p-2 rounded transition-colors"
                    style={{
                        background: editor.isActive('heading', { level: 1 }) ? 'var(--brand-bg)' : 'transparent',
                        color: editor.isActive('heading', { level: 1 }) ? 'var(--brand-primary)' : 'var(--text-secondary)'
                    }}
                    title="Heading 1"
                >
                    <span className="text-sm font-bold">H1</span>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className="p-2 rounded transition-colors"
                    style={{
                        background: editor.isActive('heading', { level: 2 }) ? 'var(--brand-bg)' : 'transparent',
                        color: editor.isActive('heading', { level: 2 }) ? 'var(--brand-primary)' : 'var(--text-secondary)'
                    }}
                    title="Heading 2"
                >
                    <span className="text-sm font-bold">H2</span>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className="p-2 rounded transition-colors"
                    style={{
                        background: editor.isActive('heading', { level: 3 }) ? 'var(--brand-bg)' : 'transparent',
                        color: editor.isActive('heading', { level: 3 }) ? 'var(--brand-primary)' : 'var(--text-secondary)'
                    }}
                    title="Heading 3"
                >
                    <span className="text-sm font-bold">H3</span>
                </button>

                <div className="w-px h-6 mx-1 self-center" style={{ background: 'var(--border-light)' }} />

                {/* Formatting */}
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className="p-2 rounded transition-colors"
                    style={{
                        background: editor.isActive('bold') ? 'var(--brand-bg)' : 'transparent',
                        color: editor.isActive('bold') ? 'var(--brand-primary)' : 'var(--text-secondary)'
                    }}
                    title="Bold"
                >
                    <FontAwesomeIcon icon={faBold} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className="p-2 rounded transition-colors"
                    style={{
                        background: editor.isActive('italic') ? 'var(--brand-bg)' : 'transparent',
                        color: editor.isActive('italic') ? 'var(--brand-primary)' : 'var(--text-secondary)'
                    }}
                    title="Italic"
                >
                    <FontAwesomeIcon icon={faItalic} />
                </button>

                <div className="w-px h-6 mx-1 self-center" style={{ background: 'var(--border-light)' }} />

                {/* Lists */}
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className="p-2 rounded transition-colors"
                    style={{
                        background: editor.isActive('bulletList') ? 'var(--brand-bg)' : 'transparent',
                        color: editor.isActive('bulletList') ? 'var(--brand-primary)' : 'var(--text-secondary)'
                    }}
                    title="Bullet List"
                >
                    <FontAwesomeIcon icon={faListUl} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className="p-2 rounded transition-colors"
                    style={{
                        background: editor.isActive('orderedList') ? 'var(--brand-bg)' : 'transparent',
                        color: editor.isActive('orderedList') ? 'var(--brand-primary)' : 'var(--text-secondary)'
                    }}
                    title="Ordered List"
                >
                    <FontAwesomeIcon icon={faListOl} />
                </button>

                <div className="w-px h-6 mx-1 self-center" style={{ background: 'var(--border-light)' }} />

                {/* Blocks */}
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className="p-2 rounded transition-colors"
                    style={{
                        background: editor.isActive('blockquote') ? 'var(--brand-bg)' : 'transparent',
                        color: editor.isActive('blockquote') ? 'var(--brand-primary)' : 'var(--text-secondary)'
                    }}
                    title="Quote"
                >
                    <FontAwesomeIcon icon={faQuoteLeft} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className="p-2 rounded transition-colors"
                    style={{
                        background: editor.isActive('codeBlock') ? 'var(--brand-bg)' : 'transparent',
                        color: editor.isActive('codeBlock') ? 'var(--brand-primary)' : 'var(--text-secondary)'
                    }}
                    title="Code Block"
                >
                    <FontAwesomeIcon icon={faCode} />
                </button>
                <button
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="p-2 rounded transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    title="Horizontal Rule"
                >
                    <FontAwesomeIcon icon={faMinus} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCallout().run()}
                    className="p-2 rounded transition-colors"
                    style={{
                        background: editor.isActive('callout') ? 'var(--brand-bg)' : 'transparent',
                        color: editor.isActive('callout') ? 'var(--brand-primary)' : 'var(--text-secondary)'
                    }}
                    title="Callout / Destaque"
                >
                    <FontAwesomeIcon icon={faLightbulb} />
                </button>

                <button
                    onClick={() => editor.chain().focus().setQuiz().run()}
                    className="p-2 rounded transition-colors"
                    style={{
                        background: editor.isActive('quiz') ? 'var(--brand-bg)' : 'transparent',
                        color: editor.isActive('quiz') ? 'var(--brand-primary)' : 'var(--text-secondary)'
                    }}
                    title="Inserir Quiz"
                >
                    <FontAwesomeIcon icon={faQuestionCircle} />
                </button>

                <div className="flex-1" />

                {/* Undo/Redo */}
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded transition-colors disabled:opacity-30"
                    style={{ color: 'var(--text-secondary)' }}
                    title="Undo"
                >
                    <FontAwesomeIcon icon={faUndo} />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded transition-colors disabled:opacity-30"
                    style={{ color: 'var(--text-secondary)' }}
                    title="Redo"
                >
                    <FontAwesomeIcon icon={faRedo} />
                </button>
            </div>

            {/* Editor Content */}
            <div
                className="rounded-b-xl"
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    borderTop: 'none'
                }}
            >
                <EditorContent editor={editor} />
            </div>

            <style jsx global>{`
        .tiptap-editor-wrapper .ProseMirror {
          min-height: 400px;
          padding: 1rem;
          background: var(--bg-primary);
        }

        .tiptap-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
          color: var(--text-muted);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .tiptap-editor-wrapper .ProseMirror:focus {
          outline: none;
        }

        .tiptap-editor-wrapper .ProseMirror h1 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--brand-primary);
          margin: 1.5rem 0 1rem;
        }

        .tiptap-editor-wrapper .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--brand-primary);
          margin: 1.25rem 0 0.75rem;
        }

        .tiptap-editor-wrapper .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 1rem 0 0.5rem;
        }

        .tiptap-editor-wrapper .ProseMirror p {
          color: var(--text-secondary);
          margin: 0.75rem 0;
          line-height: 1.7;
        }

        .tiptap-editor-wrapper .ProseMirror ul,
        .tiptap-editor-wrapper .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.75rem 0;
          color: var(--text-secondary);
        }

        .tiptap-editor-wrapper .ProseMirror li {
          margin: 0.25rem 0;
        }

        .tiptap-editor-wrapper .ProseMirror blockquote {
          border-left: 4px solid var(--brand-primary);
          padding-left: 1rem;
          margin: 1rem 0;
          color: var(--text-tertiary);
          font-style: italic;
        }

        .tiptap-editor-wrapper .ProseMirror pre {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
        }

        .tiptap-editor-wrapper .ProseMirror code {
          background: var(--bg-tertiary);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: 'Fira Code', monospace;
          font-size: 0.9em;
          color: var(--brand-primary);
        }

        .tiptap-editor-wrapper .ProseMirror pre code {
          background: none;
          padding: 0;
          color: var(--text-primary);
        }

        .tiptap-editor-wrapper .ProseMirror hr {
          border: none;
          border-top: 1px solid var(--border-light);
          margin: 2rem 0;
        }

        .tiptap-editor-wrapper .ProseMirror strong {
          color: var(--brand-primary);
          font-weight: 600;
        }
      `}</style>
        </div>
    );
}
