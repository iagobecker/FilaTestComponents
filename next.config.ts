import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/empresas/:path*',
        destination: 'http://10.0.0.84:5135/api/empresas/:path*', 
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
