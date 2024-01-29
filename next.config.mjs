import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

/** @type {import('next').NextConfig} */

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
        missingSuspenseWithCSRBailout: false,
        swcPlugins: [
          ['@swc-jotai/react-refresh', {}],
          ['@swc-jotai/debug-label', {}],
        ],
      },
    }
  }

  return {
    images,
    experimental: {
      missingSuspenseWithCSRBailout: false,
    },
  }
}

export default config
