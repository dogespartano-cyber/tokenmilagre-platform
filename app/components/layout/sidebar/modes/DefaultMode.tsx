/**
 * DefaultMode Component
 * Menu padrão com Drag & Drop e botão resetar interface
 * 
 * @agi-domain: layout/sidebar
 * @mode: default
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faNewspaper,
    faHome,
    faInfoCircle,
    faCoins,
    faGraduationCap,
    faStore,
    faBitcoinSign,
    faRotateRight,
    faGaugeHigh,
} from '@fortawesome/free-solid-svg-icons';
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
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTheme } from '@/contexts/ThemeContext';
import SocialLinks from '@/components/shared/SocialLinks';
import type { SidebarModeProps, MenuItem } from '../types';

const initialMenuItems: MenuItem[] = [
    { id: 'home', href: '/', label: 'Início', icon: faHome },
    { id: 'news', href: '/noticias', label: 'Notícias', icon: faNewspaper },
    { id: 'charts', href: '/graficos', label: 'Gráficos', icon: faChartLine },
    { id: 'sentiment', href: '/sentimento', label: 'Sentimento', icon: faGaugeHigh },
    { id: 'crypto', href: '/criptomoedas', label: 'Criptomoedas', icon: faBitcoinSign },
    { id: 'edu', href: '/educacao', label: 'Educação', icon: faGraduationCap },
    { id: 'resources', href: '/recursos', label: 'Recursos', icon: faStore },
    { id: 'token', href: '/token', label: 'Token', icon: faCoins },
    { id: 'about', href: '/sobre', label: 'Sobre', icon: faInfoCircle },
];

function SortableMenuItem({ item, onClose, isActive, theme }: {
    item: MenuItem;
    onClose: () => void;
    isActive: boolean;
    theme: string;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group/item">
            {/* Drag Handle - Invisible (Functional but hidden) */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-0 top-0 bottom-0 w-8 cursor-grab active:cursor-grabbing z-20 opacity-0 transition-opacity flex items-center justify-center"
            >
                {/* Visual indicator removed per user request */}
            </div>

            {/* Link */}
            <Link
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 select-none ${isActive
                    ? 'bg-[#e6f4f3] text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 font-bold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-teal-600 dark:hover:text-teal-300'
                    }`}
            >
                <FontAwesomeIcon
                    icon={item.icon}
                    className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                />
                <span>{item.label}</span>
            </Link>
        </div>
    );
}

export default function DefaultMode({ onClose }: SidebarModeProps) {
    const pathname = usePathname();
    const { theme } = useTheme();
    const [menuItems, setMenuItems] = useState(initialMenuItems);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    // Load saved order from localStorage
    useEffect(() => {
        const savedOrder = localStorage.getItem('sidebarOrder');
        if (savedOrder) {
            try {
                const orderIds = JSON.parse(savedOrder);
                const reorderedItems = orderIds
                    .map((id: string) => initialMenuItems.find(item => item.id === id))
                    .filter(Boolean) as MenuItem[];

                const missingItems = initialMenuItems.filter(item => !orderIds.includes(item.id));
                setMenuItems([...reorderedItems, ...missingItems]);
            } catch (e) {
                console.error('Error loading sidebar order:', e);
            }
        }
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setMenuItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newItems = arrayMove(items, oldIndex, newIndex);
                localStorage.setItem('sidebarOrder', JSON.stringify(newItems.map(i => i.id)));
                return newItems;
            });
        }
    };

    return (
        <nav className="flex-1 p-4 overflow-y-auto flex flex-col">
            <div className="flex-1">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={menuItems.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2 mb-8">
                            {menuItems.map((item) => {
                                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                                return (
                                    <SortableMenuItem
                                        key={item.id}
                                        item={item}
                                        onClose={onClose}
                                        isActive={isActive}
                                        theme={theme}
                                    />
                                );
                            })}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {/* Social Links (Above the line) */}
            <div className="px-5 mb-2">
                <SocialLinks variant="minimal" platforms={['discord', 'telegram']} size="sm" className="justify-start gap-5 opacity-50 hover:opacity-100 transition-opacity" />
            </div>

            {/* Reset Interface Button */}
            <div className="pt-2 mt-2 border-t border-[var(--border-light)] dark:border-white/5">
                <button
                    onClick={() => {
                        if (window.confirm('Deseja resetar a organização da interface para o padrão?')) {
                            localStorage.removeItem('zenith_home_sections_order');
                            localStorage.removeItem('sidebarOrder');
                            localStorage.removeItem('zenith_ticker_order');
                            window.location.reload();
                        }
                    }}
                    className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-secondary)] transition-all duration-300"
                >
                    <FontAwesomeIcon icon={faRotateRight} className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180" />
                    <span>Resetar Interface</span>
                </button>
            </div>
        </nav>
    );
}
