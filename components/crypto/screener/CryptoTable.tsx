'use client';

import { Table, flexRender } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { CryptoData } from '@/lib/domains/crypto/hooks/useCryptoData';

interface CryptoTableProps {
    table: Table<CryptoData>;
}

export function CryptoTable({ table }: CryptoTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="border-b" style={{ borderColor: 'var(--border-light)' }}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:opacity-80 transition-colors"
                                    onClick={header.column.getToggleSortingHandler()}
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    <div className="flex items-center gap-2">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" style={{ color: 'var(--brand-primary)' }} />,
                                            desc: <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3" style={{ color: 'var(--brand-primary)' }} />,
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr
                            key={row.id}
                            className="border-b transition-colors duration-200 hover:bg-[var(--bg-secondary)]"
                            style={{ borderColor: 'var(--border-light)' }}
                        >
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-4 py-4">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
