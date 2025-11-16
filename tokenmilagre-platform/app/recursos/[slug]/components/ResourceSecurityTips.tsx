import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/resources';

interface ResourceSecurityTipsProps {
  securityTips: Resource['securityTips'];
}

export default function ResourceSecurityTips({ securityTips }: ResourceSecurityTipsProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
        Dicas de Segurança
      </h2>
      <div className="space-y-3">
        {securityTips.map((tip, index) => (
          <div
            key={index}
            className="p-5 rounded-xl"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <h3 className="font-bold mb-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: 'var(--text-inverse)'
                }}
                aria-hidden="true"
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5" />
              </div>
              {tip.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
