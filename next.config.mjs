/** @type {import('next').NextConfig} */
import withPlaiceholder from '@plaiceholder/next'

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'artful-husky-972.convex.cloud',
        pathname: '/api/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'artful-husky-972.convex.site',
        pathname: '/image',
      },
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
    swcPlugins: [['@swc-jotai/react-refresh', {}]],
  },
}

export default withPlaiceholder(nextConfig)
