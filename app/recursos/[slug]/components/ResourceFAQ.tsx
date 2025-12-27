'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Resource } from '@/lib/domains/resources/legacy-api';

interface ResourceFAQProps {
 faq: Resource['faq'];
}

export default function ResourceFAQ({ faq }: ResourceFAQProps) {
 const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

 return (
  <section className="space-y-8">
<h2 className="text-2xl title-newtab flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
    Perguntas Frequentes
   </h2>
   <div className="space-y-4">
    {faq.map((item, index) => (
     <div
      key={index}
      className="border-b transition-all"
      style={{
       borderColor: 'var(--border-light)'
      }}
     >
      <button
       onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
       className="w-full py-4 flex items-center justify-between text-left transition-colors hover:text-[var(--brand-primary)]"
       aria-expanded={openFaqIndex === index}
       aria-controls={`faq-answer-${index}`}
      >
<h3 className="title-newtab text-lg pr-6 font-inter" style={{ color: openFaqIndex === index ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
        {item.question}
       </h3>
       <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openFaqIndex === index ? 'rotate-180 text-[var(--brand-primary)]' : 'text-[var(--text-secondary)]'}`}
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
      <div
       id={`faq-answer-${index}`}
       className={`grid transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
       role="region"
      >
       <div className="overflow-hidden">
        <div className="pb-6 pt-0">
         <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
          {item.answer}
         </p>
        </div>
       </div>
      </div>
     </div>
    ))}
   </div>
  </section>
 );
}
