/**
 * Sidebar Component
 * Navegação lateral da aplicação
 * 
 * @agi-domain: layout
 * @refactored Extraído de layout-root.tsx
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faNewspaper,
    faHome,
    faInfoCircle,
    faCoins,
    faTimes,
    faGraduationCap,
    faStore,
    faBitcoinSign,
    faRotateRight
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

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialMenuItems = [
    { id: 'home', href: '/', label: 'Início', icon: faHome },
    { id: 'news', href: '/noticias', label: 'Notícias', icon: faNewspaper },
    { id: 'charts', href: '/graficos', label: 'Gráficos', icon: faChartLine },
    { id: 'crypto', href: '/criptomoedas', label: 'Criptomoedas', icon: faBitcoinSign },
    { id: 'edu', href: '/educacao', label: 'Educação', icon: faGraduationCap },
    { id: 'resources', href: '/recursos', label: 'Recursos', icon: faStore },
    { id: 'token', href: '/token', label: 'Token', icon: faCoins },
    { id: 'about', href: '/sobre', label: 'Sobre', icon: faInfoCircle },
];

function SortableMenuItem({ item, onClose, isActive, theme }: { item: typeof initialMenuItems[0], onClose: () => void, isActive: boolean, theme: string }) {
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
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Link
                href={item.href}
                onClick={(e) => {
                    if (isDragging) {
                        e.preventDefault();
                    } else {
                        onClose();
                    }
                }}
                style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 relative overflow-hidden select-none touch-manipulation ${isActive
                    ? 'sidebar-active'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:translate-x-1'
                    }`}
            >
                {/* Shine Effect */}
                {isActive && (
                    <div
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${theme === 'light' ? 'rgba(13, 148, 136, 0.2)' : 'rgba(255,255,255,0.1)'}, transparent)`
                        }}
                    />
                )}

                <FontAwesomeIcon
                    icon={item.icon}
                    className={`w-5 h-5 transition-transform duration-300 relative z-10 ${isActive ? 'scale-110' : 'group-hover:rotate-12'}`}
                />
                <span className="relative z-10">{item.label}</span>
            </Link>
        </div>
    );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { theme } = useTheme();
    const [items, setItems] = useState(initialMenuItems);
    const [mounted, setMounted] = useState(false);

    const STORAGE_KEY = 'zenith_sidebar_order';

    useEffect(() => {
        setMounted(true);
        const savedOrder = localStorage.getItem(STORAGE_KEY);
        if (savedOrder) {
            try {
                const orderIds = JSON.parse(savedOrder);
                const reordered = orderIds
                    .map((id: string) => initialMenuItems.find(i => i.id === id))
                    .filter((i: any) => i !== undefined);

                const newItems = initialMenuItems.filter(i => !orderIds.includes(i.id));

                if (reordered.length > 0) {
                    setItems([...reordered, ...newItems] as typeof initialMenuItems);
                }
            } catch (e) {
                console.error('Failed to parse saved sidebar order', e);
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

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder.map(i => i.id)));
                return newOrder;
            });
        }
    }

    if (!mounted) {
        return (
            <>
                <div
                    className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={onClose}
                />
                <aside className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 bg-white dark:bg-[var(--bg-elevated)]/30 backdrop-blur-xl lg:bg-transparent lg:glass shadow-2xl lg:shadow-none`}>
                    <div className="flex flex-col h-full">
                        <div className="h-[88px] flex items-center px-6">
                            <div className="flex items-center justify-between w-full">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3 hover:opacity-100 transition-all duration-300 group px-2 py-1 rounded-xl"
                                    onClick={onClose}
                                >
                                    <div
                                        className="relative w-10 h-10 rounded-full shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.3)] border-2 group-hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(var(--brand-primary-rgb),0.6)]"
                                        style={{ borderColor: 'var(--brand-primary)' }}
                                    >
                                        <Image
                                            src="/images/TOKEN-MILAGRE-Hero.webp"
                                            alt="$MILAGRE"
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-xl font-bold drop-shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.5)] transition-all duration-300 font-[family-name:var(--font-poppins)] text-theme-primary group-hover:text-brand-primary group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.8)]">
                                        $MILAGRE
                                    </div>
                                </Link>
                                <button onClick={onClose} className="group lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-opacity-50 text-[var(--text-primary)]">
                                    <FontAwesomeIcon icon={faTimes} className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                                </button>
                            </div>
                        </div>
                        <nav className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-2">
                                {initialMenuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base text-[var(--text-primary)]"
                                    >
                                        <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    </div>
                </aside>
            </>
        )
    }

    return (
        <>
            {/* Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 z-50 transition-[transform,background-color] duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 backdrop-blur-2xl shadow-2xl lg:shadow-none`}
                style={{
                    backgroundColor: 'var(--sidebar-bg)',
                    borderRight: '1px solid var(--sidebar-border)'
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-[88px] flex items-center px-6">
                        <div className="flex items-center justify-between w-full">
                            <Link
                                href="/"
                                className="flex items-center gap-3 hover:opacity-100 transition-all duration-300 group px-2 py-1 rounded-xl"
                                onClick={onClose}
                            >
                                <div
                                    className="relative w-10 h-10 rounded-full shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.3)] border-2 group-hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(var(--brand-primary-rgb),0.6)]"
                                    style={{ borderColor: 'var(--brand-primary)' }}
                                >
                                    <Image
                                        src="/images/TOKEN-MILAGRE-Hero.webp"
                                        alt="$MILAGRE"
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-xl font-bold drop-shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.5)] transition-all duration-300 font-[family-name:var(--font-poppins)] text-theme-primary group-hover:text-brand-primary group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.8)]">
                                    $MILAGRE
                                </div>
                            </Link>
                            <button
                                onClick={onClose}
                                className="group lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-opacity-50 text-[var(--text-primary)]"
                            >
                                <FontAwesomeIcon icon={faTimes} className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar Navigation */}
                    {/* Sidebar Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto flex flex-col">
                        <div className="flex-1">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={items.map(i => i.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-2">
                                        {items.map((item) => {
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

                        {/* Reset Interface Button */}
                        <div className="pt-2 mt-2 border-t border-[var(--border-light)] dark:border-white/5">
                            <button
                                onClick={() => {
                                    if (window.confirm('Deseja resetar a organização da interface para o padrão?')) {
                                        localStorage.removeItem('zenith_home_sections_order');
                                        localStorage.removeItem('zenith_sidebar_order');
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
                </div>
            </aside>
        </>
    );
}
