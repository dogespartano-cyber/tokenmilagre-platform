import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Transparência | $MILAGRE',
    description: 'Acompanhe nosso desenvolvimento, métricas e código em tempo real.',
};

export default function TransparenciaPage() {
    redirect('/sobre#transparencia');
}
