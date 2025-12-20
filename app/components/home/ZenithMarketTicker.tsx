import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import { TokenBTC, TokenETH } from '@token-icons/react';
import { FearGreedMobile } from './FearGreedMobile';
import { useCryptoData } from '@/lib/domains/crypto/hooks/useCryptoData';
import ZenithCard from '@/components/ui/ZenithCard';
import FlipCard from '@/components/ui/FlipCard';
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

    // Fetch real crypto data for the mobile ticker
    const { data: cryptoData } = useCryptoData();

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

    // Filter coins for mobile ticker: BTC, ETH, XRP, BNB, SOL
    const targetCoins = ['btc', 'eth', 'xrp', 'bnb', 'sol'];
    const mobileTickerCoins = targetCoins.map(symbol =>
        cryptoData?.find(c => c.symbol.toLowerCase() === symbol)
    ).filter(Boolean);

    if (!marketData) return null;

    // Definições dos cards com explicações (versões para mobile e desktop)
    const cardDefinitions = {
        marketCap: {
            title: 'Capitalização',
            mobileText: 'Valor total de mercado cripto. Preço × quantidade em circulação.',
            desktopText: 'Valor total de mercado de todas as criptomoedas. Calculado multiplicando o preço de cada moeda pela quantidade em circulação. Indica o tamanho do mercado cripto.'
        },
        volume: {
            title: 'Volume 24h',
            mobileText: 'Total negociado nas últimas 24h. Alto volume = mercado ativo.',
            desktopText: 'Total de criptomoedas negociadas nas últimas 24 horas. Alto volume indica mercado ativo e liquidez. Baixo volume pode significar menos interesse.'
        },
        btcDom: {
            title: 'Dominância BTC',
            mobileText: '% do mercado que é Bitcoin. Queda indica altcoin season.',
            desktopText: 'Percentual do mercado cripto que pertence ao Bitcoin. Alta dominância sugere maior confiança no BTC. Queda pode indicar "altcoin season".'
        },
        ethDom: {
            title: 'Dominância ETH',
            mobileText: '% do mercado que é Ethereum. Força do ecossistema.',
            desktopText: 'Percentual do mercado cripto que pertence ao Ethereum. Reflete a força do ecossistema ETH incluindo DeFi, NFTs e smart contracts.'
        }
    };

    const renderCard = (id: string) => {
        const cardInfo = cardDefinitions[id as keyof typeof cardDefinitions];

        // Card de explicação (verso) - versões separadas para mobile e desktop
        const renderBackCard = (variant: 'success' | 'danger' | 'orange' | 'indigo', title: string, mobileText: string, desktopText: string) => (
            <ZenithCard variant={variant} className="h-full flex flex-col justify-center min-h-[150px] p-3 lg:p-4">
                {/* Mobile: texto curto, centralizado */}
                <div className="lg:hidden text-center">
                    <h4 className="font-bold text-sm mb-1 text-[var(--text-primary)]">
                        {title}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-snug">
                        {mobileText}
                    </p>
                </div>
                {/* Desktop: texto completo, alinhado à esquerda */}
                <div className="hidden lg:block">
                    <h4 className="font-bold text-base mb-2 text-[var(--text-primary)]">
                        O que é {title}?
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {desktopText}
                    </p>
                </div>
            </ZenithCard>
        );

        switch (id) {
            case 'marketCap':
                const isPositive = marketData.marketCapChange24h >= 0;
                const frontMarketCap = (
                    <ZenithCard variant={isPositive ? 'success' : 'danger'} className="h-full flex flex-col justify-center min-h-[150px]">
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
                    </ZenithCard>
                );
                return (
                    <FlipCard
                        front={frontMarketCap}
                        back={renderBackCard(isPositive ? 'success' : 'danger', cardInfo.title, cardInfo.mobileText, cardInfo.desktopText)}
                        className="h-full"
                    />
                );
            case 'volume':
                const isPositiveVolume = (marketData.volumeChange24h || 0) >= 0;
                const frontVolume = (
                    <ZenithCard variant={isPositiveVolume ? 'success' : 'danger'} className="h-full flex flex-col justify-center min-h-[150px]">
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
                    </ZenithCard>
                );
                return (
                    <FlipCard
                        front={frontVolume}
                        back={renderBackCard(isPositiveVolume ? 'success' : 'danger', cardInfo.title, cardInfo.mobileText, cardInfo.desktopText)}
                        className="h-full"
                    />
                );
            case 'btcDom':
                const frontBtcDom = (
                    <ZenithCard variant="orange" className="h-full flex flex-col justify-center min-h-[150px]">
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
                    </ZenithCard>
                );
                return (
                    <FlipCard
                        front={frontBtcDom}
                        back={renderBackCard('orange', cardInfo.title, cardInfo.mobileText, cardInfo.desktopText)}
                        className="h-full"
                    />
                );
            case 'ethDom':
                const frontEthDom = (
                    <ZenithCard variant="indigo" className="h-full flex flex-col justify-center min-h-[150px]">
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
                    </ZenithCard>
                );
                return (
                    <FlipCard
                        front={frontEthDom}
                        back={renderBackCard('indigo', cardInfo.title, cardInfo.mobileText, cardInfo.desktopText)}
                        className="h-full"
                    />
                );
            default:
                return null;
        }
    };

    if (!mounted) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8">
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
                    <FearGreedMobile fearGreed={fearGreed} gaugeValue={gaugeValue} />

                    {/* Mobile Price Ticker - DYNAMIC DATA */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-2 pb-4 border-b border-[var(--border-light)]">
                        {mobileTickerCoins && mobileTickerCoins.length > 0 ? (
                            mobileTickerCoins.map((coin) => (
                                <div key={coin!.id} className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-[var(--text-secondary)]">
                                        {coin!.symbol.toUpperCase()}
                                    </span>
                                    <span className="text-sm font-bold text-[var(--text-primary)]">
                                        ${coin!.current_price.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: coin!.current_price < 1 ? 4 : 2
                                        })}
                                    </span>
                                </div>
                            ))
                        ) : (
                            // Loading State / Fallback
                            <div className="w-full flex justify-center py-2 text-xs text-[var(--text-tertiary)]">
                                Carregando preços...
                            </div>
                        )}
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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8">
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
