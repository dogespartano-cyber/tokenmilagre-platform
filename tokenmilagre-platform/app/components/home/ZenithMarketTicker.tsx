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
                    <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/10 backdrop-blur-md overflow-hidden cursor-default h-full flex flex-col justify-center min-h-[100px]">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-medium text-[var(--text-tertiary)]">Capitalização Total</p>
                            <p className="text-xl font-bold text-[var(--text-primary)] font-mono tracking-tight">{formatNumber(marketData.totalMarketCap)}</p>
                            <span className={`text-xs font-bold ${marketData.marketCapChange24h >= 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'} flex items-center gap-1`}>
                                {marketData.marketCapChange24h >= 0 ? '▲' : '▼'} {Math.abs(marketData.marketCapChange24h).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                );
            case 'volume':
                return (
                    <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/10 backdrop-blur-md overflow-hidden cursor-default h-full flex flex-col justify-center min-h-[100px]">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-medium text-[var(--text-tertiary)]">Volume 24h</p>
                            <p className="text-xl font-bold text-[var(--text-primary)] font-mono tracking-tight">{formatNumber(marketData.totalVolume)}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Global</p>
                        </div>
                    </div>
                );
            case 'btcDom':
                return (
                    <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-orange-500/10 backdrop-blur-md overflow-hidden cursor-default h-full flex flex-col justify-center min-h-[100px]">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-medium text-[var(--text-tertiary)]">Dominância BTC</p>
                            <p className="text-xl font-bold text-[var(--text-primary)] font-mono tracking-tight">{marketData.btcDominance.toFixed(2)}%</p>
                            <div className="w-full bg-[var(--bg-tertiary)] h-1 rounded-full overflow-hidden mt-1">
                                <div className="bg-orange-500 h-full rounded-full transition-all duration-1000" style={{ width: `${marketData.btcDominance}%` }} />
                            </div>
                        </div>
                    </div>
                );
            case 'ethDom':
                return (
                    <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 backdrop-blur-md overflow-hidden cursor-default h-full flex flex-col justify-center min-h-[100px]">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-medium text-[var(--text-tertiary)]">Dominância ETH</p>
                            <p className="text-xl font-bold text-[var(--text-primary)] font-mono tracking-tight">{marketData.ethDominance.toFixed(2)}%</p>
                            <div className="w-full bg-[var(--bg-tertiary)] h-1 rounded-full overflow-hidden mt-1">
                                <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${marketData.ethDominance}%` }} />
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
