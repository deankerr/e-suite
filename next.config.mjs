/** @type {import('next').NextConfig} */

import bundleAnalyzer from '@next/bundle-analyzer'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const images = {
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
}

const config = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      images,
      experimental: {
        swcPlugins: [
          ['@swc-jotai/react-refresh', {}],
          ['@swc-jotai/debug-label', {}],
        ],
      },
    }
  }

  return withBundleAnalyzer({
    images,
  })
}

export default config
