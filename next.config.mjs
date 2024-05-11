/* eslint-disable @typescript-eslint/require-await */
/** @type {import('next').NextConfig} */

import bundleAnalyzer from '@next/bundle-analyzer'

function getBackendUrl() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) throw new Error('NEXT_PUBLIC_CONVEX_URL is not set')
  return convexUrl.replace('.cloud', '.site')
}
const backendUrl = getBackendUrl()

const nextConfig = {
  rewrites: async () => [
    {
      source: '/i/:slug',
      destination: `${backendUrl}/i/:slug`,
    },
  ],
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },
  transpilePackages: ['jotai-devtools'],
  experimental: {
    swcPlugins: [
      ['@deankerr/debug-label', { atomNames: ['customAtom'] }],
      ['@deankerr/react-refresh', { atomNames: ['customAtom'] }],
    ],
  },
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
