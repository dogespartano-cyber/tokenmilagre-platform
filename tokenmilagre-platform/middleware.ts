export { default } from 'next-auth/middleware';

export const config = {
  // Dashboard agora é público - apenas rotas admin protegidas
  matcher: ['/admin/:path*']
};
