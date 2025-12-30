import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { QuizView } from '../components/QuizView';

export interface QuizOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        quiz: {
            setQuiz: () => ReturnType;
        };
    }
}

export const Quiz = Node.create<QuizOptions>({
    name: 'quiz',

    group: 'block',

    atom: true, // It's a leaf node, content is managed by the view

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            question: {
                default: '',
                parseHTML: element => element.getAttribute('data-question'),
            },
            options: {
                default: ['Opção 1', 'Opção 2'],
                parseHTML: element => {
                    const attr = element.getAttribute('data-options');
                    return attr ? JSON.parse(attr) : ['Opção 1', 'Opção 2'];
                },
                renderHTML: attributes => ({
                    'data-options': JSON.stringify(attributes.options),
                }),
            },
            correctAnswer: {
                default: 0,
                parseHTML: element => parseInt(element.getAttribute('data-correct') || '0', 10),
                renderHTML: attributes => ({
                    'data-correct': attributes.correctAnswer,
                }),
            },
            explanation: {
                default: '',
                parseHTML: element => element.getAttribute('data-explanation'),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div.quiz-block',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: 'quiz-block' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(QuizView);
    },

    addCommands() {
        return {
            setQuiz:
                () =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                        });
                    },
        };
    },
});
