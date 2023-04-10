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
  },
  async headers() {
    return [
      {
        source: "/api/nft/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
        ]
      }
    ]
  }
}

module.exports = nextConfig
