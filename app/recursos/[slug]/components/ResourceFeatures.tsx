import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/domains/resources/legacy-api';

interface ResourceFeaturesProps {
 features: Resource['features'];
}

export default function ResourceFeatures({ features }: ResourceFeaturesProps) {
 return (
  <section className="space-y-8">
<h2 className="text-2xl title-newtab flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
    Recursos Principais
   </h2>
   <div className="grid md:grid-cols-2 gap-6">
    {features.map((feature, index) => (
     <div
      key={index}
      className="space-y-2"
     >
<h3 className="title-newtab text-lg mb-2 font-inter flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
       <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]"></span>
       {feature.title}
      </h3>
      <p className="leading-relaxed text-[var(--text-secondary)] pl-4 border-l border-[var(--border-light)]">
       {feature.description}
      </p>
     </div>
    ))}
   </div>
  </section>
 );
}
