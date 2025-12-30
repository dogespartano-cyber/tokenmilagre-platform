'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLightbulb,
    faExclamationTriangle,
    faStickyNote,
    faShieldAlt,
    faSkullCrossbones,
    faChevronDown,
    faChevronUp
} from '@fortawesome/free-solid-svg-icons';

export type CalloutType = 'tip' | 'warning' | 'note' | 'security' | 'danger';

interface CalloutBlockProps {
    type: CalloutType;
    title: string;
    children: React.ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
}

const calloutConfig: Record<CalloutType, { icon: typeof faLightbulb; label: string; colorVar: string }> = {
    tip: {
        icon: faLightbulb,
        label: '💡 Dica Pro',
        colorVar: '--states-info-base'
    },
    warning: {
        icon: faExclamationTriangle,
        label: '⚠️ Atenção',
        colorVar: '--states-warning-base'
    },
    note: {
        icon: faStickyNote,
        label: '📝 Nota',
        colorVar: '--text-secondary'
    },
    security: {
        icon: faShieldAlt,
        label: '🔐 Segurança',
        colorVar: '--states-success-base'
    },
    danger: {
        icon: faSkullCrossbones,
        label: '🚨 Perigo',
        colorVar: '--states-error-base'
    },
};

/**
 * Bloco de Callout - Destaque visual para dicas, avisos, notas, etc.
 */
export function CalloutBlock({
    type,
    title,
    children,
    collapsible = false,
    defaultOpen = true
}: CalloutBlockProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const config = calloutConfig[type];

    return (
        <div
            className="my-4 rounded-xl overflow-hidden"
            style={{
                background: 'var(--bg-tertiary)',
                border: `1px solid var(${config.colorVar})`,
                borderLeft: `4px solid var(${config.colorVar})`
            }}
        >
            {/* Header */}
            <div
                className={`flex items-center gap-3 px-4 py-3 ${collapsible ? 'cursor-pointer' : ''}`}
                onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
                style={{
                    background: `color-mix(in srgb, var(${config.colorVar}) 10%, transparent)`
                }}
            >
                <FontAwesomeIcon
                    icon={config.icon}
                    style={{ color: `var(${config.colorVar})` }}
                />
                <span
                    className="font-semibold flex-1"
                    style={{ color: `var(${config.colorVar})` }}
                >
                    {title || config.label}
                </span>
                {collapsible && (
                    <FontAwesomeIcon
                        icon={isOpen ? faChevronUp : faChevronDown}
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                    />
                )}
            </div>

            {/* Content */}
            {(!collapsible || isOpen) && (
                <div
                    className="px-4 py-3"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

/**
 * Componente de inserção de Callout no editor
 */
interface CalloutInsertProps {
    onInsert: (type: CalloutType, title: string, content: string) => void;
}

export function CalloutInsertMenu({ onInsert }: CalloutInsertProps) {
    const types: CalloutType[] = ['tip', 'warning', 'note', 'security', 'danger'];

    return (
        <div className="flex gap-2 p-2 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
            {types.map((type) => {
                const config = calloutConfig[type];
                return (
                    <button
                        key={type}
                        onClick={() => onInsert(type, config.label, 'Conteúdo aqui...')}
                        className="p-2 rounded-lg transition-all hover:scale-105"
                        style={{
                            background: `color-mix(in srgb, var(${config.colorVar}) 20%, transparent)`,
                            color: `var(${config.colorVar})`
                        }}
                        title={config.label}
                    >
                        <FontAwesomeIcon icon={config.icon} />
                    </button>
                );
            })}
        </div>
    );
}

export default CalloutBlock;
