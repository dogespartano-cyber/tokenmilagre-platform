// Rota de diagnóstico temporária para verificar variáveis de ambiente
export async function GET() {
  return Response.json({
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    hasUrl: !!process.env.NEXTAUTH_URL,
    secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
    urlValue: process.env.NEXTAUTH_URL || 'NOT_FOUND',
    nodeEnv: process.env.NODE_ENV,
  });
}
