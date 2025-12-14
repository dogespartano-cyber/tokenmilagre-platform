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
    faRotateRight,
    faArrowLeft,
    faSearch,
    faFilter,
    faBook,
    faFile,
    faQuestion,
    faShield,
    faHeart,
    faGlobe,
    faFire
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
import { useEducationFiltersOptional, categories, levels } from '@/contexts/EducationFilterContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { GUIA_ESSENCIAL_TRILHA, isGuiaEssencialSlug } from '@/lib/education/guia-essencial';
import { CheckCircle2, ChevronRight, ChevronDown, X, PlayCircle, Clock } from 'lucide-react';

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
        <div ref={setNodeRef} style={style} className="relative group/item">
            {/* Drag Handle - only this listens to drag events */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-0 top-0 bottom-0 w-8 cursor-grab active:cursor-grabbing z-20 opacity-0 group-hover/item:opacity-50 transition-opacity flex items-center justify-center"
            >
                <div className="w-1 h-6 bg-[var(--text-tertiary)]/30 rounded-full" />
            </div>

            {/* Link - handles navigation */}
            <Link
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 relative overflow-hidden select-none ${isActive
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
    const { mode, config, updateConfig } = useSidebar();
    const pathname = usePathname();
    const { theme } = useTheme();

    // Default mode states
    const [menuItems, setMenuItems] = useState(initialMenuItems);
    const [mounted, setMounted] = useState(false);

    // Filter Logic States
    const isEducacaoPage = pathname === '/educacao';
    const educationFilters = useEducationFiltersOptional();

    // Legacy Trilha detection (fallback or parallel use)
    const currentSlug = pathname?.startsWith('/educacao/')
        ? pathname.replace('/educacao/', '').split('/')[0]
        : null;
    const isTrilhaModeFallback = currentSlug ? isGuiaEssencialSlug(currentSlug) : false;
    const currentTrilhaIndex = isTrilhaModeFallback
        ? GUIA_ESSENCIAL_TRILHA.findIndex(t => t.slug === currentSlug)
        : -1;

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

    // Initial load from localStorage
    useEffect(() => {
        setMounted(true);
        const savedOrder = localStorage.getItem('sidebarOrder');
        if (savedOrder) {
            try {
                const orderIds = JSON.parse(savedOrder);
                const reorderedItems = orderIds
                    .map((id: string) => initialMenuItems.find(item => item.id === id))
                    .filter(Boolean) as typeof initialMenuItems;

                // Add any new items that weren't in saved order
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

    if (!mounted) return null;

    // --- Render Logic ---

    // 1. Render Trilha/Course Mode (Context Driven)
    if (mode === 'trilha' && config) {
        return (
            <>
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onClose}
                    />
                )}

                <aside className={`
                    fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ease-in-out 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 
                    bg-white dark:bg-[var(--bg-elevated)]/30 backdrop-blur-xl lg:bg-transparent lg:glass shadow-2xl lg:shadow-none
                `}>
                    <div className="flex flex-col h-full bg-[var(--bg-card)] lg:bg-transparent">
                        {/* Header with Logo */}
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

                        {/* Trilha Info Section */}
                        <div className="px-6 py-4 border-b border-[var(--border-light)]/50">
                            <div className="mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)] block mb-1">
                                    {config.title || 'Trilha de Aprendizado'}
                                </span>
                                <h2 className="text-xl font-bold leading-tight text-[var(--text-primary)]">
                                    {config.subtitle || 'Fundamentos'}
                                </h2>
                            </div>

                            {/* Progress Bar */}
                            {config.progress !== undefined && (
                                <div className="w-full bg-[var(--bg-tertiary)] h-2 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--brand-primary)] transition-all duration-500 ease-out"
                                        style={{ width: `${config.progress}%` }}
                                    />
                                </div>
                            )}
                            <div className="flex justify-between mt-2 text-xs text-[var(--text-tertiary)]">
                                <span>{config.progress}% Concluído</span>
                                <span>{Math.round((config.progress || 0) / 100 * (config.steps?.length || 0))}/{config.steps?.length || 0} Aulas</span>
                            </div>
                        </div>

                        {/* Content List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                            <Link
                                href="/educacao"
                                className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] mb-6 px-2 transition-colors"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
                                Voltar para Educação
                            </Link>

                            {config.steps?.map((step: any, index: number) => {
                                const isCompleted = config.currentSlug !== step.slug && index < config.steps.findIndex((s: any) => s.slug === config.currentSlug);
                                const isCurrent = config.currentSlug === step.slug;

                                return (
                                    <Link
                                        key={step.slug}
                                        href={`/educacao/${step.slug}`}
                                        onClick={() => onClose()}
                                        className={`
                                            group flex items-start gap-3 p-3 rounded-xl transition-all border
                                            ${isCurrent
                                                ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]/30'
                                                : 'bg-transparent border-transparent hover:bg-[var(--bg-secondary)]'
                                            }
                                        `}
                                    >
                                        <div className="mt-0.5 min-w-[20px]">
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            ) : isCurrent ? (
                                                <PlayCircle className="w-5 h-5 text-[var(--brand-primary)] animate-pulse" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border-2 border-[var(--text-tertiary)] text-[var(--text-tertiary)] flex items-center justify-center text-[10px] font-bold">
                                                    {index + 1}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-sm font-medium leading-snug mb-1 ${isCurrent ? 'text-[var(--brand-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                                                {step.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-[10px] text-[var(--text-tertiary)]">
                                                <Clock className="w-3 h-3" />
                                                {step.duration || '5 min'}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </aside>
            </>
        );
    }

    // 2. Educacao Mode (Page Sections TOC + Filters Toggle)
    if (mode === 'educacao' && config) {
        const { showFilters, sections } = config;

        const sectionIcons: Record<string, any> = {
            book: faBook,
            graduation: faGraduationCap,
            file: faFile,
            question: faQuestion,
            shield: faShield,
            heart: faHeart,
        };

        const toggleFilters = () => {
            // Use updateConfig from sidebar context to toggle showFilters
            updateConfig({ showFilters: !showFilters });
        };

        return (
            <>
                {/* Sidebar Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={onClose}
                />

                {/* Sidebar */}
                <aside
                    className={`fixed top-0 left-0 h-full w-72 z-50 transition-[transform,background-color] duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 backdrop-blur-2xl shadow-2xl lg:shadow-none`}
                    style={{
                        backgroundColor: 'var(--sidebar-bg)',
                        borderRight: '1px solid var(--sidebar-border)'
                    }}
                >
                    <div className="flex flex-col h-full">
                        {/* Sidebar Header - Same as default mode */}
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
                                            className="w-full h-full object-cover rounded-full"
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
                        <nav className="flex-1 p-4 overflow-y-auto flex flex-col no-scrollbar">
                            {/* Back button - only visible when in filters mode */}
                            {showFilters && (
                                <button
                                    onClick={toggleFilters}
                                    className="flex items-center gap-2 px-4 py-2 mb-3 text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] transition-all"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                                    <span className="text-sm font-medium">Voltar às Seções</span>
                                </button>
                            )}

                            {showFilters ? (
                                /* Filters View */
                                <div className="space-y-5">
                                    {/* Search */}
                                    {educationFilters && (
                                        <>
                                            <div className="relative">
                                                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                                                <input
                                                    type="text"
                                                    placeholder="Buscar artigos..."
                                                    value={educationFilters.searchTerm}
                                                    onChange={(e) => educationFilters.setSearchTerm(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50"
                                                />
                                            </div>

                                            {/* Category Filter */}
                                            <div>
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-3">Categoria</h3>
                                                <div className="space-y-1">
                                                    {categories.map((cat) => (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => educationFilters.setSelectedCategory(educationFilters.selectedCategory === cat.id ? '' : cat.id)}
                                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${educationFilters.selectedCategory === cat.id
                                                                ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                                                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                                                }`}
                                                        >
                                                            {cat.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Level Filter */}
                                            <div>
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-3">Nível</h3>
                                                <div className="space-y-1">
                                                    {levels.map((level) => (
                                                        <button
                                                            key={level.id}
                                                            onClick={() => educationFilters.setSelectedLevel(educationFilters.selectedLevel === level.id ? '' : level.id)}
                                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${educationFilters.selectedLevel === level.id
                                                                ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                                                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                                                }`}
                                                        >
                                                            {level.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Clear Filters */}
                                            {educationFilters.getActiveFiltersCount() > 0 && (
                                                <button
                                                    onClick={educationFilters.clearAllFilters}
                                                    className="w-full py-2 text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] transition-colors"
                                                >
                                                    Limpar filtros ({educationFilters.getActiveFiltersCount()})
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            ) : (
                                /* Sections TOC View */
                                <div className="space-y-1">
                                    {/* Voltar ao Início */}
                                    <Link
                                        href="/"
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group mb-2"
                                    >
                                        <FontAwesomeIcon
                                            icon={faArrowLeft}
                                            className="w-5 h-5 text-white/70 group-hover:text-[var(--brand-primary)] transition-colors"
                                        />
                                        <span className="font-semibold text-base">Voltar ao Início</span>
                                    </Link>

                                    {sections?.map((section: any) => (
                                        <div key={section.id}>
                                            {section.id === 'artigos' ? (
                                                /* Artigos item with expandable submenu */
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            // Toggle submenu visibility
                                                            updateConfig({ artigosExpanded: !config.artigosExpanded });
                                                            // Scroll to artigos section
                                                            const artigosElement = document.getElementById('artigos');
                                                            if (artigosElement) {
                                                                artigosElement.scrollIntoView({ behavior: 'smooth' });
                                                            }
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={sectionIcons[section.icon] || faFile}
                                                            className="w-5 h-5 text-white/70 group-hover:text-[var(--brand-primary)] transition-colors"
                                                        />
                                                        <span className="font-semibold text-base flex-1 text-left">{section.title}</span>
                                                        <ChevronDown
                                                            className={`w-4 h-4 text-white/50 transition-transform duration-300 ${config.artigosExpanded ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>
                                                    {/* Submenu with animation */}
                                                    <div
                                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${config.artigosExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                                                            }`}
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                const artigosElement = document.getElementById('artigos');
                                                                if (artigosElement) {
                                                                    artigosElement.scrollIntoView({ behavior: 'smooth' });
                                                                }
                                                                toggleFilters();
                                                            }}
                                                            className="w-full flex items-center gap-3 pl-12 pr-4 py-2.5 text-white/60 hover:text-[var(--brand-primary)] transition-all text-left"
                                                        >
                                                            <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Filtrar Artigos</span>
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                /* Regular section link */
                                                <a
                                                    href={`#${section.id}`}
                                                    onClick={onClose}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={sectionIcons[section.icon] || faFile}
                                                        className="w-5 h-5 text-white/70 group-hover:text-[var(--brand-primary)] transition-colors"
                                                    />
                                                    <span className="font-semibold text-base">{section.title}</span>
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </nav>
                    </div>
                </aside>
            </>
        );
    }

    // 3. Graficos Mode (Page Sections TOC)
    if (mode === 'graficos' && config) {
        const { sections } = config;

        const sectionIcons: Record<string, any> = {
            chart: faChartLine,
            globe: faGlobe,
            fire: faFire,
            bubble: faChartLine,
            heart: faHeart,
        };

        return (
            <>
                {/* Sidebar Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={onClose}
                />

                {/* Sidebar */}
                <aside
                    className={`fixed top-0 left-0 h-full w-72 z-50 transition-[transform,background-color] duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 backdrop-blur-2xl shadow-2xl lg:shadow-none`}
                    style={{
                        backgroundColor: 'var(--sidebar-bg)',
                        borderRight: '1px solid var(--sidebar-border)'
                    }}
                >
                    <div className="flex flex-col h-full">
                        {/* Sidebar Header - Same as default mode */}
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
                                            className="w-full h-full object-cover rounded-full"
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
                        <nav className="flex-1 p-4 overflow-y-auto flex flex-col no-scrollbar">
                            {/* Voltar ao Início */}
                            <Link
                                href="/"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group mb-2"
                            >
                                <FontAwesomeIcon
                                    icon={faArrowLeft}
                                    className="w-5 h-5 text-white/70 group-hover:text-[var(--brand-primary)] transition-colors"
                                />
                                <span className="font-semibold text-base">Voltar ao Início</span>
                            </Link>

                            {/* Sections TOC */}
                            <div className="space-y-1">
                                {sections?.map((section: any) => (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group"
                                    >
                                        <FontAwesomeIcon
                                            icon={sectionIcons[section.icon] || faChartLine}
                                            className="w-5 h-5 text-white/70 group-hover:text-[var(--brand-primary)] transition-colors"
                                        />
                                        <span className="font-semibold text-base">{section.title}</span>
                                    </a>
                                ))}
                            </div>
                        </nav>
                    </div>
                </aside>
            </>
        );
    }

    // 4. Recursos Mode (Category Filters as Navigation)
    if (mode === 'recursos' && config) {
        const { categories, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm } = config;

        const categoryIcons: Record<string, any> = {
            all: faStore,
            wallet: faCoins,
            exchange: faBitcoinSign,
            'defi-protocol': faChartLine,
            explorers: faSearch,
            browsers: faGlobe,
            analytics: faChartLine,
            'portfolio-tracker': faCoins,
            'development-tools': faInfoCircle,
            news: faNewspaper,
            education: faGraduationCap,
        };

        return (
            <>
                {/* Sidebar Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={onClose}
                />

                {/* Sidebar */}
                <aside
                    className={`fixed top-0 left-0 h-full w-72 z-50 transition-[transform,background-color] duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 backdrop-blur-2xl shadow-2xl lg:shadow-none`}
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
                                            className="w-full h-full object-cover rounded-full"
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
                        <nav className="flex-1 p-4 overflow-y-auto flex flex-col no-scrollbar">
                            {/* Voltar ao Início */}
                            <Link
                                href="/"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group mb-4"
                            >
                                <FontAwesomeIcon
                                    icon={faArrowLeft}
                                    className="w-5 h-5 text-white/70 group-hover:text-[var(--brand-primary)] transition-colors"
                                />
                                <span className="font-semibold text-base">Voltar ao Início</span>
                            </Link>

                            {/* Search */}
                            <div className="relative mb-4">
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                                <input
                                    type="text"
                                    placeholder="Buscar recursos..."
                                    value={searchTerm || ''}
                                    onChange={(e) => setSelectedCategory && setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50"
                                />
                            </div>

                            {/* Categories Title */}
                            <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3 px-2">
                                Categorias
                            </h3>

                            {/* Category Filters */}
                            <div className="space-y-1">
                                {categories?.filter((cat: any) => !['news', 'education'].includes(cat.id)).map((cat: any) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            if (setSelectedCategory) {
                                                setSelectedCategory(cat.id);
                                                onClose();
                                            }
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${selectedCategory === cat.id
                                            ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)]'
                                            : 'text-white hover:bg-[var(--bg-secondary)] hover:translate-x-1'
                                            }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={categoryIcons[cat.id] || faStore}
                                            className={`w-5 h-5 transition-colors ${selectedCategory === cat.id
                                                ? 'text-[var(--brand-primary)]'
                                                : 'text-white/70 group-hover:text-[var(--brand-primary)]'
                                                }`}
                                        />
                                        <span className="font-semibold text-base">{cat.label}</span>
                                    </button>
                                ))}

                                {/* Limpar Filtros */}
                                {(selectedCategory !== 'all' || searchTerm) && (
                                    <button
                                        onClick={() => {
                                            if (setSelectedCategory) setSelectedCategory('all');
                                            if (setSearchTerm) setSearchTerm('');
                                            onClose();
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 mt-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group border-t border-white/10 pt-4"
                                    >
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            className="w-5 h-5"
                                        />
                                        <span className="font-semibold text-base">Limpar Filtros</span>
                                    </button>
                                )}
                            </div>
                        </nav>
                    </div>
                </aside>
            </>
        );
    }

    // 5. Recurso Detalhe Mode (Related Resources from Same Category)
    if (mode === 'recurso-detalhe' && config) {
        const { currentResource, relatedResources, categoryLabel } = config;

        return (
            <>
                {/* Sidebar Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={onClose}
                />

                {/* Sidebar */}
                <aside
                    className={`fixed top-0 left-0 h-full w-72 z-50 transition-[transform,background-color] duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 backdrop-blur-2xl shadow-2xl lg:shadow-none`}
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
                                            className="w-full h-full object-cover rounded-full"
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
                        <nav className="flex-1 p-4 overflow-y-auto flex flex-col no-scrollbar">
                            {/* Voltar a Recursos */}
                            <Link
                                href="/recursos"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[var(--bg-secondary)] hover:translate-x-1 transition-all group mb-4"
                            >
                                <FontAwesomeIcon
                                    icon={faArrowLeft}
                                    className="w-5 h-5 text-white/70 group-hover:text-[var(--brand-primary)] transition-colors"
                                />
                                <span className="font-semibold text-base">Voltar a Recursos</span>
                            </Link>

                            {/* Category Title */}
                            <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3 px-2">
                                Mais {categoryLabel || 'Recursos'}
                            </h3>

                            {/* Related Resources Links */}
                            <div className="space-y-1">
                                {relatedResources?.slice(0, 8).map((res: any) => (
                                    <Link
                                        key={res.slug}
                                        href={`/recursos/${res.slug}`}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${currentResource?.slug === res.slug
                                                ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)]'
                                                : 'text-white hover:bg-[var(--bg-secondary)] hover:translate-x-1'
                                            }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faStore}
                                            className={`w-4 h-4 transition-colors ${currentResource?.slug === res.slug
                                                    ? 'text-[var(--brand-primary)]'
                                                    : 'text-white/70 group-hover:text-[var(--brand-primary)]'
                                                }`}
                                        />
                                        <span className="font-medium text-sm truncate">{res.name}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Ver Todos Link */}
                            <Link
                                href={`/recursos?category=${currentResource?.category || ''}`}
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 mt-4 rounded-xl text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10 transition-all group border-t border-white/10 pt-4"
                            >
                                <span className="font-semibold text-sm">Ver todos os {categoryLabel || 'recursos'} →</span>
                            </Link>
                        </nav>
                    </div>
                </aside>
            </>
        );
    }

    // 6. Default Mode (Standard Menu & Education Filters)
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
                    <nav className="flex-1 p-4 overflow-y-auto flex flex-col">
                        {isEducacaoPage && educationFilters ? (
                            /* Modo Educacao: Filtros de Busca */
                            <>
                                {/* Botão Voltar ao Menu - Consistente com modo Trilha */}
                                <Link
                                    href="/"
                                    onClick={onClose}
                                    className="group flex items-center gap-3 px-4 py-3 mb-4 rounded-xl font-semibold text-sm text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-secondary)] transition-all duration-300 border border-[var(--border-light)]"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                                    <span>Voltar ao Menu</span>
                                </Link>

                                {/* Busca */}
                                <div className="mb-5">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Título, tag..."
                                            value={educationFilters.searchTerm}
                                            onChange={(e) => educationFilters.setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all placeholder-[var(--text-tertiary)]"
                                        />
                                        <FontAwesomeIcon
                                            icon={faSearch}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] w-4 h-4"
                                        />
                                        {educationFilters.searchTerm && (
                                            <button
                                                onClick={() => educationFilters.setSearchTerm('')}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Níveis */}
                                <div className="mb-5">
                                    <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">Nível</label>
                                    <div className="space-y-1">
                                        {levels.map((level) => (
                                            <button
                                                key={level.id}
                                                onClick={() => educationFilters.setSelectedLevel(level.id)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${educationFilters.selectedLevel === level.id
                                                    ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                                                    }`}
                                            >
                                                {level.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Categorias */}
                                <div className="mb-5">
                                    <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">Categoria</label>
                                    <div className="space-y-1">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => educationFilters.setSelectedCategory(cat.id)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${educationFilters.selectedCategory === cat.id
                                                    ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                                                    }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Limpar Filtros */}
                                {educationFilters.getActiveFiltersCount() > 0 && (
                                    <button
                                        onClick={educationFilters.clearAllFilters}
                                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2 justify-center border border-red-500/20"
                                    >
                                        <X className="w-3 h-3" />
                                        Limpar Filtros ({educationFilters.getActiveFiltersCount()})
                                    </button>
                                )}

                                {/* Spacer */}
                                <div className="flex-1" />
                            </>
                        ) : isTrilhaModeFallback ? (
                            /* Modo Trilha Legacy Fallback (para rotas não migradas) */
                            <>
                                {/* Botão Voltar ao Menu */}
                                <Link
                                    href="/educacao"
                                    onClick={onClose}
                                    className="group flex items-center gap-3 px-4 py-3 mb-4 rounded-xl font-semibold text-sm text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-secondary)] transition-all duration-300 border border-[var(--border-light)]"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                                    <span>Voltar ao Menu</span>
                                </Link>

                                {/* Lista de Artigos da Trilha */}
                                <div className="flex-1 space-y-1">
                                    {GUIA_ESSENCIAL_TRILHA.map((item, index) => {
                                        const Icon = item.icon;
                                        const isCurrent = item.slug === currentSlug;
                                        const isPast = index < currentTrilhaIndex;

                                        return (
                                            <Link
                                                key={item.slug}
                                                href={`/educacao/${item.slug}`}
                                                onClick={onClose}
                                                className={`
                                                    group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300
                                                    ${isCurrent
                                                        ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-semibold'
                                                        : isPast
                                                            ? 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                                            : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-secondary)]'
                                                    }
                                                `}
                                            >
                                                <Icon className="w-4 h-4 shrink-0" />
                                                <span className="truncate flex-1">{item.title}</span>
                                                {isPast && (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                                )}
                                                {isCurrent && (
                                                    <ChevronRight className="w-4 h-4 shrink-0" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Progresso Visual */}
                                <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
                                    <div className="px-4">
                                        <div className="flex justify-between text-xs text-[var(--text-tertiary)] mb-2">
                                            <span>Progresso</span>
                                            <span>{Math.round(((currentTrilhaIndex + 1) / GUIA_ESSENCIAL_TRILHA.length) * 100)}%</span>
                                        </div>
                                        <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--brand-primary)] rounded-full transition-all duration-500"
                                                style={{ width: `${((currentTrilhaIndex + 1) / GUIA_ESSENCIAL_TRILHA.length) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Modo Normal: Menu padrão com DnD */
                            <>
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
                                            <div className="space-y-2">
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
                            </>
                        )}
                    </nav>
                </div>
            </aside>
        </>
    );
}
