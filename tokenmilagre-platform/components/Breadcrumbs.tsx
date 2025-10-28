'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const SITE_URL = 'https://tokenmilagre.xyz';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  customLabels?: Record<string, string>;
  inline?: boolean; // Remove margin-bottom quando true (uso em headers)
}

// Função helper para gerar Schema Markup (JSON-LD) para SEO
function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `${SITE_URL}${item.href}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function Breadcrumbs({ items, customLabels, inline = false }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Mapeamento de labels padrão
  const defaultLabels: Record<string, string> = {
    'noticias': 'Notícias',
    'sobre': 'Sobre',
    'token': 'Token',
    'manifesto': 'Manifesto',
    'mercado': 'Mercado',
    'criptomoedas': 'Criptomoedas',
    'graficos': 'Gráficos',
    'educacao': 'Educação',
    'recursos': 'Recursos',
    'doacoes': 'Doações',
    ...customLabels
  };

  // Se items customizados foram fornecidos, use-os
  if (items) {
    const schemaItems = [{ label: 'Início', href: '/' }, ...items];

    return (
      <>
        {generateBreadcrumbSchema(schemaItems)}
        <nav className={inline ? '' : 'mb-6'} aria-label="Breadcrumb">
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
      </>
    );
  }

  // Geração automática baseada no pathname
  const pathSegments = pathname.split('/').filter(Boolean);

  // Se estiver na home, mostrar apenas "Início" como ativo
  if (pathSegments.length === 0) {
    const homeSchema = [{ label: 'Início', href: '/' }];

    return (
      <>
        {generateBreadcrumbSchema(homeSchema)}
        <nav className={inline ? 'animate-fade-in' : 'mb-6 animate-fade-in'} aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <span
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-md text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: 'var(--text-inverse)'
                }}
                aria-current="page"
              >
                <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
                <span>Início</span>
              </span>
            </li>
          </ol>
        </nav>
      </>
    );
  }

  // Segmentos a serem ocultados (não aparecem no breadcrumb)
  const hiddenSegments = ['dashboard'];

  // Filtrar segmentos ocultos e criar breadcrumb items
  const filteredSegments = pathSegments.filter(segment => !hiddenSegments.includes(segment));

  // Tratamento especial para rotas de criptomoedas (/criptomoedas/*)
  let breadcrumbItems: BreadcrumbItem[] = [];

  if (pathSegments[0] === 'criptomoedas' && pathSegments.length > 1) {
    // Para rotas /criptomoedas/[slug], criar: Criptomoedas > [Nome da Moeda]
    const cryptoSlug = pathSegments[1];

    // Mapeamento de slugs conhecidos para nomes corretos
    const cryptoNameMap: Record<string, string> = {
      'bitcoin': 'Bitcoin',
      'ethereum': 'Ethereum',
      'tether': 'Tether',
      'xrp': 'XRP',
      'bnb': 'BNB',
      'solana': 'Solana',
      'usd-coin': 'USDC',
      'lido-staked-ether': 'Lido Staked Ether',
      'dogecoin': 'Dogecoin',
      'tron': 'TRON',
      'cardano': 'Cardano',
      'chainlink': 'Chainlink',
      'polygon': 'Polygon',
    };

    // Usar nome do mapa ou formatar slug
    const cryptoName = cryptoNameMap[cryptoSlug] || decodeURIComponent(cryptoSlug)
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbItems = [
      { label: 'Criptomoedas', href: '/criptomoedas' },
      { label: cryptoName, href: `/criptomoedas/${cryptoSlug}` }
    ];
  } else {
    // Comportamento padrão para outras rotas
    breadcrumbItems = filteredSegments.map((segment, index) => {
      // Reconstruir href mantendo a estrutura original da URL
      const originalIndex = pathSegments.indexOf(segment);
      const href = '/' + pathSegments.slice(0, originalIndex + 1).join('/');
      const label = defaultLabels[segment] || decodeURIComponent(segment);

      return { label, href };
    });
  }

  // Se não há itens após filtrar, não mostrar breadcrumb
  if (breadcrumbItems.length === 0) {
    return null;
  }

  // Incluir "Início" no schema
  const schemaItemsAuto = [{ label: 'Início', href: '/' }, ...breadcrumbItems];

  return (
    <>
      {generateBreadcrumbSchema(schemaItemsAuto)}
      <nav className={inline ? 'animate-fade-in' : 'mb-6 animate-fade-in'} aria-label="Breadcrumb">
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
    </>
  );
}
