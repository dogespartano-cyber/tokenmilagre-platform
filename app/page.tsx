'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
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

import PageWrapper from '@/components/layout/PageWrapper';
import {
  useHomeData,
  useFearGreed,
  ZenithHeroHUD,
  ZenithMarketTicker,
  QuickStartGrid,
  LatestNewsGrid,
  LearnCryptoSection,
  FeaturedResourcesSection,
  PriceChartSection,
  TopCryptosSection,
  LoadingSkeleton,
} from './components/home';

// Header config - inline para IA reconhecer
const pageHeader = {
  title: 'Sua Jornada Começa Aqui',
  description: 'Em busca de uma comunidade com prosperidade.',
  shortTitle: 'Home'
};

const initialSections = [
  'ticker',
  'hud',
  'quickstart',
  'news',
  'charts',
  'topcryptos',
  'education',
  'resources'
];

function SortableSection({ id, children }: { id: string, children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as const, // Ensure z-index works
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group/section relative touch-manipulation"
    >
      {/* Drag Handle - Notion Style */}
      <div
        ref={setActivatorNodeRef}
        className="absolute -left-10 top-0 bottom-0 w-10 flex items-center justify-center opacity-0 group-hover/section:opacity-100 cursor-grab active:cursor-grabbing transition-all z-[100] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-l-lg pointer-events-auto"
        {...attributes}
        {...listeners}
      >
        <FontAwesomeIcon icon={faGripVertical} className="h-4 w-4" />
      </div>

      <div style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
        {children}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { marketData, news, education, resources, dailyAnalysis, loading } = useHomeData();
  const { fearGreed, gaugeValue } = useFearGreed();

  const [sections, setSections] = useState(initialSections);
  const [mounted, setMounted] = useState(false);

  const STORAGE_KEY = 'zenith_home_sections_order';

  useEffect(() => {
    setMounted(true);
    const savedOrder = localStorage.getItem(STORAGE_KEY);
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder);
        // Validate and merge with initialSections to handle new/removed sections
        const validOrder = orderIds.filter((id: string) => initialSections.includes(id));
        const missingSections = initialSections.filter(id => !validOrder.includes(id));

        if (validOrder.length > 0) {
          setSections([...validOrder, ...missingSections]);
        }
      } catch (e) {
        console.error('Failed to parse saved home sections order', e);
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

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
        return newOrder;
      });
    }
  }

  const renderSection = (id: string) => {
    switch (id) {
      case 'ticker':
        return (
          <ZenithMarketTicker
            marketData={marketData}
            fearGreed={fearGreed}
            gaugeValue={gaugeValue}
          />
        );
      case 'hud':
        return (
          <ZenithHeroHUD
            marketData={marketData}
            dailyAnalysis={dailyAnalysis}
            fearGreed={fearGreed}
            gaugeValue={gaugeValue}
          />
        );
      case 'quickstart':
        return <QuickStartGrid />;
      case 'news':
        return <LatestNewsGrid news={news} />;
      case 'education':
        return <LearnCryptoSection education={education} />;
      case 'resources':
        return <FeaturedResourcesSection resources={resources} />;
      case 'charts':
        return <PriceChartSection />;
      case 'topcryptos':
        return <TopCryptosSection />;
      default:
        return null;
    }
  };

  if (!mounted) {
    // Server-side / Initial render matches default order to prevent hydration mismatch
    return (
      <PageWrapper header={pageHeader}>
        <div className="container mx-auto px-6 md:px-10 py-4 lg:py-8 relative z-10">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-16 pb-20">
              {initialSections.map(id => (
                <div key={id}>
                  {renderSection(id)}
                </div>
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper header={pageHeader}>
      <div className="container mx-auto px-6 md:px-10 py-4 lg:py-8 relative z-10">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-16 pb-20">
                {sections.map((id) => (
                  <SortableSection key={id} id={id}>
                    {renderSection(id)}
                  </SortableSection>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </PageWrapper>
  );
}
