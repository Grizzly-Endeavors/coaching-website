/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure we're not in static export mode - this app requires database access
  output: undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media1.tenor.com',
      },
    ],
  },
  serverExternalPackages: ['@prisma/client', 'prisma', 'zlib-sync'],
}

module.exports = nextConfig
