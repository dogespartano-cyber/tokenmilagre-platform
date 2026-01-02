'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Callout } from '@/lib/domains/articles/editor/extensions/Callout';
import { Quiz } from '@/lib/domains/articles/editor/extensions/Quiz';
import { useEffect } from 'react';

interface ModularArticleRendererProps {
    content: string; // HTML ou JSON stringified
    className?: string;
}

export default function ModularArticleRenderer({ content, className }: ModularArticleRendererProps) {
    const editor = useEditor({
        editable: false,
        extensions: [
            StarterKit,
            Callout,
            Quiz,
        ],
        content: content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: `prose prose-invert max-w-none ${className || ''}`,
            },
        },
    });

    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            // Basic sync if content prop changes, though usually static
            // Note: be careful with loops if content isn't stable
            // Compare to avoid infinite loop / cursor jumps (though in read-only cursor doesn't matter)
            // We check if the content is meaningfully different
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="modular-renderer">
            <EditorContent editor={editor} />
            <style jsx global>{`
                /* Reuse styles from editor for consistency */
                .modular-renderer .ProseMirror {
                    outline: none;
                }
                .modular-renderer .ProseMirror h1 {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-article-title);
                    margin: 2.5rem 0 1.5rem;
                    line-height: 1.2;
                }
                .modular-renderer .ProseMirror h2 {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 1.75rem;
                    font-weight: 600;
                    color: var(--text-article-title);
                    margin: 2rem 0 1rem;
                    line-height: 1.3;
                    letter-spacing: -0.02em;
                }
                .modular-renderer .ProseMirror h3 {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 1.35rem;
                    font-weight: 600;
                    color: var(--text-article-title);
                    margin: 1.5rem 0 0.75rem;
                    line-height: 1.4;
                }
                .modular-renderer .ProseMirror p {
                    color: var(--text-secondary);
                    line-height: 1.7;
                    margin-bottom: 1.25em;
                }
                .modular-renderer .ProseMirror ul,
                .modular-renderer .ProseMirror ol {
                    padding-left: 1.5rem;
                    margin: 1rem 0;
                    color: var(--text-secondary);
                }
                .modular-renderer .ProseMirror blockquote {
                    border-left: 4px solid var(--brand-primary);
                    padding-left: 1rem;
                    margin: 1.5rem 0;
                    color: var(--text-tertiary);
                    font-style: italic;
                }
            `}</style>
        </div>
    );
}
