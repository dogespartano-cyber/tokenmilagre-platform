'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Section {
  id: string;
  label: string;
}

interface SectionNavProps {
  sections: Section[];
}

export default function SectionNav({ sections }: SectionNavProps) {
  const [activeSection, setActiveSection] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Detectar seção ativa
      const sectionElements = sections.map(s => document.getElementById(s.id)).filter(Boolean);

      for (const section of sectionElements) {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset para não ficar escondido atrás do header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (sections.length === 0) return null;

  return (
    <>
      {/* Navigation Menu - Desktop */}
      <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-40">
        <nav
          className="backdrop-blur-xl rounded-2xl p-4 border-2 shadow-2xl max-w-xs"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-medium)'
          }}
        >
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-semibold ${
                  activeSection === section.id
                    ? 'shadow-md scale-105'
                    : 'hover:scale-102'
                }`}
                style={{
                  backgroundColor: activeSection === section.id
                    ? 'var(--brand-primary)'
                    : 'var(--bg-secondary)',
                  color: activeSection === section.id
                    ? 'var(--text-inverse)'
                    : 'var(--text-secondary)'
                }}
              >
                {section.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Navigation Menu - Mobile */}
      <div className="lg:hidden">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed right-4 top-24 z-50 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
            color: 'var(--text-inverse)'
          }}
          aria-label="Menu de navegação"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-5 h-5" />
        </button>

        {/* Menu */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <nav
              className="fixed right-4 top-40 z-50 backdrop-blur-xl rounded-2xl p-4 border-2 shadow-2xl max-w-xs animate-fade-in"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}
            >
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-semibold ${
                      activeSection === section.id
                        ? 'shadow-md'
                        : ''
                    }`}
                    style={{
                      backgroundColor: activeSection === section.id
                        ? 'var(--brand-primary)'
                        : 'var(--bg-secondary)',
                      color: activeSection === section.id
                        ? 'var(--text-inverse)'
                        : 'var(--text-secondary)'
                    }}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </nav>
          </>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2"
          style={{
            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
            borderColor: 'var(--brand-primary)',
            color: 'var(--text-inverse)'
          }}
          aria-label="Voltar ao topo"
        >
          <FontAwesomeIcon icon={faChevronUp} className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
