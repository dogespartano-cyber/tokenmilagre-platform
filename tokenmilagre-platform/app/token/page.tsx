/**
 * Token Page - Complete redesign for $MILAGRE token
 * High-conversion landing page with education-first approach
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Script from 'next/script';
import Hero from './components/Hero';
import BondingCurveExplainer from './components/BondingCurveExplainer';
import Tokenomics from './components/Tokenomics';
import Roadmap from './components/Roadmap';
import Community from './components/Community';
import HowToBuy from './components/HowToBuy';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 30_000,
    },
  },
});

export default function TokenPage() {
  return (
    <>
      {/* SEO & Schema.org */}
      <Script id="token-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: '$MILAGRE Token - Token Comunitário Solana',
          description:
            'Token SPL na blockchain Solana que financia educação gratuita sobre criptomoedas. Transparência total, 0% tax, 100% comunidade.',
          url: 'https://tokenmilagre.xyz/token',
          image: 'https://tokenmilagre.xyz/images/TOKEN-MILAGRE-.webp',
          publisher: {
            '@type': 'Organization',
            name: 'Token Milagre',
            logo: {
              '@type': 'ImageObject',
              url: 'https://tokenmilagre.xyz/images/TOKEN-MILAGRE-.webp',
            },
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://tokenmilagre.xyz',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Token $MILAGRE',
                item: 'https://tokenmilagre.xyz/token',
              },
            ],
          },
        })}
      </Script>

      <QueryClientProvider client={queryClient}>
        {/* Main Content */}
        <main className="min-h-screen bg-black">
          {/* Hero Section */}
          <Hero />

          {/* Bonding Curve Explainer */}
          <BondingCurveExplainer />

          {/* Tokenomics */}
          <Tokenomics />

          {/* Roadmap */}
          <Roadmap />

          {/* Community & Social Proof */}
          <Community />

          {/* How to Buy */}
          <HowToBuy />

          {/* FAQ */}
          <FAQ />

          {/* Final CTA */}
          <FinalCTA />
        </main>
      </QueryClientProvider>
    </>
  );
}
