import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '$MILAGRE Token - Token Comunitário Solana | Token Milagre',
  description:
    'Token SPL na blockchain Solana que financia educação gratuita sobre criptomoedas. Transparência total, 0% tax, 100% comunidade. Junte-se a 247+ holders.',
  keywords: [
    'milagre token',
    'solana token',
    'spl token',
    'pump.fun',
    'bonding curve',
    'crypto brasil',
    'educação financeira',
    'token comunitário',
    'defi',
    'solana',
  ],
  authors: [{ name: 'Token Milagre', url: 'https://tokenmilagre.xyz' }],
  creator: 'Token Milagre',
  publisher: 'Token Milagre',

  openGraph: {
    type: 'website',
    url: 'https://tokenmilagre.xyz/token',
    title: '$MILAGRE Token - Token Comunitário Solana',
    description:
      'Token SPL na Solana que financia educação gratuita sobre criptomoedas. Transparência total, 0% tax, 100% comunidade.',
    siteName: 'Token Milagre',
    images: [
      {
        url: 'https://tokenmilagre.xyz/images/TOKEN-MILAGRE-.webp',
        width: 1200,
        height: 630,
        alt: '$MILAGRE Token Logo',
      },
    ],
    locale: 'pt_BR',
  },

  twitter: {
    card: 'summary_large_image',
    title: '$MILAGRE Token - Token Comunitário Solana',
    description:
      'Token SPL que financia educação gratuita sobre crypto. Transparência total, 0% tax, 100% comunidade.',
    images: ['https://tokenmilagre.xyz/images/TOKEN-MILAGRE-.webp'],
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

  alternates: {
    canonical: 'https://tokenmilagre.xyz/token',
  },

  other: {
    'theme-color': '#9945FF',
  },
};

export default function TokenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
