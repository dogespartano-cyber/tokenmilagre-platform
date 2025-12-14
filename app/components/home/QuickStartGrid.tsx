/**
 * @module home/QuickStartGrid
 * @description Grid "Comece por Aqui" com design estilo Dashboard/Stats
 */


'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faGraduationCap, faNewspaper, faArrowRight, faCoins, faTools } from '@fortawesome/free-solid-svg-icons';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    type DragEndEvent,
    TouchSensor,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const initialCards = [
    {
        id: 'invest',
        href: '/comece-aqui',
        icon: faGraduationCap,
        title: 'Comece Aqui',
        description: 'Seu ponto de partida no mundo cripto',
        bgImage: '/assets/zenith/card-invest.webp',
        theme: 'success'
    },
    {
        id: 'news',
        href: '/noticias',
        icon: faNewspaper,
        title: 'Notícias do Mercado',
        description: 'Atualizações em tempo real',
        bgImage: '/assets/zenith/card-news.webp',
        theme: 'yellow'
    },
    {
        id: 'charts',
        href: '/graficos',
        icon: faChartLine,
        title: 'Gráficos Avançados',
        description: 'Análise técnica profissional',
        bgImage: '/assets/zenith/card-charts.webp',
        theme: 'red'
    },
    {
        id: 'tools',
        href: '/ferramentas',
        icon: faTools,
        title: 'Ferramentas',
        description: 'Calculadoras e recursos',
        bgImage: '/assets/zenith/card-tools.webp',
        theme: 'cyan'
    },
    {
        id: 'crypto',
        href: '/criptomoedas',
        icon: faCoins,
        title: 'Criptomoedas',
        description: 'Explore o mercado',
        theme: 'success'
    }
];

const themeMap = {
    success: {
        bg: 'bg-[var(--success-bg)]',
        text: 'text-[var(--success)]',
        icon: 'text-[var(--success)] bg-[var(--success)]/10',
        border: 'border-[var(--success)]/20'
    },
    yellow: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-500',
        icon: 'text-yellow-500 bg-yellow-500/10',
        border: 'border-yellow-500/20'
    },
    red: {
        bg: 'bg-red-500/10',
        text: 'text-red-500',
        icon: 'text-red-500 bg-red-500/10',
        border: 'border-red-500/20'
    },
    cyan: {
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-500',
        icon: 'text-cyan-500 bg-cyan-500/10',
        border: 'border-cyan-500/20'
    }
};

// --- Sortable Item Component ---
function SortableCard({ card, id }: { card: typeof initialCards[0], id: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    // Unified Neutral Theme
    const neutralTheme = {
        bg: 'bg-gray-500/10',
        text: 'text-gray-400',
        icon: 'text-gray-400 bg-gray-500/10',
        border: 'border-gray-500/20'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-full">
            <Link
                href={card.href}
                className={`
                    group relative overflow-hidden rounded-3xl
                    bg-gradient-to-br from-gray-500/10 to-slate-500/5 border border-gray-500/20 hover:shadow-xl hover:shadow-gray-500/10
                    p-6 flex flex-col justify-between
                    h-full min-h-[220px] select-none touch-manipulation
                `}
                style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                onClick={(e) => {
                    if (isDragging) {
                        e.preventDefault();
                    }
                }}
            >
                {/* Content Layer */}
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`
                            w-12 h-12 rounded-2xl flex items-center justify-center
                            text-xl transition-all duration-300
                            ${neutralTheme.icon}
                            shadow-lg
                        `}>
                            <FontAwesomeIcon icon={card.icon} />
                        </div>

                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            border opacity-0 group-hover:opacity-100
                            transition-all duration-300 transform translate-x-4 group-hover:translate-x-0
                            border-gray-500/20 text-gray-400
                        `}>
                            <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-[family-name:var(--font-poppins)] font-bold text-lg mb-1 text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                            {card.title}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] font-medium">
                            {card.description}
                        </p>
                    </div>
                </div>

                {/* Decorative Gradient */}
                <div className={`
                    absolute -bottom-20 -right-20 w-40 h-40 blur-[60px] rounded-full
                    opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none
                    bg-gray-500/10
                `} />
            </Link>
        </div>
    );
}

export function QuickStartGrid() {
    const [items, setItems] = useState(initialCards);
    const [mounted, setMounted] = useState(false);

    // Persistence key
    const STORAGE_KEY = 'zenith_quickstart_order';

    useEffect(() => {
        setMounted(true);
        const savedOrder = localStorage.getItem(STORAGE_KEY);
        if (savedOrder) {
            try {
                const orderIds = JSON.parse(savedOrder);
                // Reconstruct array based on saved IDs, filtering out any obsolete ones
                const reordered = orderIds
                    .map((id: string) => initialCards.find(c => c.id === id))
                    .filter((c: any) => c !== undefined);

                // Add any new cards that weren't in storage
                const newCards = initialCards.filter(c => !orderIds.includes(c.id));

                if (reordered.length > 0) {
                    setItems([...reordered, ...newCards] as typeof initialCards);
                }
            } catch (e) {
                console.error('Failed to parse saved order', e);
            }
        }
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            // Tolerance allows click events to pass through if no movement occurs
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            // For touch, we need delay to distinguish scroll vs drag
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);

                // Save to local storage
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder.map(i => i.id)));

                return newOrder;
            });
        }
    }

    if (!mounted) {
        // Render static grid for SSR/initial load to avoid hydration mismatch
        return (
            <section className="py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Comece por Aqui</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {initialCards.map((card) => (
                        // Reusing the inner card structure statically or simplifying?
                        // Ideally we should extract the card content to a pure presentational component to reuse.
                        // For now, let's just render the first pass content or null.
                        // Rendering initialCards ensures SEO content is present.
                        <SortableCard key={card.id} card={card} id={card.id} />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="py-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                    Comece por Aqui
                </h2>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {items.map((card) => (
                            <SortableCard key={card.id} card={card} id={card.id} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </section>
    );
}
