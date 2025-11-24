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


interface ResourceDetailClientProps {
  resource: Resource;
  relatedResources: Resource[];
}

export default function ResourceDetailClient({ resource, relatedResources }: ResourceDetailClientProps) {
  const router = useRouter();

  return (
    <>
      <div className="py-12 animate-in fade-in duration-500">
        <div className="flex gap-8 px-4 md:px-8 lg:pl-[55px]">
          <div className="flex-1 max-w-5xl space-y-16">
            {/* Header */}
            <ResourceHeader resource={resource} />

            {/* Por que é bom */}
            <WhyGoodSection whyGood={resource.whyGood} />

            {/* Recursos Principais */}
            <ResourceFeatures features={resource.features} />

            {/* Wallets Compatíveis - Condicional */}
            <CompatibleWallets
              resourceName={resource.name}
              showCompatibleWallets={resource.showCompatibleWallets}
            />

            {/* Como Começar */}
            <HowToStart howToStart={resource.howToStart} />

            {/* Prós e Contras */}
            <ProsAndCons prosAndCons={resource.prosAndCons} />

            {/* FAQ */}
            <ResourceFAQ faq={resource.faq} />

            {/* Dicas de Segurança */}
            <ResourceSecurityTips securityTips={resource.securityTips} />

            {/* Recursos Relacionados */}
            <RelatedResources relatedResources={relatedResources} />
          </div>
        </div>
      </div>


    </>
  );
}
