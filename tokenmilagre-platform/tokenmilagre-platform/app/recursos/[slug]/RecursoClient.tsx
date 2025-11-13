'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { SourcesSection } from '@/lib/citations-processor';

interface Resource {
  id: string;
  slug: string;
  name: string;
  category: string;
  verified: boolean;
  shortDescription: string;
  officialUrl: string;
  platforms: string[];
  tags: string[];
  citations?: string[];
}

interface RecursoClientProps {
  resource: Resource | null;
  relatedResources?: Resource[];
}

export default function RecursoClient({ resource, relatedResources = [] }: RecursoClientProps) {
  const router = useRouter();

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      wallets: 'Carteiras',
      exchanges: 'Exchanges',
      browsers: 'Navegadores',
      defi: 'DeFi',
      explorers: 'Exploradores',
      tools: 'Ferramentas'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      wallets: '#8B5CF6',
      exchanges: '#3B82F6',
      browsers: '#F59E0B',
      defi: '#10B981',
      explorers: '#EC4899',
      tools: '#6B7280'
    };
    return colors[category] || '#6B7280';
  };

  const shareOnX = () => {
    const url = window.location.href;
    const text = `${resource?.name} via @TokenMilagre`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `${resource?.name} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnTelegram = () => {
    const url = window.location.href;
    const text = resource?.name || '';
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!resource) {
    return (
      <div className="py-8 max-w-4xl" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
        <div className="space-y-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔧</div>
            <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Recurso não encontrado
            </h1>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
              O recurso que você procura não existe ou foi removido.
            </p>
            <button
              onClick={() => router.push('/recursos')}
              className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--text-inverse)'
              }}
            >
              ← Voltar para Recursos
            </button>
          </div>
        </div>
      </div>
    );
  }

  const citations = resource.citations || [];

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto space-y-8" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
        {/* Voltar */}
        <button
          onClick={() => router.push('/recursos')}
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
          style={{ color: 'var(--brand-primary)' }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          Voltar para Recursos
        </button>

        {/* Header do Recurso */}
        <div className="space-y-6">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="px-3 py-1 rounded-lg text-sm font-semibold"
              style={{
                backgroundColor: getCategoryColor(resource.category),
                color: 'white'
              }}
            >
              {getCategoryLabel(resource.category)}
            </span>
            {resource.verified && (
              <span
                className="px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1"
                style={{
                  backgroundColor: '#10B981',
                  color: 'white'
                }}
              >
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                Oficial
              </span>
            )}
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
            {resource.name}
          </h1>

          {/* Descrição */}
          <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {resource.shortDescription}
          </p>

          {/* Plataformas */}
          <div className="flex flex-wrap gap-2">
            {resource.platforms.map((platform, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}
              >
                {platform}
              </span>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {resource.tags.slice(0, 5).map((tag, idx) => (
              <button
                key={idx}
                onClick={() => router.push(`/recursos?search=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-lg text-sm transition-all hover:opacity-80 cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-tertiary)'
                }}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* CTA - Visitar */}
          <div>
            <a
              href={resource.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--text-inverse)'
              }}
            >
              Visitar {resource.name}
              <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

        {/* Seção de Fontes */}
        <SourcesSection citations={citations} />

        {/* Divider */}
        <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

        {/* Nota de Segurança */}
        <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔒</div>
            <div className="flex-1 space-y-2">
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                Dica de Segurança
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Sempre verifique a URL oficial antes de acessar. Nunca compartilhe suas chaves privadas ou frases de recuperação com ninguém. Use autenticação de dois fatores quando disponível.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

        {/* Compartilhar */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
            Compartilhe este recurso
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={shareOnX}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
              style={{ backgroundColor: '#000000', color: 'white' }}
            >
              <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
              X (Twitter)
            </button>
            <button
              onClick={shareOnTelegram}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
              style={{ backgroundColor: '#0088cc', color: 'white' }}
            >
              <FontAwesomeIcon icon={faTelegram} className="w-5 h-5" />
              Telegram
            </button>
            <button
              onClick={shareOnWhatsApp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
              WhatsApp
            </button>
          </div>
        </div>

        {/* Recursos Relacionados */}
        {relatedResources.length > 0 && (
          <>
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Recursos Relacionados
              </h3>
              <div className="grid gap-4">
                {relatedResources.slice(0, 3).map((related) => (
                  <Link
                    key={related.id}
                    href={`/recursos/${related.slug}`}
                    className="block p-6 rounded-xl border transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-light)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: getCategoryColor(related.category),
                          color: 'white'
                        }}
                      >
                        {getCategoryLabel(related.category)}
                      </span>
                      {related.verified && (
                        <span className="text-xs" style={{ color: '#10B981' }}>
                          <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {related.name}
                    </h4>
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {related.shortDescription}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
