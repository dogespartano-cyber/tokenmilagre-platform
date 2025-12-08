import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/domains/resources/legacy-api';

interface ResourceSecurityTipsProps {
  securityTips: Resource['securityTips'];
}

export default function ResourceSecurityTips({ securityTips }: ResourceSecurityTipsProps) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
        Dicas de Segurança
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {securityTips.map((tip, index) => (
          <div
            key={index}
            className="space-y-2"
          >
            <h3 className="text-lg font-bold mb-2 flex items-center gap-3 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981'
                }}
                aria-hidden="true"
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5" />
              </div>
              {tip.title}
            </h3>
            <p className="leading-relaxed pl-[44px]" style={{ color: 'var(--text-secondary)' }}>
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
