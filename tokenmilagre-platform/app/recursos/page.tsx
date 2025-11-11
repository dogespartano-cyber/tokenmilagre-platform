import Script from 'next/script';
import { getAllResources } from '@/lib/resources';
import RecursosClient from './RecursosClient';

// OTIMIZAÇÃO: Force dynamic rendering para evitar queries no build (Neon free tier quota)
export const dynamic = 'force-dynamic';

// Cache ISR: Revalida a cada 1 hora (recursos mudam raramente)
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

      <RecursosClient resources={resources} />
    </>
  );
}
