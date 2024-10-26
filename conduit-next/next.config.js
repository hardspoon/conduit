/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'demo.realworld.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.stack.imgur.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig
