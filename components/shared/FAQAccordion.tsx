'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    items: FAQItem[];
    className?: string;
}

export default function FAQAccordion({ items, className = '' }: FAQAccordionProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {items.map((item, index) => {
                const isOpen = activeIndex === index;
                return (
                    <div
                        key={index}
                        className="rounded-2xl border border-[var(--border-medium)] bg-[var(--bg-elevated)]/50 backdrop-blur-sm overflow-hidden transition-all hover:border-[var(--brand-primary)]/30"
                    >
                        <button
                            onClick={() => toggleItem(index)}
                            className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left transition-colors hover:bg-[var(--bg-elevated)]"
                            aria-expanded={isOpen}
                        >
                            <span className="font-semibold text-base md:text-lg text-[var(--text-primary)]">
                                {item.question}
                            </span>
                            <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                                <FontAwesomeIcon
                                    icon={isOpen ? faMinus : faPlus}
                                    className="text-sm transition-transform"
                                />
                            </span>
                        </button>

                        <div
                            className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                }`}
                        >
                            <div className="overflow-hidden">
                                <div className="px-5 md:px-6 pb-5 md:pb-6 text-[var(--text-secondary)] leading-relaxed">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
