'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface CryptoSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function CryptoSearch({ value, onChange }: CryptoSearchProps) {
    return (
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
            <div className="relative">
                <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: 'var(--text-tertiary)' }}
                />
                <input
                    type="text"
                    value={value ?? ''}
                    onChange={e => onChange(e.target.value)}
                    placeholder="Buscar criptomoeda..."
                    className="w-full border rounded-lg pl-12 pr-4 py-3 focus:outline-none transition-colors"
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-medium)',
                        color: 'var(--text-primary)'
                    }}
                />
            </div>
        </div>
    );
}
