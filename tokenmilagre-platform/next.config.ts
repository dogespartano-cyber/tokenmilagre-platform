import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
  },
  eslint: {
    // Desabilitar ESLint durante builds (arquivos gerados do Prisma causam erros)
    // Linting deve ser feito localmente antes do commit
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Manter validação de TypeScript - importante para type safety
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
