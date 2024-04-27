/** @type {import('next').NextConfig} */

import bundleAnalyzer from '@next/bundle-analyzer'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const siteUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace('.cloud', '.site')

const conf = {
  images: {
    remotePatterns: [
      // convex dev
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
      // convex prod
      {
        protocol: 'https',
        hostname: 'animated-gnu-937.convex.cloud',
        pathname: '/api/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'animated-gnu-937.convex.site',
        pathname: '/image',
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  rewrites: async () => [
    {
      source: '/i/:slug',
      destination: `${siteUrl}/i/:slug`,
    },
  ],
}

const config = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return conf
  }

  return withBundleAnalyzer(conf)
}

export default config
