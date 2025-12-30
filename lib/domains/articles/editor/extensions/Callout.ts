import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CalloutView } from '../components/CalloutView';

export interface CalloutOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        callout: {
            setCallout: () => ReturnType;
            toggleCallout: () => ReturnType;
        };
    }
}

export const Callout = Node.create<CalloutOptions>({
    name: 'callout',

    group: 'block',

    content: 'block+',

    draggable: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            type: {
                default: 'note',
                parseHTML: element => element.getAttribute('data-callout-type'),
                renderHTML: attributes => ({
                    'data-callout-type': attributes.type,
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div.callout',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: 'callout' }), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(CalloutView);
    },

    addCommands() {
        return {
            setCallout:
                () =>
                    ({ commands }) => {
                        return commands.wrapIn(this.name);
                    },
            toggleCallout:
                () =>
                    ({ commands }) => {
                        return commands.toggleWrap(this.name);
                    },
        };
    },
});
