/**
 * @module sentimento/page
 * @description Página educacional sobre o Índice Fear & Greed
 * @seo Índice Fear and Greed Cripto | Sentimento do Mercado Bitcoin
 */

import { Metadata } from 'next';
import SentimentoClient from './SentimentoClient';

export const metadata: Metadata = {
    title: 'Índice Fear and Greed Cripto | Sentimento do Mercado Bitcoin | $MILAGRE',
    description: 'Entenda o Índice Fear & Greed de criptomoedas: como funciona, como interpretar e como usar para suas decisões de investimento em Bitcoin.',
    keywords: ['fear and greed index', 'índice medo e ganância', 'sentimento mercado cripto', 'bitcoin fear greed', 'alternative.me', 'sentimento bitcoin'],
    openGraph: {
        title: 'Índice Fear and Greed Cripto | $MILAGRE',
        description: 'Acompanhe o sentimento do mercado de criptomoedas em tempo real.',
        type: 'website',
    },
};

export default function SentimentoPage() {
    return <SentimentoClient />;
}
