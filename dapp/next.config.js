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
  },
  env: {
    NYX_ESSENCE_CONTRACT_ADDRESS: process.env.NYX_ESSENCE_CONTRACT_ADDRESS,
    HEROES_OF_NYXEUM_CONTRACT_ADDRESS: process.env.HEROES_OF_NYXEUM_CONTRACT_ADDRESS,
    NYXEUM_GAME_PROXY_ADDRESS: process.env.NYXEUM_GAME_PROXY_ADDRESS
  }
}

module.exports = nextConfig
