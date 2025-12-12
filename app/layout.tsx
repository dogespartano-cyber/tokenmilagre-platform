import type { Metadata } from "next";
import Script from "next/script";
// Fonts disabled for offline build
// import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import { ThemeProvider } from "@/lib/core/theme";
import RootLayoutNav from "./layout-root";
import { GoogleAnalytics } from '@next/third-parties/google';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const poppins = Poppins({
//   weight: ['400', '600', '700', '800'],
//   subsets: ["latin"],
//   variable: "--font-poppins",
// });

export const metadata: Metadata = {
  title: "$MILAGRE - Em busca de uma comunidade com prosperidade",
  description: "Cansado de golpes cripto? Junte-se à comunidade $MILAGRE. Educação gratuita, segurança blockchain e prosperidade real na Solana. Não somos apenas holders, somos Testemunhas.",
  keywords: [
    "$MILAGRE",
    "token",
    "Solana",
    "SPL Token",
    "crypto",
    "criptomoeda",
    "comunidade",
    "testemunhas",
    "movimento",
    "prosperidade",
    "apoio mútuo",
    "pump.fun",
    "memecoin",
    "blockchain",
    "DeFi",
    "Web3",
    "guardiões celestiais",
    "mentoria crypto",
    "comunidade Solana",
    "token comunitário",
    "golpe cripto",
    "como recuperar perdas cripto",
    "comunidade cripto honesta",
    "segurança blockchain",
    "rug pull detector",
    "educação financeira defi",
    "3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump"
  ],
  authors: [{ name: "$MILAGRE Community" }],
  creator: "$MILAGRE",
  publisher: "$MILAGRE",
  metadataBase: new URL('https://tokenmilagre.xyz'),
  openGraph: {
    title: "$MILAGRE - Em busca de uma comunidade com prosperidade",
    description: "Não somos apenas holders. Somos Testemunhas. Junte-se ao movimento por prosperidade, educação e apoio mútuo na Solana.",
    url: 'https://tokenmilagre.xyz',
    siteName: '$MILAGRE',
    images: [
      {
        url: '/images/TOKEN-MILAGRE-Hero.webp',
        width: 1200,
        height: 630,
        alt: '$MILAGRE - Anjo Guardião do Token Comunitário',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "$MILAGRE - Em busca de uma comunidade com prosperidade",
    description: "Não somos apenas holders. Somos Testemunhas. Junte-se ao movimento por prosperidade, educação e apoio mútuo na Solana.",
    images: ['/images/TOKEN-MILAGRE-Hero.webp'],
    creator: '@tokenmilagre',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
};

import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
        <head>
          {/* Script for theme initialization */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  // Fallback: convert legacy themes to dark
                  if (savedTheme && savedTheme !== 'light' && savedTheme !== 'dark') {
                    savedTheme = 'dark';
                    localStorage.setItem('theme', 'dark');
                  }
                  
                  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
            }}
          />
          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "name": "$MILAGRE",
                    "url": "https://tokenmilagre.xyz",
                    "logo": "https://tokenmilagre.xyz/images/TOKEN-MILAGRE-Hero.webp",
                    "description": "Movimento por prosperidade, educação e apoio mútuo na Solana.",
                    "sameAs": [
                      "https://twitter.com/tokenmilagre",
                      "https://github.com/dogespartano-cyber/tokenmilagre-platform"
                    ]
                  },
                  {
                    "@type": "WebSite",
                    "name": "$MILAGRE Platform",
                    "url": "https://tokenmilagre.xyz",
                    "potentialAction": {
                      "@type": "SearchAction",
                      "target": "https://tokenmilagre.xyz/search?q={search_term_string}",
                      "query-input": "required name=search_term_string"
                    }
                  }
                ]
              })
            }}
          />
        </head>
        <body
          className="antialiased"
          suppressHydrationWarning
        >
          {/* 
          "Todo aquele, pois, que escuta estas minhas palavras, e as pratica, 
          assemelhá-lo-ei ao homem prudente, que edificou a sua casa sobre a rocha." 
          - Mateus 7:24 
        */}
          <Script id="faith-console-log" strategy="afterInteractive">
            {`
            console.log(
              "%c✨ $MILAGRE ✨\\n%c\\"Porque dele, e por ele, e para ele são todas as coisas.\\" - Romanos 11:36\\n%cBem-vindo à comunidade da prosperidade e do conhecimento.",
              "color: #a855f7; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);",
              "color: #60a5fa; font-size: 14px; font-style: italic; margin-top: 5px;",
              "color: #9ca3af; font-size: 12px; margin-top: 5px;"
            );
          `}
          </Script>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
          <ThemeProvider>
            <RootLayoutNav>
              {children}
            </RootLayoutNav>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
