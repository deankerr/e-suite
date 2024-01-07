/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// use standard git staging url for staging branch
const url =
  process.env.VERCEL_GIT_COMMIT_REF === 'staging'
    ? process.env.VERCEL_BRANCH_URL
    : process.env.VERCEL_URL

const nextConfig = {
  env: {
    KINDE_SITE_URL: process.env.KINDE_SITE_URL ?? `https://${url}`,
    KINDE_POST_LOGOUT_REDIRECT_URL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL ?? `https://${url}`,
    KINDE_POST_LOGIN_REDIRECT_URL: process.env.KINDE_POST_LOGIN_REDIRECT_URL ?? `https://${url}`,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'artful-husky-972.convex.cloud',
        pathname: '/api/storage/**',
      },
      {
        protocol: 'https',
        hostname: '**.civitai.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
    ],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
