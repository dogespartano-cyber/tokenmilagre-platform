import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "$MILAGRE - Token Comunitário de Apoio Mútuo na Solana",
  description: "Nunca estarás sozinho. $MILAGRE é um token comunitário criado para conectar pessoas através de apoio mútuo, mentorias e esperança. Junte-se à nossa comunidade de guardiões celestiais.",
  keywords: ["MILAGRE", "token", "Solana", "crypto", "comunidade", "apoio mútuo", "pump.fun", "memecoin", "blockchain"],
  authors: [{ name: "$MILAGRE Team" }],
  creator: "$MILAGRE",
  publisher: "$MILAGRE",
  metadataBase: new URL('https://tokenmilagre.xyz'),
  openGraph: {
    title: "$MILAGRE - Nunca Estarás Sozinho 👼",
    description: "Token comunitário de apoio mútuo na Solana. Guardiões celestiais guiando holders em prosperidade, sabedoria e esperança.",
    url: 'https://tokenmilagre.xyz',
    siteName: '$MILAGRE Token',
    images: [
      {
        url: '/images/TOKEN-MILAGRE-.webp',
        width: 1200,
        height: 630,
        alt: 'Anjo Guardião do $MILAGRE',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "$MILAGRE - Nunca Estarás Sozinho 👼",
    description: "Token comunitário de apoio mútuo na Solana",
    images: ['/images/TOKEN-MILAGRE-.webp'],
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
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
