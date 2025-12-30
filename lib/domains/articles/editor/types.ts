/**
 * Tipos para o Sistema de Blocos Modulares
 * 
 * Baseado em TipTap para editor visual
 */

// Tipo genérico para blocos (compatível com TipTap/ProseMirror)
export interface Block {
    type: string;
    attrs?: Record<string, unknown>;
    content?: Block[];
}

// ============================================
// TIPOS DE BLOCOS CUSTOMIZADOS
// ============================================

/**
 * Bloco de Quiz - Pergunta interativa
 */
export interface QuizBlockData {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

/**
 * Bloco de Callout - Destaque/Aviso
 */
export interface CalloutBlockData {
    type: 'tip' | 'warning' | 'note' | 'security' | 'danger';
    title: string;
    content: string;
}

/**
 * Bloco de Código - Syntax highlighting
 */
export interface CodeBlockData {
    language: string;
    code: string;
    filename?: string;
}

/**
 * Bloco de Tabela Comparativa
 */
export interface ComparisonTableBlockData {
    headers: string[];
    rows: string[][];
}

// ============================================
// TIPOS DE ARTIGO MODULAR
// ============================================

/**
 * Artigo no formato modular (v2)
 */
export interface ModularArticle {
    version: '2.0';
    blocks: Block[];
    metadata: ArticleMetadata;
    quiz?: QuizQuestion[];
}

/**
 * Metadados do artigo
 */
export interface ArticleMetadata {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    level: 'iniciante' | 'intermediario' | 'avancado';
    readTime: string;
    tags: string[];
    author?: string;
    publishedAt?: string;
    updatedAt?: string;
}

/**
 * Pergunta de quiz (formato existente)
 */
export interface QuizQuestion {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

// ============================================
// ESTADOS DO EDITOR
// ============================================

export interface EditorState {
    isDirty: boolean;
    isSaving: boolean;
    lastSaved?: Date;
    mode: 'edit' | 'preview' | 'split';
}

export interface EditorActions {
    save: () => Promise<void>;
    reset: () => void;
    exportMarkdown: () => string;
    exportJSON: () => ModularArticle;
    importMarkdown: (markdown: string) => void;
}

// ============================================
// PROPS DOS COMPONENTES
// ============================================

export interface ArticleEditorProps {
    article?: ModularArticle;
    onSave?: (article: ModularArticle) => Promise<void>;
    onChange?: (article: ModularArticle) => void;
    readOnly?: boolean;
}

export interface ArticleRendererProps {
    article: ModularArticle;
    showTableOfContents?: boolean;
    showQuiz?: boolean;
}
