/** @type {import('next').NextConfig} */

import bundleAnalyzer from '@next/bundle-analyzer'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: import.meta.env?.ANALYZE === 'true',
})

const images = {
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
}

const config = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      images,
    }
  }

  return withBundleAnalyzer({
    images,
  })
}

export default config
