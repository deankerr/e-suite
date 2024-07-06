import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Theme } from '@radix-ui/themes'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { IBM_Plex_Mono, Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import { ClientProviders } from '@/components/util/ClientProviders'
import { cn, environment } from '@/lib/utils'

import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: {
    template: 'e/suite / %s',
    default: 'e/suite',
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
  weight: ['400', '500', '600'],
  variable: '--font-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, ibmPlexMono.variable)}>
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
            <Theme accentColor="orange" appearance="dark" panelBackground="solid">
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
