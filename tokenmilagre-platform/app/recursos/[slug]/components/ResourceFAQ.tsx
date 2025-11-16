'use client';

import { useState } from 'react';
import { Resource } from '@/lib/resources';

interface ResourceFAQProps {
  faq: Resource['faq'];
}

export default function ResourceFAQ({ faq }: ResourceFAQProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
        Perguntas Frequentes
      </h2>
      <div className="space-y-3">
        {faq.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-light)'
            }}
          >
            <button
              onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              className="w-full p-5 flex items-center justify-between text-left transition-colors hover:opacity-80"
              aria-expanded={openFaqIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <h3 className="text-lg font-bold pr-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                {item.question}
              </h3>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: 'var(--text-inverse)'
                }}
                aria-hidden="true"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {openFaqIndex === index && (
              <div id={`faq-answer-${index}`} className="px-5 pb-5" role="region">
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
