import Script from 'next/script';
import { Suspense } from 'react';
import { getAllResources } from '@/lib/resources';
import RecursosClient from './RecursosClient';

// ISR: Gera estático no primeiro acesso, revalida a cada 1 hora
// Recursos verificados mudam raramente - ISR otimiza performance E quota do DB
export const revalidate = 3600;

export default async function RecursosPage() {
  const resources = await getAllResources({ verified: true });

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="recursos-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "$MILAGRE Recursos",
          "url": "https://tokenmilagre.xyz/recursos",
          "description": "Galeria de recursos oficiais verificados: wallets, exchanges, ferramentas e mais"
        })}
      </Script>

      <Suspense fallback={<div className="container mx-auto px-4 py-8">Carregando recursos...</div>}>
        <RecursosClient resources={resources} />
      </Suspense>
    </>
  );
}
