'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBold,
    faItalic,
    faListUl,
    faListOl,
    faQuoteLeft,
    faCode,
    faHeading,
    faUndo,
    faRedo,
    faMinus
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
        ],
        content: initialContent || '',
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
            <div className="flex flex-wrap gap-1 p-2 border-b border-milagre-gold/20 bg-milagre-dark/50 rounded-t-xl">
                {/* Headings */}
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-milagre-gold/20 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-milagre-gold/30 text-milagre-gold' : 'text-gray-400'
                        }`}
                    title="Heading 1"
                >
                    <span className="text-sm font-bold">H1</span>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-milagre-gold/20 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-milagre-gold/30 text-milagre-gold' : 'text-gray-400'
                        }`}
                    title="Heading 2"
                >
                    <span className="text-sm font-bold">H2</span>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-milagre-gold/20 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-milagre-gold/30 text-milagre-gold' : 'text-gray-400'
                        }`}
                    title="Heading 3"
                >
                    <span className="text-sm font-bold">H3</span>
                </button>

                <div className="w-px h-6 bg-milagre-gold/20 mx-1 self-center" />

                {/* Formatting */}
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-milagre-gold/20 transition-colors ${editor.isActive('bold') ? 'bg-milagre-gold/30 text-milagre-gold' : 'text-gray-400'
                        }`}
                    title="Bold"
                >
                    <FontAwesomeIcon icon={faBold} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-milagre-gold/20 transition-colors ${editor.isActive('italic') ? 'bg-milagre-gold/30 text-milagre-gold' : 'text-gray-400'
                        }`}
                    title="Italic"
                >
                    <FontAwesomeIcon icon={faItalic} />
                </button>

                <div className="w-px h-6 bg-milagre-gold/20 mx-1 self-center" />

                {/* Lists */}
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-milagre-gold/20 transition-colors ${editor.isActive('bulletList') ? 'bg-milagre-gold/30 text-milagre-gold' : 'text-gray-400'
                        }`}
                    title="Bullet List"
                >
                    <FontAwesomeIcon icon={faListUl} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-milagre-gold/20 transition-colors ${editor.isActive('orderedList') ? 'bg-milagre-gold/30 text-milagre-gold' : 'text-gray-400'
                        }`}
                    title="Ordered List"
                >
                    <FontAwesomeIcon icon={faListOl} />
                </button>

                <div className="w-px h-6 bg-milagre-gold/20 mx-1 self-center" />

                {/* Blocks */}
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-milagre-gold/20 transition-colors ${editor.isActive('blockquote') ? 'bg-milagre-gold/30 text-milagre-gold' : 'text-gray-400'
                        }`}
                    title="Quote"
                >
                    <FontAwesomeIcon icon={faQuoteLeft} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded hover:bg-milagre-gold/20 transition-colors ${editor.isActive('codeBlock') ? 'bg-milagre-gold/30 text-milagre-gold' : 'text-gray-400'
                        }`}
                    title="Code Block"
                >
                    <FontAwesomeIcon icon={faCode} />
                </button>
                <button
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="p-2 rounded hover:bg-milagre-gold/20 transition-colors text-gray-400"
                    title="Horizontal Rule"
                >
                    <FontAwesomeIcon icon={faMinus} />
                </button>

                <div className="flex-1" />

                {/* Undo/Redo */}
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-milagre-gold/20 transition-colors text-gray-400 disabled:opacity-30"
                    title="Undo"
                >
                    <FontAwesomeIcon icon={faUndo} />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-milagre-gold/20 transition-colors text-gray-400 disabled:opacity-30"
                    title="Redo"
                >
                    <FontAwesomeIcon icon={faRedo} />
                </button>
            </div>

            {/* Editor Content */}
            <div className="bg-milagre-darker rounded-b-xl border border-t-0 border-milagre-gold/20">
                <EditorContent editor={editor} />
            </div>

            <style jsx global>{`
        .tiptap-editor-wrapper .ProseMirror {
          min-height: 400px;
          padding: 1rem;
        }

        .tiptap-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
          color: #6b7280;
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
          color: #fbbf24;
          margin: 1.5rem 0 1rem;
        }

        .tiptap-editor-wrapper .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #fbbf24;
          margin: 1.25rem 0 0.75rem;
        }

        .tiptap-editor-wrapper .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #e5e5e5;
          margin: 1rem 0 0.5rem;
        }

        .tiptap-editor-wrapper .ProseMirror p {
          color: #d1d5db;
          margin: 0.75rem 0;
          line-height: 1.7;
        }

        .tiptap-editor-wrapper .ProseMirror ul,
        .tiptap-editor-wrapper .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.75rem 0;
          color: #d1d5db;
        }

        .tiptap-editor-wrapper .ProseMirror li {
          margin: 0.25rem 0;
        }

        .tiptap-editor-wrapper .ProseMirror blockquote {
          border-left: 4px solid #fbbf24;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #9ca3af;
          font-style: italic;
        }

        .tiptap-editor-wrapper .ProseMirror pre {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
        }

        .tiptap-editor-wrapper .ProseMirror code {
          background: #1a1a1a;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: 'Fira Code', monospace;
          font-size: 0.9em;
          color: #fbbf24;
        }

        .tiptap-editor-wrapper .ProseMirror pre code {
          background: none;
          padding: 0;
          color: #e5e5e5;
        }

        .tiptap-editor-wrapper .ProseMirror hr {
          border: none;
          border-top: 1px solid #333;
          margin: 2rem 0;
        }

        .tiptap-editor-wrapper .ProseMirror strong {
          color: #fbbf24;
          font-weight: 600;
        }
      `}</style>
        </div>
    );
}
