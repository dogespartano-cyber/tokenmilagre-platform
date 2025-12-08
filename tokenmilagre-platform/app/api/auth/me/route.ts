import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/shared/helpers/auth-helpers';

/**
 * GET /api/auth/me - Retorna informações do usuário autenticado
 * Usado pelos componentes client-side para obter role
 */
export async function GET(req: NextRequest) {
    try {
        const auth = await authenticate(req);

        if (!auth.success) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            id: auth.user.id,
            email: auth.user.email,
            name: auth.user.name,
            role: auth.user.role,
            clerkId: auth.user.clerkId,
        });
    } catch (error) {
        console.error('Erro em /api/auth/me:', error);
        return NextResponse.json(
            { error: 'Erro interno' },
            { status: 500 }
        );
    }
}
