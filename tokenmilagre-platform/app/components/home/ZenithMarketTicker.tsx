import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { TokenBTC, TokenETH } from '@token-icons/react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    TouchSensor
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { MarketDataProps } from './types';

const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    return `$${(num / 1e6).toFixed(0)}M`;
};

const initialItems = ['marketCap', 'volume', 'btcDom', 'ethDom'];

function SortableCard({ id, children }: { id: string, children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="h-full touch-manipulation"
        >
            <div className="h-full" style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
                {children}
            </div>
        </div>
    );
}

export function ZenithMarketTicker({ marketData }: MarketDataProps) {
    const [items, setItems] = useState(initialItems);
    const [mounted, setMounted] = useState(false);
    const STORAGE_KEY = 'zenith_ticker_order';

    useEffect(() => {
        setMounted(true);
        const savedOrder = localStorage.getItem(STORAGE_KEY);
        if (savedOrder) {
            try {
                const orderIds = JSON.parse(savedOrder);
                const validOrder = orderIds.filter((id: string) => initialItems.includes(id));
                const missingItems = initialItems.filter(id => !validOrder.includes(id));
                if (validOrder.length > 0) {
                    setItems([...validOrder, ...missingItems]);
                }
            } catch (e) {
                console.error('Failed to parse ticker order', e);
            }
        }
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id as string);
                const newIndex = items.indexOf(over.id as string);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
                return newOrder;
            });
        }
    };

    if (!marketData) return null;

    const renderCard = (id: string) => {
        switch (id) {
            case 'marketCap':
                return (
                    <div className="group relative p-4 lg:p-6 lg:min-h-[140px] rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 cursor-default h-full flex flex-col justify-center">
                        <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-indigo-500" style={{ boxShadow: '0 0 20px #3b82f640' }} />
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110 shrink-0">
                                <FontAwesomeIcon icon={faGlobe} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider truncate">Capitalização Global</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm sm:text-lg font-bold text-[var(--text-primary)] font-mono">{formatNumber(marketData.totalMarketCap)}</span>
                                    <span className={`text-[10px] sm:text-xs font-bold ${marketData.marketCapChange24h >= 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'} flex items-center gap-1`}>
                                        {marketData.marketCapChange24h >= 0 ? '+' : ''}{marketData.marketCapChange24h.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'volume':
                return (
                    <div className="group relative p-4 lg:p-6 lg:min-h-[140px] rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10 cursor-default h-full flex flex-col justify-center">
                        <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-green-500 to-emerald-500" style={{ boxShadow: '0 0 20px #10b98140' }} />
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-green-500/10 rounded-xl text-green-600 dark:text-green-400 transition-transform duration-300 group-hover:scale-110 shrink-0">
                                <FontAwesomeIcon icon={faChartLine} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider truncate">Volume 24h</p>
                                <span className="text-sm sm:text-lg font-bold text-[var(--text-primary)] font-mono block truncate">{formatNumber(marketData.totalVolume)}</span>
                            </div>
                        </div>
                    </div>
                );
            case 'btcDom':
                return (
                    <div className="group relative p-4 lg:p-6 lg:min-h-[140px] rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 cursor-default h-full flex flex-col justify-center">
                        <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-500 to-amber-500" style={{ boxShadow: '0 0 20px #f9731640' }} />
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-orange-500/10 rounded-xl transition-transform duration-300 group-hover:scale-110 shrink-0">
                                <TokenBTC size={20} variant="branded" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-[10px] sm:text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider truncate">Dominância Bitcoin</p>
                                    <span className="text-[10px] sm:text-xs font-bold text-[var(--text-primary)] ml-1">{marketData.btcDominance.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-[var(--bg-tertiary)] h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${marketData.btcDominance}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'ethDom':
                return (
                    <div className="group relative p-4 lg:p-6 lg:min-h-[140px] rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 cursor-default h-full flex flex-col justify-center">
                        <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-500 to-purple-500" style={{ boxShadow: '0 0 20px #6366f140' }} />
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-500/10 rounded-xl transition-transform duration-300 group-hover:scale-110 shrink-0">
                                <TokenETH size={20} variant="branded" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-[10px] sm:text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider truncate">Dominância Ethereum</p>
                                    <span className="text-[10px] sm:text-xs font-bold text-[var(--text-primary)] ml-1">{marketData.ethDominance.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-[var(--bg-tertiary)] h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${marketData.ethDominance}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (!mounted) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {initialItems.map((id) => (
                    <div key={id} className="h-full">
                        {renderCard(id)}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={rectSortingStrategy}
            >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {items.map((id) => (
                        <SortableCard key={id} id={id}>
                            {renderCard(id)}
                        </SortableCard>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
