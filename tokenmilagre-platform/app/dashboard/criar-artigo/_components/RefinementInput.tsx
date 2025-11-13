/**
 * RefinementInput Component
 * Input para refinamento manual de artigos
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface RefinementInputProps {
  value: string;
  onChange: (value: string) => void;
  onRefine: () => void;
  refining: boolean;
  refineSectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function RefinementInput({
  value,
  onChange,
  onRefine,
  refining,
  refineSectionRef
}: RefinementInputProps) {
  return (
    <div
      ref={refineSectionRef}
      className="mt-6 pt-6 border-t"
      style={{ borderColor: 'var(--border-light)' }}
    >
      <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
        🎨 Refinar Artigo com IA
      </h3>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Descreva as alterações que deseja fazer no artigo:
      </p>
      <div className="flex gap-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex: Adicione mais detalhes sobre..., Mude o tom para mais técnico, Simplifique a linguagem..."
          disabled={refining}
          rows={3}
          className="flex-1 px-4 py-3 rounded-xl border focus:outline-none transition-colors resize-none"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-medium)',
            color: 'var(--text-primary)'
          }}
          aria-label="Campo para descrever alterações desejadas no artigo"
        />
        <button
          onClick={onRefine}
          disabled={!value.trim() || refining}
          className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed self-end flex items-center gap-2"
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: 'var(--text-inverse)'
          }}
          aria-label={refining ? 'Processando refinamento' : 'Enviar solicitação de refinamento'}
        >
          {refining ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin />
              Refinando...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPaperPlane} />
              Refinar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
