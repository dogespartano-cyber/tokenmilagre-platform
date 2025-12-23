/**
 * @module home/QuickStartGrid
 * @description Grid "Comece por Aqui" com design estilo Dashboard/Stats
 */


'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faGraduationCap, faNewspaper, faArrowRight, faCoins, faTools } from '@fortawesome/free-solid-svg-icons';
import ZenithCard from '@/components/ui/ZenithCard';
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
        theme: 'default'
    },
    {
        id: 'news',
        href: '/noticias',
        icon: faNewspaper,
        title: 'Notícias do Mercado',
        description: 'Atualizações em tempo real',
        bgImage: '/assets/zenith/card-news.webp',
        theme: 'default'
    },
    {
        id: 'charts',
        href: '/graficos',
        icon: faChartLine,
        title: 'Gráficos Avançados',
        description: 'Análise técnica profissional',
        bgImage: '/assets/zenith/card-charts.webp',
        theme: 'default'
    },
    {
        id: 'tools',
        href: '/ferramentas',
        icon: faTools,
        title: 'Ferramentas',
        description: 'Calculadoras e recursos',
        bgImage: '/assets/zenith/card-tools.webp',
        theme: 'default'
    },
    {
        id: 'crypto',
        href: '/criptomoedas',
        icon: faCoins,
        title: 'Criptomoedas',
        description: 'Explore o mercado',
        theme: 'default'
    }
];

interface QuickStartGridProps {
}



// --- Sortable Item Component ---
function SortableCard({
    card,
    id,
    isActive,
    onHoverChange
}: {
    card: typeof initialCards[0],
    id: string,
    isActive?: boolean,
    onHoverChange?: (id: string | null) => void
}) {
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

    // Map legacy themes to ZenithCard variants
    const variantMap: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'orange' | 'indigo' | 'teal'> = {
        default: 'default',
        success: 'success',
        yellow: 'warning',
        warning: 'warning',
        red: 'danger',
        cyan: 'info',
        info: 'info',
        orange: 'orange',
        indigo: 'indigo',
        teal: 'teal'
    };

    // Default to 'default' if theme is missing or invalid
    const variant = variantMap[card.theme as string] || 'default';

    // Icon colors still need to be handled. We can map them based on variant or keep local logic.
    // Let's keep a simple map for inner content colors to match the variant
    const colorClasses = {
        default: 'text-[var(--brand-primary)] bg-[var(--brand-primary)]/10',
        success: 'text-[var(--success)] bg-[var(--success)]/10',
        warning: 'text-yellow-500 bg-yellow-500/10',
        danger: 'text-red-500 bg-red-500/10',
        info: 'text-cyan-500 bg-cyan-500/10',
        orange: 'text-orange-500 bg-orange-500/10',
        indigo: 'text-indigo-500 bg-indigo-500/10',
        teal: 'text-teal-600 bg-teal-500/10'
    };

    const iconClass = colorClasses[variant] || colorClasses.default;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="h-full"
            onMouseEnter={() => onHoverChange?.(id)}
            onMouseLeave={() => onHoverChange?.(null)}
        >
            <ZenithCard
                as={Link}
                href={card.href}
                variant={variant}
                isActive={isActive}
                className="h-full min-h-[160px] flex flex-col justify-start items-center select-none touch-manipulation border-none bg-transparent"
                style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                onClick={(e: React.MouseEvent) => {
                    if (isDragging) {
                        e.preventDefault();
                    }
                }}
            >
                {/* Content Layer */}
                <div className="relative z-10 h-full flex flex-col items-center justify-start text-center gap-4 pt-4">
                    <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center
                        text-2xl transition-all duration-300
                        ${iconClass}
                        shadow-none
                    `}>
                        <FontAwesomeIcon icon={card.icon} />
                    </div>

                    <h3 className={`font-[family-name:var(--font-poppins)] font-bold text-base transition-colors ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-primary)] group-hover:text-[var(--brand-primary)]'}`}>
                        {card.title}
                    </h3>
                </div>
            </ZenithCard>
        </div>
    );
}

export function QuickStartGrid() {
    const [items, setItems] = useState(initialCards);
    const [mounted, setMounted] = useState(false);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Persistence key
    const STORAGE_KEY = 'zenith_quickstart_order';

    useEffect(() => {
        setMounted(true);

        // Detect mobile for forcing active state
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);

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

        return () => window.removeEventListener('resize', checkMobile);
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
                    <Link
                        href="/comece-aqui"
                        className="group inline-flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
                        title="Ir para Comece Aqui"
                    >
                        <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)] group-hover:scale-110 transition-transform">
                            <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                            Comece por Aqui
                        </h2>
                    </Link>
                </div>
                <div className="flex flex-wrap justify-start md:justify-center gap-4 lg:gap-6">
                    {initialCards.map((card) => {
                        const isComeceAqui = card.id === 'invest';
                        const shouldShowActive = isMobile || (isComeceAqui && (hoveredId === null || hoveredId === 'invest'));

                        return (
                            <div key={card.id} className="w-[calc(50%-0.5rem)] lg:w-[calc(20%-1.2rem)] md:w-[calc(33.33%-1rem)] flex-grow-0 flex-shrink-0">
                                <SortableCard
                                    card={card}
                                    id={card.id}
                                    isActive={shouldShowActive}
                                    onHoverChange={setHoveredId}
                                />
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    }

    return (
        <section className="py-8">
            <div className="mb-8">
                <Link
                    href="/comece-aqui"
                    className="group inline-flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
                    title="Ir para Comece Aqui"
                >
                    <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)] group-hover:scale-110 transition-transform">
                        <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                        Comece por Aqui
                    </h2>
                </Link>
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
                    <div className="flex flex-wrap justify-start md:justify-center gap-4 lg:gap-6">
                        {items.map((card) => {
                            const isComeceAqui = card.id === 'invest';
                            const shouldShowActive = isMobile || (isComeceAqui && (hoveredId === null || hoveredId === 'invest'));

                            return (
                                <div key={card.id} className="w-[calc(50%-0.5rem)] lg:w-[calc(20%-1.2rem)] md:w-[calc(33.33%-1rem)] flex-grow-0 flex-shrink-0">
                                    <SortableCard
                                        card={card}
                                        id={card.id}
                                        isActive={shouldShowActive}
                                        onHoverChange={setHoveredId}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </SortableContext>
            </DndContext>
        </section>
    );
}
