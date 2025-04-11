import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/empresas/:path*',
        destination: 'http://localhost:5135/api/empresas/:path*', 
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
