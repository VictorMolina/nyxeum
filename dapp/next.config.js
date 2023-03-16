/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nyxeum.vercel.app',
        port: '',
        pathname: '/nft/**'
      }
    ],
    formats: ['image/avif', 'image/webp']
  }
}

module.exports = nextConfig
