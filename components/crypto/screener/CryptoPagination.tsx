'use client';

import { Table } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CryptoData } from '@/lib/domains/crypto/hooks/useCryptoData';

interface CryptoPaginationProps {
    table: Table<CryptoData>;
}

export function CryptoPagination({ table }: CryptoPaginationProps) {
    return (
        <div className="p-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-light)' }}>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
                {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                )}{' '}
                de {table.getFilteredRowModel().rows.length} resultados
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-4 py-2 border rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-medium)',
                        color: 'var(--text-primary)'
                    }}
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                </button>
                <span className="text-sm px-4" style={{ color: 'var(--text-secondary)' }}>
                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-4 py-2 border rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-medium)',
                        color: 'var(--text-primary)'
                    }}
                >
                    <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
