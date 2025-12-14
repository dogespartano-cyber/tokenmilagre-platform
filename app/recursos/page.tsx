import Script from 'next/script';
import { getAllResources } from '@/lib/domains/resources/legacy-api';
import RecursosClient from './RecursosClient';

// ISR: Cache data for 60 seconds to reduce database queries
// This avoids slow remote DB calls on every request
export const revalidate = 60;

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
