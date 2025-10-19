import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
  },
  eslint: {
    // Ignorar arquivos específicos durante o build
    dirs: ['app', 'components', 'lib', 'pages', 'types'],
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Não ignorar erros de TypeScript - queremos validação real
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
