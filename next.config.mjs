// @ts-check

import MillionLint from '@million/lint'
import bundleAnalyzer from '@next/bundle-analyzer'

function getBackendUrl() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) throw new Error('NEXT_PUBLIC_CONVEX_URL is not set')
  return convexUrl.replace('.cloud', '.site')
}

const backendUrl = getBackendUrl()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        hostname: '*',
      },
    ],
  },

  redirects: async () => {
    return [
      {
        source: '/c/:slug*',
        destination: '/chat/:slug*',
        permanent: true,
      },
      {
        source: '/suite/threads/:slug*',
        destination: '/chat/:slug*',
        permanent: true,
      },
    ]
  },

  rewrites: async () => [
    {
      source: '/convex/:slug',
      destination: `${backendUrl}/i/:slug`,
    },
  ],
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const config =
  process.env.MILLION === 'true'
    ? MillionLint.next({
        rsc: true,
      })(nextConfig)
    : withBundleAnalyzer(nextConfig)

export default config
