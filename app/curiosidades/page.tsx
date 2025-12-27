import PageWrapper from '@/components/layout/PageWrapper';
import CuriosidadesClient from './CuriosidadesClient';

export const metadata = {
    title: 'Curiosidades Cripto | Token Milagre',
    description: 'Descubra fatos fascinantes e curiosidades sobre o mundo das criptomoedas.',
};

const header = {
    title: 'Curiosidades Cripto',
    description: 'Fatos fascinantes, marcos históricos e segredos do ecossistema blockchain.',
    shortTitle: 'Curiosidades'
};

export default function CuriosidadesPage() {
    return (
        <PageWrapper header={header}>
            <CuriosidadesClient />
        </PageWrapper>
    );
}
