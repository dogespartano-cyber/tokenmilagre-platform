'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  customLabels?: Record<string, string>;
}

export default function Breadcrumbs({ items, customLabels }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Mapeamento de labels padrão
  const defaultLabels: Record<string, string> = {
    'noticias': 'Notícias',
    'sobre': 'Sobre',
    'token': 'Token',
    'manifesto': 'Manifesto',
    'mercado': 'Mercado',
    ...customLabels
  };

  // Se items customizados foram fornecidos, use-os
  if (items) {
    return (
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 flex-wrap">
          {/* Home */}
          <li>
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-secondary)'
              }}
            >
              <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
              <span className="text-sm font-semibold">Início</span>
            </Link>
          </li>

          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faChevronRight}
                className="w-3 h-3"
                style={{ color: 'var(--text-muted)' }}
              />
              {index === items.length - 1 ? (
                <span
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                  style={{
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--brand-primary)',
                    color: 'var(--text-inverse)'
                  }}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Geração automática baseada no pathname
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) {
    return null; // Não mostrar breadcrumb na home
  }

  // Segmentos a serem ocultados (não aparecem no breadcrumb)
  const hiddenSegments = ['dashboard'];

  // Filtrar segmentos ocultos e criar breadcrumb items
  const filteredSegments = pathSegments.filter(segment => !hiddenSegments.includes(segment));

  const breadcrumbItems: BreadcrumbItem[] = filteredSegments.map((segment, index) => {
    // Reconstruir href mantendo a estrutura original da URL
    const originalIndex = pathSegments.indexOf(segment);
    const href = '/' + pathSegments.slice(0, originalIndex + 1).join('/');
    const label = defaultLabels[segment] || decodeURIComponent(segment);

    return { label, href };
  });

  // Se não há itens após filtrar, não mostrar breadcrumb
  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav className="mb-6 animate-fade-in" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        {/* Home */}
        <li>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:scale-105 hover:shadow-md"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
            <span className="text-sm font-semibold">Início</span>
          </Link>
        </li>

        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faChevronRight}
              className="w-3 h-3"
              style={{ color: 'var(--text-muted)' }}
            />
            {index === breadcrumbItems.length - 1 ? (
              <span
                className="px-3 py-1.5 rounded-lg text-sm font-semibold shadow-md"
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: 'var(--text-inverse)'
                }}
                aria-current="page"
              >
                {item.label.length > 30
                  ? item.label.substring(0, 30) + '...'
                  : item.label
                }
              </span>
            ) : (
              <Link
                href={item.href}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 hover:shadow-md"
                style={{
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
