'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/resources';
import ResourceHeader from './components/ResourceHeader';
import WhyGoodSection from './components/WhyGoodSection';
import ResourceFeatures from './components/ResourceFeatures';
import CompatibleWallets from './components/CompatibleWallets';
import HowToStart from './components/HowToStart';
import ProsAndCons from './components/ProsAndCons';
import ResourceFAQ from './components/ResourceFAQ';
import ResourceSecurityTips from './components/ResourceSecurityTips';
import RelatedResources from './components/RelatedResources';
import ScrollToTop from '../components/ScrollToTop';

interface ResourceDetailClientProps {
  resource: Resource;
  relatedResources: Resource[];
}

export default function ResourceDetailClient({ resource, relatedResources }: ResourceDetailClientProps) {
  const router = useRouter();

  return (
    <>
      <div className="py-8">
        <div className="flex gap-8" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
          <div className="flex-1 max-w-4xl space-y-8">
            {/* Botão Voltar */}
            <button
              onClick={() => router.push('/recursos')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 hover:scale-105"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
              aria-label="Voltar para a página de recursos"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
              Voltar para Recursos
            </button>

            {/* Header */}
            <ResourceHeader resource={resource} />

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Por que é bom */}
            <WhyGoodSection whyGood={resource.whyGood} />

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Recursos Principais */}
            <ResourceFeatures features={resource.features} />

            {/* Wallets Compatíveis - Condicional */}
            <CompatibleWallets
              resourceName={resource.name}
              showCompatibleWallets={resource.showCompatibleWallets}
            />

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Como Começar */}
            <HowToStart howToStart={resource.howToStart} />

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Prós e Contras */}
            <ProsAndCons prosAndCons={resource.prosAndCons} />

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* FAQ */}
            <ResourceFAQ faq={resource.faq} />

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Dicas de Segurança */}
            <ResourceSecurityTips securityTips={resource.securityTips} />

            {/* Recursos Relacionados */}
            <RelatedResources relatedResources={relatedResources} />
          </div>
        </div>
      </div>

      {/* Scroll to top button - Reused component */}
      <ScrollToTop />
    </>
  );
}
