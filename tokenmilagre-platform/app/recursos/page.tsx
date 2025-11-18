import Script from 'next/script';
import { getAllResources } from '@/lib/resources';
import RecursosClient from './RecursosClient';

// Dynamic rendering - fetch data at request time
export const dynamic = 'force-dynamic';

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

      <RecursosClient resources={resources} />
    </>
  );
}
