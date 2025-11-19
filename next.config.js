/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure we're not in static export mode - this app requires database access
  output: undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix for bcrypt issues
    if (isServer) {
      config.externals.push('bcrypt');
      config.externals.push('zlib-sync');
    }

    // Ignore problematic files from bcrypt dependencies
    config.module.rules.push({
      test: /\.html$/,
      loader: 'ignore-loader',
    });

    return config;
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
}

module.exports = nextConfig
