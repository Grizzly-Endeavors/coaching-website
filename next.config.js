/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
    }

    // Ignore problematic files from bcrypt dependencies
    config.module.rules.push({
      test: /\.html$/,
      loader: 'ignore-loader',
    });

    return config;
  },
}

module.exports = nextConfig
