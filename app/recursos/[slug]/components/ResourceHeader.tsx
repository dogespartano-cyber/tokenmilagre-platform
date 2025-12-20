import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/domains/resources/legacy-api';
import { getCategoryLabel } from '@/lib/shared/utils/categories';
import VerifyButton from '@/components/shared/VerifyButton';
import CommentCountButton from '@/components/engagement/CommentCountButton';

interface ResourceHeaderProps {
  resource: Resource;
  onCommentClick?: () => void;
}

export default function ResourceHeader({ resource, onCommentClick }: ResourceHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Meta badges */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="px-3 py-1 rounded-lg text-sm font-semibold"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)'
          }}
        >
          {getCategoryLabel(resource.category)}
        </span>
      </div>

      {/* Título */}
      <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
        {resource.name}
      </h1>

      {/* Descrição */}
      <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {resource.hero.description}
      </p>

      {/* Botões de Ação */}
      <div className="flex flex-wrap items-center gap-3 pt-4">
        <a
          href={resource.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-xl"
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: 'var(--text-inverse)'
          }}
          aria-label={`Acessar site oficial de ${resource.name}`}
        >
          Acessar site oficial
          <FontAwesomeIcon icon={faExternalLinkAlt} className="w-5 h-5" />
        </a>

        {/* Verificar Button */}
        <VerifyButton id={resource.id} type="resource" />

        {/* Comentários Button */}
        <CommentCountButton id={resource.id} type="resource" onClick={onCommentClick} />
      </div>
    </div>
  );
}

