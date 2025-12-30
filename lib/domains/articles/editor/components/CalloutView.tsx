import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLightbulb,
    faExclamationTriangle,
    faInfoCircle,
    faShieldAlt,
    faBomb
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';

const icons = {
    tip: faLightbulb,
    warning: faExclamationTriangle,
    note: faInfoCircle,
    security: faShieldAlt,
    danger: faBomb
};

const styles = {
    tip: 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300',
    warning: 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300',
    note: 'bg-gray-500/10 border-gray-500 text-gray-700 dark:text-gray-300',
    security: 'bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300',
    danger: 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-300',
};

export function CalloutView(props: NodeViewProps) {
    const { node, updateAttributes, editor } = props;
    const type = node.attrs.type as keyof typeof icons;
    const Icon = icons[type] || icons.note;
    const style = styles[type] || styles.note;

    return (
        <NodeViewWrapper className={`my-4 p-4 border-l-4 rounded-r-lg ${style}`}>
            <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 select-none" contentEditable={false}>
                    <FontAwesomeIcon icon={Icon} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <NodeViewContent className="prose prose-sm dark:prose-invert max-w-none" />
                </div>

                {/* Type selector (only visible in edit mode) */}
                {editor.isEditable && (
                    <div className="flex-shrink-0 opacity-0 hover:opacity-100 transition-opacity" contentEditable={false}>
                        <select
                            value={type}
                            onChange={(e) => updateAttributes({ type: e.target.value })}
                            className="text-xs bg-transparent border border-current rounded px-1 py-0.5 cursor-pointer outline-none opacity-50 hover:opacity-100"
                        >
                            {Object.keys(icons).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
}
