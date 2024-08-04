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
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },

  rewrites: async () => [
    {
      source: '/convex/:slug',
      destination: `${backendUrl}/i/:slug`,
    },
  ],

  // transpilePackages: ['jotai-devtools'],

  // experimental: {
  //   swcPlugins: [
  //     [
  //       '@swc-jotai/debug-label',
  //       {
  //         atomNames: ['customAtom'],
  //       },
  //     ],
  //     [
  //       '@swc-jotai/react-refresh',
  //       {
  //         atomNames: ['customAtom'],
  //       },
  //     ],
  //   ],
  // },
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
