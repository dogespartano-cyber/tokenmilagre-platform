'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Resource } from '@/lib/domains/resources/legacy-api';
import ResourceHeader from './components/ResourceHeader';
import WhyGoodSection from './components/WhyGoodSection';
import ResourceFeatures from './components/ResourceFeatures';
import CompatibleWallets from './components/CompatibleWallets';
import HowToStart from './components/HowToStart';
import ProsAndCons from './components/ProsAndCons';
import ResourceFAQ from './components/ResourceFAQ';
import ResourceSecurityTips from './components/ResourceSecurityTips';
import RelatedResources from './components/RelatedResources';
import { useState, useEffect } from 'react';
import TransparencyNote from '@/components/shared/TransparencyNote';
import { useSidebar } from '@/contexts/SidebarContext';
import { getAllCategories } from '@/lib/shared/utils/categories';

interface ResourceDetailClientProps {
  resource: Resource;
  relatedResources: Resource[];
}

interface TableOfContentsItem {
  id: string;
  text: string;
}

export default function ResourceDetailClient({ resource, relatedResources }: ResourceDetailClientProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = getAllCategories();
  const { setSidebarMode, resetSidebar, updateConfig } = useSidebar();

  // Configure sidebar for recursos mode
  useEffect(() => {
    setSidebarMode('recursos', {
      categories,
      selectedCategory,
      setSelectedCategory,
      searchTerm,
      setSearchTerm,
    });

    return () => resetSidebar();
  }, [setSidebarMode, resetSidebar]);

  // Update sidebar config when filters change
  useEffect(() => {
    updateConfig({
      selectedCategory,
      searchTerm,
    });
  }, [selectedCategory, searchTerm, updateConfig]);

  // Define URL atual
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Seções para o índice
  const sections: TableOfContentsItem[] = [
    { id: 'why-good', text: 'Por que é bom?' },
    { id: 'features', text: 'Recursos Principais' },
    ...(resource.showCompatibleWallets ? [{ id: 'wallets', text: 'Carteiras Compatíveis' }] : []),
    { id: 'how-to-start', text: 'Como Começar' },
    { id: 'pros-cons', text: 'Prós e Contras' },
    { id: 'faq', text: 'Perguntas Frequentes' },
    { id: 'security', text: 'Dicas de Segurança' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Rastreia seção ativa
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = sections.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(item => item.element);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i].element;
        if (element && element.getBoundingClientRect().top <= 150) {
          setActiveSection(headingElements[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Barra de progresso/Header Area */}
      <div className="relative pt-6 pb-4 md:pt-12 md:pb-8 overflow-hidden">
        {/* Background Glow Effect - Dark Mode Only */}
        <div className="absolute top-0 left-0 w-full max-w-4xl h-full opacity-30 pointer-events-none hidden dark:block"
          style={{
            background: `radial-gradient(circle at 20% 30%, var(--brand-primary) 20%, transparent 70%)`,
            opacity: 0.15,
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%)',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%)'
          }}
        />

        <div className="container mx-auto px-6 md:px-10 relative z-10">
          <div className="max-w-6xl">
            <ResourceHeader resource={resource} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-2 pb-8 lg:pt-4 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Coluna Principal (Conteúdo) */}
          <div className="lg:col-span-8 space-y-12">

            <div className="overflow-hidden">
              <div className="py-4 space-y-16">

                {/* Por que é bom */}
                <div id="why-good" className="scroll-mt-32">
                  <WhyGoodSection whyGood={resource.whyGood} />
                </div>

                {/* Recursos Principais */}
                <div id="features" className="scroll-mt-32">
                  <ResourceFeatures features={resource.features} />
                </div>

                {/* Wallets Compatíveis */}
                {resource.showCompatibleWallets && (
                  <div id="wallets" className="scroll-mt-32">
                    <CompatibleWallets
                      resourceName={resource.name}
                      showCompatibleWallets={resource.showCompatibleWallets}
                    />
                  </div>
                )}

                {/* Como Começar */}
                <div id="how-to-start" className="scroll-mt-32">
                  <HowToStart howToStart={resource.howToStart} />
                </div>

                {/* Prós e Contras */}
                <div id="pros-cons" className="scroll-mt-32">
                  <ProsAndCons prosAndCons={resource.prosAndCons} />
                </div>

                {/* FAQ */}
                <div id="faq" className="scroll-mt-32">
                  <ResourceFAQ faq={resource.faq} />
                </div>

                {/* Dicas de Segurança */}
                <div id="security" className="scroll-mt-32">
                  <ResourceSecurityTips securityTips={resource.securityTips} />
                </div>

                {/* Compartilhar (Mobile) */}
                <div className="lg:hidden space-y-4 pt-8 border-t border-[var(--border-article)]">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--text-article-title)]">
                    <FontAwesomeIcon icon={faShareNodes} />
                    Compartilhe este recurso
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(resource.name)}&url=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all bg-black/5 hover:bg-black/10 border border-black/10 text-black dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-white shadow-sm"
                    >
                      <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
                      X
                    </a>
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(resource.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/20 text-[#0088cc] shadow-sm"
                    >
                      <FontAwesomeIcon icon={faTelegram} className="w-4 h-4" />
                      Telegram
                    </a>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(resource.name + ' ' + currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#25D366] shadow-sm"
                    >
                      <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Nota de Transparência */}
            <div className="pt-8 border-t border-[var(--border-article)]">
              <TransparencyNote publishedAt={resource.updatedAt} />
            </div>

            {/* Recursos Relacionados */}
            <div className="pt-8 border-t border-[var(--border-article)]">
              <RelatedResources relatedResources={relatedResources} />
            </div>

          </div>

          {/* Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-6">

              {/* Botão Voltar */}
              <button
                onClick={() => router.push('/recursos')}
                className="flex items-center gap-2 text-[var(--text-article-muted)] hover:text-[var(--brand-primary)] transition-colors font-medium mb-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--bg-article-tag)] flex items-center justify-center group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-all">
                  <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                </div>
                Voltar para Recursos
              </button>

              {/* Índice */}
              <div className="glass-card p-6 rounded-2xl border border-[var(--border-article)]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-article-muted)] mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-[var(--brand-primary)] rounded-full"></span>
                  Neste Recurso
                </h3>
                <nav className="space-y-1 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--bg-article-tag)] ml-0.5" />
                  {sections.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection(item.id)}
                      className={`relative block text-sm text-left transition-all py-2 pl-4 w-full border-l-2 -ml-[1px] ${activeSection === item.id
                        ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] font-bold bg-[var(--brand-primary)]/5'
                        : 'border-transparent text-[var(--text-article-muted)] hover:text-[var(--text-article-title)] hover:border-[var(--border-article)]'
                        }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Compartilhar Sidebar */}
              <div className="glass-card p-6 rounded-2xl border border-[var(--border-article)]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-article-muted)] mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faShareNodes} />
                  Compartilhar
                </h3>
                <div className="flex flex-col gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(resource.name)}&url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:bg-[var(--bg-article-tag)] text-[var(--text-article-body)] hover:text-[var(--brand-primary)]"
                  >
                    <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
                    <span className="font-medium">X (Twitter)</span>
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(resource.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:bg-[var(--bg-article-tag)] text-[var(--text-article-body)] hover:text-[#0088cc]"
                  >
                    <FontAwesomeIcon icon={faTelegram} className="w-4 h-4" />
                    <span className="font-medium">Telegram</span>
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(resource.name + ' ' + currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:bg-[var(--bg-article-tag)] text-[var(--text-article-body)] hover:text-[#25D366]"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                    <span className="font-medium">WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
