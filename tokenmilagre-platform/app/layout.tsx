import type { Metadata } from "next";
// Fonts disabled for offline build
// import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import SessionProvider from "@/components/SessionProvider";
import RootLayoutNav from "./layout-root";

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
  title: "$MILAGRE - Token Comunitário de Apoio Mútuo na Solana | SPL Token",
  description: "Nunca estarás sozinho. $MILAGRE é um token SPL na Solana criado para conectar pessoas através de apoio mútuo, mentorias e esperança. Guardiões da Prosperidade, Sabedoria e Esperança. Contrato: 3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump",
  keywords: [
    "MILAGRE",
    "token",
    "Solana",
    "SPL Token",
    "crypto",
    "criptomoeda",
    "comunidade",
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
    "3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump"
  ],
  authors: [{ name: "$MILAGRE Community" }],
  creator: "$MILAGRE",
  publisher: "$MILAGRE",
  metadataBase: new URL('https://tokenmilagre.xyz'),
  openGraph: {
    title: "$MILAGRE - Nunca Estarás Sozinho ❤️",
    description: "Token SPL comunitário de apoio mútuo na Solana. Três Guardiões Celestiais guiando holders em prosperidade, sabedoria e esperança. FAQ interativa, tutorial completo e comunidade ativa.",
    url: 'https://tokenmilagre.xyz',
    siteName: '$MILAGRE Token - Comunidade de Apoio Mútuo',
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
    title: "$MILAGRE - Nunca Estarás Sozinho ❤️",
    description: "Token SPL comunitário na Solana | Guardiões da Prosperidade, Sabedoria e Esperança | Junte-se à comunidade",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const theme = savedTheme || systemTheme;
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <SessionProvider>
          <ThemeProvider>
            <RootLayoutNav>
              {children}
            </RootLayoutNav>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
