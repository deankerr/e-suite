import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Theme } from '@radix-ui/themes'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Chakra_Petch, IBM_Plex_Mono, Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import { ClientProviders } from '@/components/util/ClientProviders'
import { cn, environment } from '@/lib/utils'

import type { Metadata, Viewport } from 'next'

const devIndicator = '🔅'
const previewIndicator = '✴️'
const indicator =
  environment === 'dev' ? devIndicator : environment === 'prev' ? previewIndicator : ''

export const metadata: Metadata = {
  title: {
    template: `${indicator}e/suite / %s`,
    default: `${indicator}e/suite`,
  },
  description: "it's the e/suite",
}

export const viewport: Viewport = {
  themeColor: '#17120E',
  colorScheme: 'dark',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-mono',
})

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-chakra-petch',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn('overscroll-none', inter.variable, ibmPlexMono.variable, chakraPetch.variable)}
    >
      <head>
        {process.env.VERCEL_ENV === 'preview' && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            data-project-id="nbXksKI7xQWFFu6T8ARpgvCnWU91V2zWxIWYOqaZ"
            data-is-production-environment="false"
            src="https://snippet.meticulous.ai/v1/meticulous.js"
          />
        )}
      </head>

      <body>
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <ClientProviders>
            <Theme
              accentColor="orange"
              appearance="dark"
              panelBackground="solid"
              className="bg-midnight"
            >
              {children}
              <Toaster position="top-right" theme="light" closeButton richColors />
            </Theme>
          </ClientProviders>
        </ClerkProvider>
        {environment === 'prod' && (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        )}
      </body>
    </html>
  )
}
