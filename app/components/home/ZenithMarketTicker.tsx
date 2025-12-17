import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import { TokenBTC, TokenETH } from '@token-icons/react';
import { FearGreedGauge } from './FearGreedGauge';
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

export function ZenithMarketTicker({ marketData, fearGreed, gaugeValue }: MarketDataProps) {
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
                const isPositive = marketData.marketCapChange24h >= 0;
                return (
                    <div className={`group relative p-6 rounded-2xl border dark:backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl cursor-default h-full flex flex-col justify-center min-h-[140px] ${isPositive
                        ? 'bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-green-500/10 dark:to-emerald-500/5 border-green-200 dark:border-green-500/20 hover:shadow-green-500/10'
                        : 'bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-red-500/10 dark:to-rose-500/5 border-red-200 dark:border-red-500/20 hover:shadow-red-500/10'
                        }`}>
                        {/* Glow */}
                        <div
                            className={`absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${isPositive ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'
                                }`}
                            style={{ boxShadow: isPositive ? '0 0 20px #10b98140' : '0 0 20px #ef444440' }}
                        />

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`hidden lg:block p-2 rounded-xl transition-transform duration-300 group-hover:scale-110 ${isPositive
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                                : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                                }`}>
                                <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
                            </div>
                            <h3 className={`font-bold text-sm lg:text-base ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>Capitalização</h3>
                        </div>

                        {/* Value */}
                        <div className="flex items-end gap-2 mb-1">
                            <p className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] font-mono tracking-tight">{formatNumber(marketData.totalMarketCap)}</p>
                        </div>

                        {/* Footer */}
                        <span className={`text-xs font-bold ${isPositive ? 'text-[var(--success)]' : 'text-[var(--error)]'} flex items-center gap-1`}>
                            {isPositive ? '▲' : '▼'} {Math.abs(marketData.marketCapChange24h).toFixed(1)}%
                        </span>
                    </div>
                );
            case 'volume':
                const isPositiveVolume = (marketData.volumeChange24h || 0) >= 0;
                return (
                    <div className={`group relative p-6 rounded-2xl border dark:backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl cursor-default h-full flex flex-col justify-center min-h-[140px] ${isPositiveVolume
                        ? 'bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-green-500/10 dark:to-emerald-500/5 border-green-200 dark:border-green-500/20 hover:shadow-green-500/10'
                        : 'bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-red-500/10 dark:to-rose-500/5 border-red-200 dark:border-red-500/20 hover:shadow-red-500/10'
                        }`}>
                        {/* Glow */}
                        <div
                            className={`absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${isPositiveVolume ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'
                                }`}
                            style={{ boxShadow: isPositiveVolume ? '0 0 20px #10b98140' : '0 0 20px #ef444440' }}
                        />

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`hidden lg:block p-2 rounded-xl transition-transform duration-300 group-hover:scale-110 ${isPositiveVolume
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                                : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                                }`}>
                                <FontAwesomeIcon icon={faRightLeft} className="w-5 h-5 rotate-90" />
                            </div>
                            <h3 className={`font-bold text-sm lg:text-base ${isPositiveVolume ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>Volume 24h</h3>
                        </div>

                        {/* Value */}
                        <div className="flex items-end gap-2 mb-1">
                            <p className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] font-mono tracking-tight">{formatNumber(marketData.totalVolume)}</p>
                        </div>

                        {/* Footer */}
                        <span className={`text-xs font-bold ${isPositiveVolume ? 'text-[var(--success)]' : 'text-[var(--error)]'} flex items-center gap-1`}>
                            {isPositiveVolume ? '▲' : '▼'} {Math.abs(marketData.volumeChange24h || 0).toFixed(1)}%
                        </span>
                    </div>
                );
            case 'btcDom':
                return (
                    <div className="group relative p-6 rounded-2xl bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-orange-500/10 dark:to-amber-500/5 border border-orange-200 dark:border-orange-500/20 dark:backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 cursor-default h-full flex flex-col justify-center min-h-[140px]">
                        {/* Glow */}
                        <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-500 to-amber-500" style={{ boxShadow: '0 0 20px #f59e0b40' }} />

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="hidden lg:block p-2 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-orange-700 dark:text-orange-400 transition-transform duration-300 group-hover:scale-110">
                                <TokenBTC className="w-5 h-5" variant="branded" />
                            </div>
                            <h3 className="font-bold text-orange-600 dark:text-orange-400 text-sm lg:text-base">Dominância BTC</h3>
                        </div>

                        {/* Value */}
                        <div className="flex items-end gap-2 mb-1">
                            <p className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] font-mono tracking-tight">{marketData.btcDominance.toFixed(2)}%</p>
                        </div>

                        {/* Footer Bar */}
                        <div className="w-full bg-[var(--bg-tertiary)] h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-orange-500 h-full rounded-full transition-all duration-1000" style={{ width: `${marketData.btcDominance}%` }} />
                        </div>
                    </div>
                );
            case 'ethDom':
                return (
                    <div className="group relative p-6 rounded-2xl bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-indigo-500/10 dark:to-purple-500/5 border border-indigo-200 dark:border-indigo-500/20 dark:backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 cursor-default h-full flex flex-col justify-center min-h-[140px]">
                        {/* Glow */}
                        <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-500 to-purple-500" style={{ boxShadow: '0 0 20px #6366f140' }} />

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="hidden lg:block p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-700 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-110">
                                <TokenETH className="w-5 h-5" variant="branded" />
                            </div>
                            <h3 className="font-bold text-indigo-600 dark:text-indigo-400 text-sm lg:text-base">Dominância ETH</h3>
                        </div>

                        {/* Value */}
                        <div className="flex items-end gap-2 mb-1">
                            <p className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] font-mono tracking-tight">{marketData.ethDominance.toFixed(2)}%</p>
                        </div>

                        {/* Footer Bar */}
                        <div className="w-full bg-[var(--bg-tertiary)] h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${marketData.ethDominance}%` }} />
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
        <div className="flex flex-col gap-6">
            {/* MOBILE ONLY: Fear & Greed and Price Ticker (Moved here for correct order) */}
            {fearGreed && typeof gaugeValue !== 'undefined' && (
                <div className="lg:hidden space-y-6 mb-2">
                    <FearGreedGauge fearGreed={fearGreed} gaugeValue={gaugeValue} />

                    {/* Mobile Price Ticker */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-2 pb-4 border-b border-[var(--border-light)]">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[var(--text-secondary)]">BTC</span>
                            <span className="text-sm font-bold text-[var(--text-primary)]">$90,234</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[var(--text-secondary)]">ETH</span>
                            <span className="text-sm font-bold text-[var(--text-primary)]">$3,208</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[var(--text-secondary)]">XRP</span>
                            <span className="text-sm font-bold text-[var(--text-primary)]">$2.01</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[var(--text-secondary)]">BNB</span>
                            <span className="text-sm font-bold text-[var(--text-primary)]">$871</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[var(--text-secondary)]">SOL</span>
                            <span className="text-sm font-bold text-[var(--text-primary)]">$131</span>
                        </div>
                    </div>
                </div>
            )}

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
        </div>
    );
}
